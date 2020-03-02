/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';
import { connect } from 'react-redux';
import { compose, setDisplayName } from 'recompose';
import SearchPage from '@ncigdc/components/SearchPage';
import TabbedLinks from '@ncigdc/components/TabbedLinks';
import NoResultsMessage from '@ncigdc/components/NoResultsMessage';
import RepoCasesTable from '@ncigdc/modern_components/RepoCasesTable';
import CaseAggregations from '@ncigdc/modern_components/CaseAggregations';
import FileAggregations from '@ncigdc/modern_components/FileAggregations';

import FilesTable from '@ncigdc/modern_components/FilesTable';
import withFilters from '@ncigdc/utils/withFilters';
import RepoCasesPies from '@ncigdc/components/TabPieCharts/RepoCasesPies';
import RepoFilesPies from '@ncigdc/components/TabPieCharts/RepoFilesPies';
import withRouter from '@ncigdc/utils/withRouter';
import ActionsRow from '@ncigdc/components/ActionsRow';

export type TProps = {
  push: Function,
  relay: Object,
  dispatch: Function,
  filters: any,
  cases_sort: any,
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
  const fileCount = props.viewer.repository.files.hits.total;
  const caseCount = props.viewer.repository.cases.hits.total;
  const fileSize = props.viewer.cart_summary.aggregations.fs.value;
  return (
    <div className="test-repository-page">
      <SearchPage
        facetTabs={[
          {
            id: 'files',
            text: 'Files',
            component: <FileAggregations relay={props.relay} />,
          },
          {
            id: 'cases',
            text: 'Cases',
            component: <CaseAggregations relay={props.relay} />,
          },
        ]}
        filtersLinkProps={{
          hideLinkOnEmpty: false,
          linkPathname: '/query',
          linkText: 'Advanced Search',
        }}
        pageName="repository"
        results={(
          <TabbedLinks
            defaultIndex={0}
            links={[
              {
                id: 'files',
                text: `Files (${fileCount.toLocaleString()})`,
                component: props.viewer.repository.files.hits.total ? (
                  <div>
                    <RepoFilesPies
                      aggregations={props.viewer.repository.files.pies}
                      />
                    <FilesTable fileSize={fileSize} />
                  </div>
                ) : (
                  <NoResultsMessage>
                    No results found using those filters.
                  </NoResultsMessage>
                ),
              },
              {
                id: 'cases',
                text: `Cases (${caseCount.toLocaleString()})`,
                component: props.viewer.repository.cases.hits.total ? (
                  <div>
                    <RepoCasesPies
                      aggregations={props.viewer.repository.cases.pies}
                      />
                    <RepoCasesTable />
                  </div>
                ) : (
                  <NoResultsMessage>
                    No results found using those filters.
                  </NoResultsMessage>
                ),
              },
            ]}
            queryParam="searchTableTab"
            tabToolbar={(
              <ActionsRow
                filters={props.filters}
                totalCases={caseCount}
                totalFiles={fileCount}
                />
            )}
            />
        )}
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
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
        cart_summary {
          aggregations(filters: $filters) {
            fs {
              value
            }
          }
        }
        repository {

          cases {
            pies: aggregations(filters: $filters aggregations_filter_themselves: true) {
              ${RepoCasesPies.getFragment('aggregations')}
            }
            hits(score: "annotations.annotation_id" first: $cases_size offset: $cases_offset, filters: $filters, sort: $cases_sort) {
              total
            }
          }
          files {

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
