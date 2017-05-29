/* @flow */

import React from "react";
import Relay from "react-relay/classic";
import urlJoin from "url-join";
import { connect } from "react-redux";
import { compose } from "recompose";

import { Row } from "@ncigdc/uikit/Flex";
import Button from "@ncigdc/uikit/Button";

import SearchPage from "@ncigdc/components/SearchPage";
import TabbedLinks from "@ncigdc/components/TabbedLinks";
import AnnotationsLink from "@ncigdc/components/Links/AnnotationsLink";
import NoResultsMessage from "@ncigdc/components/NoResultsMessage";
import DownloadButton from "@ncigdc/components/DownloadButton";

import CaseTable from "@ncigdc/containers/CaseTable";
import CaseAggregations from "@ncigdc/containers/CaseAggregations";
import FileTable from "@ncigdc/containers/FileTable";
import FileAggregations from "@ncigdc/containers/FileAggregations";
import { fetchFilesAndAdd } from "@ncigdc/dux/cart";
import {
  ShoppingCartIcon,
  FileIcon,
  CaseIcon,
  SaveIcon
} from "@ncigdc/theme/icons";
import withFilters from "@ncigdc/utils/withFilters";
import formatFileSize from "@ncigdc/utils/formatFileSize";
import RepoCasesPies from "@ncigdc/components/TabPieCharts/RepoCasesPies";
import RepoFilesPies from "@ncigdc/components/TabPieCharts/RepoFilesPies";

export type TProps = {
  relay: Object,
  dispatch: Function,
  filters: any,
  viewer: {
    autocomplete_case: {
      hits: Array<Object>
    },
    autocomplete_file: {
      hits: Array<Object>
    },
    cart_summary: {
      aggregations: {
        fs: {
          value: number
        }
      }
    },
    repository: {
      cases: {
        aggregations: string,
        hits: {
          total: number
        }
      },
      files: {
        aggregations: string,
        hits: {
          total: number
        }
      }
    }
  },
  showFacets: boolean,
  setShowFacets: Function
};

const enhance = compose(connect(), withFilters());

export const RepositoryPageComponent = (props: TProps) => {
  const setAutocompleteCases = value =>
    props.relay.setVariables({
      idAutocompleteCase: value,
      runAutocompleteCase: !!value
    });

  const setAutocompleteFiles = value =>
    props.relay.setVariables({
      idAutocompleteFile: value,
      runAutocompleteFile: !!value
    });

  const fileCount = props.viewer.repository.files.hits.total;
  const caseCount = props.viewer.repository.cases.hits.total;
  const fileSize = props.viewer.cart_summary.aggregations.fs.value;

  return (
    <div>
      <SearchPage
        filtersLinkProps={{
          hideLinkOnEmpty: false,
          linkPathname: "/query",
          linkText: "Advanced Search"
        }}
        facetTabs={[
          {
            id: "cases",
            text: "Cases",
            component: (
              <CaseAggregations
                aggregations={props.viewer.repository.cases.aggregations}
                hits={(props.viewer.repository.cases || {}).hits || {}}
                suggestions={
                  (props.viewer.autocomplete_case || { hits: [] }).hits
                }
                setAutocomplete={setAutocompleteCases}
              />
            )
          },
          {
            id: "files",
            text: "Files",
            component: (
              <FileAggregations
                aggregations={props.viewer.repository.files.aggregations}
                suggestions={
                  (props.viewer.autocomplete_file || { hits: [] }).hits
                }
                setAutocomplete={setAutocompleteFiles}
              />
            )
          }
        ]}
        results={
          <span>
            <Row
              style={{
                justifyContent: "space-between",
                padding: "0 0 2rem",
                alignItems: "center"
              }}
            >
              <Row>
                <Button
                  onClick={() =>
                    props.dispatch(fetchFilesAndAdd(props.filters, fileCount))}
                  leftIcon={<ShoppingCartIcon />}
                >
                  Add All Files to Cart
                </Button>
                <DownloadButton
                  disabled={!fileCount}
                  url={urlJoin(process.env.REACT_APP_API, "files")}
                  activeText="Downloading"
                  inactiveText="Download Manifest"
                  fields={[
                    "file_id",
                    "file_name",
                    "md5sum",
                    "file_size",
                    "state"
                  ]}
                  returnType="manifest"
                  filters={props.filters}
                />
              </Row>
              <AnnotationsLink>
                <i className="fa fa-edit" /> Browse Annotations
              </AnnotationsLink>
            </Row>
            <TabbedLinks
              queryParam="searchTableTab"
              defaultIndex={0}
              tabToolbar={
                <Row spacing="2rem" style={{ alignItems: "center" }}>
                  {/*<span style={{ flex: 'none' }}>
                    <CaseIcon outline style={{ marginRight: 5 }} /> <strong>{caseCount.toLocaleString()}</strong> cases
                  </span>
                  <span style={{ flex: 'none' }}>
                    <FileIcon text style={{ marginRight: 5 }} /> <strong>{fileCount.toLocaleString()}</strong> files
                  </span>*/}
                  <span style={{ flex: "none" }}>
                    <SaveIcon style={{ marginRight: 5 }} />
                    {" "}
                    <strong>{formatFileSize(fileSize)}</strong>
                  </span>
                </Row>
              }
              links={[
                {
                  id: "cases",
                  text: `Cases (${caseCount.toLocaleString()})`,
                  component: !!props.viewer.repository.cases.hits.total
                    ? <div>
                        <RepoCasesPies
                          aggregations={
                            props.viewer.repository.cases.aggregations
                          }
                        />
                        <CaseTable hits={props.viewer.repository.cases.hits} />
                      </div>
                    : <NoResultsMessage>
                        No results found using those filters.
                      </NoResultsMessage>
                },
                {
                  id: "files",
                  text: `Files (${fileCount.toLocaleString()})`,
                  component: !!props.viewer.repository.files.hits.total
                    ? <div>
                        <RepoFilesPies
                          aggregations={
                            props.viewer.repository.files.aggregations
                          }
                        />
                        <FileTable hits={props.viewer.repository.files.hits} />
                      </div>
                    : <NoResultsMessage>
                        No results found using those filters.
                      </NoResultsMessage>
                }
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
    runAutocompleteFile: false
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
          cases {
            aggregations(filters: $filters) {
              ${CaseAggregations.getFragment("aggregations")}
              ${RepoCasesPies.getFragment("aggregations")}
            }
            hits(first: $cases_size offset: $cases_offset, filters: $filters, sort: $cases_sort) {
              ${CaseTable.getFragment("hits")}
              total
            }
          }
          files {
            aggregations(filters: $filters) {
              ${FileAggregations.getFragment("aggregations")}
              ${RepoFilesPies.getFragment("aggregations")}
            }
            hits(first: $files_size offset: $files_offset, filters: $filters, sort: $files_sort) {
              ${FileTable.getFragment("hits")}
              total
            }
          }
        }
      }
    `
  }
};

const RepositoryPage = Relay.createContainer(
  enhance(RepositoryPageComponent),
  RepositoryPageQuery
);

export default RepositoryPage;
