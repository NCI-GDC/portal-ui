/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';
import { connect } from 'react-redux';
import { compose, setDisplayName } from 'recompose';

import { Row } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';

import SearchPage from '@ncigdc/components/SearchPage';
import TabbedLinks from '@ncigdc/components/TabbedLinks';
import AnnotationsLink from '@ncigdc/components/Links/AnnotationsLink';
import NoResultsMessage from '@ncigdc/components/NoResultsMessage';
import DownloadManifestButton from '@ncigdc/components/DownloadManifestButton';

import CasesTable from '@ncigdc/containers/CasesTable';
import CaseAggregations from '@ncigdc/containers/CaseAggregations';
import FilesTable from '@ncigdc/modern_components/FilesTable';
import FileAggregations from '@ncigdc/containers/FileAggregations';
import { fetchFilesAndAdd } from '@ncigdc/dux/cart';
import { ShoppingCartIcon, SaveIcon } from '@ncigdc/theme/icons';
import withFilters from '@ncigdc/utils/withFilters';
import formatFileSize from '@ncigdc/utils/formatFileSize';
import RepoCasesPies from '@ncigdc/components/TabPieCharts/RepoCasesPies';
import RepoFilesPies from '@ncigdc/components/TabPieCharts/RepoFilesPies';
import CreateRepositoryCaseSetButton from '@ncigdc/modern_components/setButtons/CreateRepositoryCaseSetButton';
import withRouter from '@ncigdc/utils/withRouter';
import { stringifyJSONParam } from '@ncigdc/utils/uri';

export type TProps = {
  push: Function,
  relay: Object,
  dispatch: Function,
  filters: any,
  viewer: {
    autocomplete_case: {
      hits: Array<Object>,
    },
    autocomplete_file: {
      hits: Array<Object>,
    },
    cart_summary: {
      aggregations: {
        fs: {
          value: number,
        },
      },
    },
    repository: {
      customCaseFacets: {
        facets: {
          facets: string,
        },
      },
      customFileFacets: {
        facets: {
          facets: string,
        },
      },
      cases: {
        aggregations: {},
        pies: {},
        hits: {
          total: number,
        },
      },
      files: {
        aggregations: {},
        pies: {},
        hits: {
          total: number,
        },
      },
    },
  },
  showFacets: boolean,
  setShowFacets: Function,
};

const enhance = compose(
  setDisplayName('RepositoryPage'),
  connect(),
  withFilters(),
  withRouter,
);

export const RepositoryPageComponent = (props: TProps) => {
  const setAutocompleteCases = (value, onReadyStateChange) =>
    props.relay.setVariables(
      {
        idAutocompleteCase: value,
        runAutocompleteCase: !!value,
      },
      onReadyStateChange,
    );

  const setAutocompleteFiles = (value, onReadyStateChange) =>
    props.relay.setVariables(
      {
        idAutocompleteFile: value,
        runAutocompleteFile: !!value,
      },
      onReadyStateChange,
    );

  const fileCount = props.viewer.repository.files.hits.total;
  const caseCount = props.viewer.repository.cases.hits.total;
  const fileSize = props.viewer.cart_summary.aggregations.fs.value;

  return (
    <div className="test-repository-page">
      <SearchPage
        filtersLinkProps={{
          hideLinkOnEmpty: false,
          linkPathname: '/query',
          linkText: 'Advanced Search',
        }}
        facetTabs={[
          {
            id: 'files',
            text: 'Files',
            component: (
              <FileAggregations
                facets={props.viewer.repository.customFileFacets}
                aggregations={props.viewer.repository.files.aggregations}
                filters={props.filters}
                suggestions={
                  (props.viewer.autocomplete_file || { hits: [] }).hits
                }
                setAutocomplete={setAutocompleteFiles}
              />
            ),
          },
          {
            id: 'cases',
            text: 'Cases',
            component: (
              <CaseAggregations
                facets={props.viewer.repository.customCaseFacets}
                filters={props.filters}
                aggregations={props.viewer.repository.cases.aggregations}
                hits={(props.viewer.repository.cases || {}).hits || {}}
                suggestions={
                  (props.viewer.autocomplete_case || { hits: [] }).hits
                }
                setAutocomplete={setAutocompleteCases}
              />
            ),
          },
        ]}
        results={
          <span>
            <Row
              style={{
                justifyContent: 'space-between',
                padding: '0 0 2rem',
                alignItems: 'center',
              }}
            >
              <Row spacing="0.2rem">
                <Button
                  onClick={() =>
                    props.dispatch(fetchFilesAndAdd(props.filters, fileCount))}
                  leftIcon={<ShoppingCartIcon />}
                >
                  Add All Files to Cart
                </Button>
                <DownloadManifestButton
                  fileCount={fileCount}
                  filters={props.filters}
                />
                <CreateRepositoryCaseSetButton
                  filters={props.filters}
                  disabled={!caseCount}
                  style={{ paddingLeft: '5px' }}
                  onComplete={setId => {
                    props.push({
                      pathname: '/exploration',
                      query: {
                        filters: stringifyJSONParam({
                          op: 'AND',
                          content: [
                            {
                              op: 'IN',
                              content: {
                                field: 'cases.case_id',
                                value: [`set_id:${setId}`],
                              },
                            },
                          ],
                        }),
                      },
                    });
                  }}
                >
                  View {caseCount.toLocaleString()}{' '}
                  {caseCount === 1 ? ' Case' : ' Cases'} in
                  Exploration
                </CreateRepositoryCaseSetButton>
              </Row>
              <AnnotationsLink>
                <i className="fa fa-edit" /> Browse Annotations
              </AnnotationsLink>
            </Row>
            <TabbedLinks
              queryParam="searchTableTab"
              defaultIndex={0}
              tabToolbar={
                <Row spacing="2rem" style={{ alignItems: 'center' }}>
                  {/*<span style={{ flex: 'none' }}>
                    <CaseIcon outline style={{ marginRight: 5 }} /> <strong>{caseCount.toLocaleString()}</strong> cases
                  </span>
                  <span style={{ flex: 'none' }}>
                    <FileIcon text style={{ marginRight: 5 }} /> <strong>{fileCount.toLocaleString()}</strong> files
                  </span>*/}
                  <span style={{ flex: 'none' }}>
                    <SaveIcon style={{ marginRight: 5 }} />
                    {' '}
                    <strong>{formatFileSize(fileSize)}</strong>
                  </span>
                </Row>
              }
              links={[
                {
                  id: 'files',
                  text: `Files (${fileCount.toLocaleString()})`,
                  component: !!props.viewer.repository.files.hits.total
                    ? <div>
                        <RepoFilesPies
                          aggregations={props.viewer.repository.files.pies}
                        />
                        <FilesTable />
                      </div>
                    : <NoResultsMessage>
                        No results found using those filters.
                      </NoResultsMessage>,
                },
                {
                  id: 'cases',
                  text: `Cases (${caseCount.toLocaleString()})`,
                  component: !!props.viewer.repository.cases.hits.total
                    ? <div>
                        <RepoCasesPies
                          aggregations={props.viewer.repository.cases.pies}
                        />
                        <CasesTable
                          hits={props.viewer.repository.cases.hits}
                          filters={props.filters}
                        />
                      </div>
                    : <NoResultsMessage>
                        No results found using those filters.
                      </NoResultsMessage>,
                },
              ]}
            />
          </span>
        }
      />
    </div>
  );
};

export const RepositoryPageQuery = {
  initialVariables: {
    cases_offset: null,
    cases_size: null,
    cases_sort: null,
    files_offset: null,
    files_size: null,
    files_sort: null,
    filters: null,
    idAutocompleteCase: null,
    idAutocompleteFile: null,
    runAutocompleteCase: false,
    runAutocompleteFile: false,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
        autocomplete_case: query (query: $idAutocompleteCase types: ["case"]) @include(if: $runAutocompleteCase) {
          hits {
            id
            ...on Case {
              case_id
              project {
                project_id
              }
              submitter_id
            }
          }
        }
        autocomplete_file: query (query: $idAutocompleteFile types: ["file"]) @include(if: $runAutocompleteFile) {
          hits {
            id
            ... on File {
              file_id
              file_name
              submitter_id
            }
          }
        }
        cart_summary {
          aggregations(filters: $filters) {
            fs {
              value
            }
          }
        }
        repository {
          customCaseFacets: cases {
            ${CaseAggregations.getFragment('facets')}
          }
          customFileFacets: files {
            ${FileAggregations.getFragment('facets')}
          }
          cases {
            aggregations(filters: $filters aggregations_filter_themselves: false) {
              ${CaseAggregations.getFragment('aggregations')}
            }
            pies: aggregations(filters: $filters aggregations_filter_themselves: true) {
              ${RepoCasesPies.getFragment('aggregations')}
            }
            hits(score: "annotations.annotation_id" first: $cases_size offset: $cases_offset, filters: $filters, sort: $cases_sort) {
              ${CasesTable.getFragment('hits')}
              total
            }
          }
          files {
            aggregations(filters: $filters aggregations_filter_themselves: false) {
              ${FileAggregations.getFragment('aggregations')}
            }
            pies: aggregations(filters: $filters aggregations_filter_themselves: true) {
              ${RepoFilesPies.getFragment('aggregations')}
            }
            hits(first: $files_size offset: $files_offset, filters: $filters, sort: $files_sort) {
              total
            }
          }
        }
      }
    `,
  },
};

const RepositoryPage = Relay.createContainer(
  enhance(RepositoryPageComponent),
  RepositoryPageQuery,
);

export default RepositoryPage;
