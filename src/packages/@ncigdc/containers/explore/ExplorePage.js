/* @flow */
import React from 'react';
import Relay from 'react-relay/classic';
import { get, isEqual } from 'lodash';
import withRouter from '@ncigdc/utils/withRouter';
import SearchPage from '@ncigdc/components/SearchPage';
import TabbedLinks from '@ncigdc/components/TabbedLinks';
import GenesTab from '@ncigdc/components/Explore/GenesTab';
import MutationsTab from '@ncigdc/components/Explore/MutationsTab';
import OncogridTab from '@ncigdc/components/Explore/OncogridTab';
import CasesTab from '@ncigdc/components/Explore/CasesTab';
import NoResultsMessage from '@ncigdc/components/NoResultsMessage';
import CaseAggregations from '@ncigdc/containers/explore/CaseAggregations';
import GeneAggregations from '@ncigdc/modern_components/GeneAggregations';
import SSMAggregations from '@ncigdc/containers/explore/SSMAggregations';
import ClinicalAggregations from '@ncigdc/containers/explore/ClinicalAggregations';
import Summary from '@ncigdc/components/Explore/Summary';
import { CreateExploreCaseSetButton } from '@ncigdc/modern_components/withSetAction';
import { makeFilter, replaceFilters } from '@ncigdc/utils/filters';
import { stringifyJSONParam } from '@ncigdc/utils/uri';
import { Row } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import ResizeDetector from 'react-resize-detector';

export type TProps = {
  filters: {},
  relay: Object,
  viewer: {
    autocomplete_cases: { hits: Array<Object> },
    autocomplete_ssms: { hits: Array<Object> },
    explore: {
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
        aggregations: string,
        hits: {
          total: number,
        },
      },
      genes: {
        aggregations: string,
        hits: {
          total: number,
        },
      },
      ssms: {
        aggregations: string,
        hits: {
          total: number,
        },
      },
    },
  },
  showFacets: boolean,
  setShowFacets: Function,
  push: Function,
};

function setVariables({ filters, relay }) {
  relay.setVariables({
    cosmicFilters: replaceFilters(
      {
        content: [
          {
            content: {
              field: 'cosmic_id',
              value: ['MISSING'],
            },
            op: 'not',
          },
        ],
        op: 'and',
      },
      filters,
    ),
    dbsnpRsFilters: replaceFilters(
      {
        content: [
          {
            content: {
              field: 'consequence.transcript.annotation.dbsnp_rs',
              value: ['MISSING'],
            },
            op: 'not',
          },
        ],
        op: 'and',
      },
      filters,
    ),
  });
}
const noResultsMessageStyle = { minHeight: 387 };

export class ExplorePageComponent extends React.Component {
  state = {
    maxFacetsPanelHeight: 0,
  }

  componentDidMount() {
    setVariables(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { filters } = this.props;
    if (!isEqual(filters, nextProps.filters)) {
      setVariables(nextProps);
    }
  }

  render() {
    const {
      filters,
      push,
      relay,
      viewer,
    } = this.props;
    const { maxFacetsPanelHeight } = this.state;

    const hasCaseHits = get(viewer, 'explore.cases.hits.total', 0);
    const hasGeneHits = get(viewer, 'explore.genes.hits.total', 0);
    const hasSsmsHits = get(viewer, 'explore.ssms.hits.total', 0);

    return (
      <SearchPage
        className="test-explore-page"
        facetTabs={[
          {
            component: (
              <CaseAggregations
                aggregations={viewer.explore.cases.aggregations}
                facets={viewer.explore.customCaseFacets}
                maxFacetsPanelHeight={maxFacetsPanelHeight}
                setAutocomplete={(value, onReadyStateChange) => relay.setVariables(
                  {
                    idAutocompleteCases: value,
                    runAutocompleteCases: !!value,
                  },
                  onReadyStateChange,
                )}
                suggestions={get(viewer, 'autocomplete_cases.hits', [])}
                />
            ),
            id: 'cases',
            text: 'Cases',
          },
          {
            component: (
              <ClinicalAggregations
                aggregations={viewer.explore.cases.aggregations}
                caseFacets={viewer.caseFacets}
                docType="cases"
                facets={viewer.explore.customCaseFacets}
                globalFilters={filters}
                maxFacetsPanelHeight={maxFacetsPanelHeight}
                relayVarName="exploreCaseCustomFacetFields"
                />
            ),
            id: 'clinical',
            text: 'Clinical',
          },
          {
            component: (
              <GeneAggregations relay={relay} />
            ),
            id: 'genes',
            text: 'Genes',
          },
          {
            component: (
              <SSMAggregations
                aggregations={viewer.explore.ssms.aggregations}
                defaultFilters={filters}
                maxFacetsPanelHeight={maxFacetsPanelHeight}
                setAutocomplete={(value, onReadyStateChange) => relay.setVariables(
                  {
                    idAutocompleteSsms: value,
                    runAutocompleteSsms: !!value,
                  },
                  onReadyStateChange,
                )}
                ssms={viewer.explore.ssms}
                suggestions={get(viewer, 'autocomplete_ssms.hits', [])}
                />
            ),
            id: 'mutations',
            text: 'Mutations',
          },
        ]}
        results={({ showFacets }) => (
          <span>
            <ResizeDetector
              handleHeight
              onResize={(width, height) => this.setState({ maxFacetsPanelHeight: height })}
              />
            <Row>
              {filters ? (
                <CreateExploreCaseSetButton
                  disabled={!hasCaseHits}
                  filters={filters}
                  onComplete={setId => {
                    push({
                      pathname: '/repository',
                      query: {
                        filters: stringifyJSONParam({
                          content: [
                            {
                              content: {
                                field: 'cases.case_id',
                                value: [`set_id:${setId}`],
                              },
                              op: 'IN',
                            },
                          ],
                          op: 'AND',
                        }),
                      },
                    });
                  }}
                  style={{ marginBottom: '2rem' }}
                  >
                  View Files in Repository
                </CreateExploreCaseSetButton>
              ) : (
                <Button
                  disabled={!hasCaseHits}
                  onClick={() => push({
                    pathname: '/repository',
                  })}
                  style={{ marginBottom: '2rem' }}
                  >
                  View Files in Repository
                </Button>
              )}
            </Row>
            <TabbedLinks
              defaultIndex={0}
              links={[
                {
                  component: viewer.explore.cases.hits.total ? (
                    <Summary
                      elements={[
                        1,
                        1,
                        1,
                        1,
                        2,
                        1,
                        1,
                        1,
                        3,
                      ]} // For demonstration only
                      showFacets={showFacets}
                      />
                  ) : (
                    <NoResultsMessage>No Cases Found.</NoResultsMessage>
                    ),
                  id: 'summary',
                  text: 'Summary',
                },
                {
                  id: 'cases',
                  text: `Cases (${viewer.explore.cases.hits.total.toLocaleString()})`,
                  component: hasCaseHits ? (
                    <CasesTab />
                  ) : (
                    <NoResultsMessage>No Cases Found.</NoResultsMessage>
                  ),
                  id: 'cases',
                  text: `Cases (${hasCaseHits.toLocaleString()})`,
                },
                {
                  component: hasGeneHits ? (
                    <GenesTab viewer={viewer} />
                  ) : (
                    <NoResultsMessage>No Genes Found.</NoResultsMessage>
                  ),
                  filters: filters || makeFilter([
                    {
                      field: 'genes.is_cancer_gene_census',
                      value: ['true'],
                    },
                  ]),
                  id: 'genes',
                  text: `Genes (${hasGeneHits.toLocaleString()})`,
                },
                {
                  component: hasSsmsHits ? (
                    <MutationsTab
                      totalNumCases={hasCaseHits}
                      viewer={viewer}
                      />
                  ) : (
                    <NoResultsMessage>No Mutations Found.</NoResultsMessage>
                  ),
                  id: 'mutations',
                  text: `Mutations (${hasSsmsHits.toLocaleString()})`,
                },
                {
                  component: <OncogridTab />,
                  id: 'oncogrid',
                  text: 'OncoGrid',
                },
              ]}
              queryParam="searchTableTab"
              />
          </span>
        )}
        />
    );
  }
}

export const ExplorePageQuery = {
  initialVariables: {
    cases_offset: null,
    cases_size: null,
    cases_sort: null,
    cases_score: 'gene.gene_id',
    genes_offset: null,
    genes_size: null,
    genes_sort: null,
    ssms_offset: null,
    ssms_size: null,
    ssms_sort: null,
    filters: null,
    idAutocompleteCases: null,
    runAutocompleteCases: false,
    idAutocompleteSsms: null,
    runAutocompleteSsms: false,
    dbsnpRsFilters: null,
    cosmicFilters: null,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
        autocomplete_cases: query (query: $idAutocompleteCases types: ["case"]) @include(if: $runAutocompleteCases) {
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
        autocomplete_ssms: query (query: $idAutocompleteSsms types: ["ssm_centric"]) @include(if: $runAutocompleteSsms) {
          hits {
            id
            ...on Ssm {
              ssm_id
              cosmic_id
              gene_aa_change
              genomic_dna_change
            }
          }
        }
        caseFacets: __type(name: "ExploreCases"){
          name
          fields {
            description
            name
            type {
              name
              fields
              {
                name
                description
                type {
                  name }
              }
            }
          }
        }
        explore {
          customCaseFacets: cases {
            ${CaseAggregations.getFragment('facets')}
          }
          cases {
            aggregations(filters: $filters aggregations_filter_themselves: false) {
              ${CaseAggregations.getFragment('aggregations')}
            }
            hits(first: $cases_size offset: $cases_offset filters: $filters score: $cases_score sort: $cases_sort) {
              total
            }
          }
          genes {
            hits(first: $genes_size offset: $genes_offset, filters: $filters) {
              total
            }
          }
          cnvs {
            hits(first: $genes_size offset: $genes_offset, filters: $filters) {
              total
            }
          }
          ssms {
            aggregations(filters: $filters aggregations_filter_themselves: false) {
              ${SSMAggregations.getFragment('aggregations')}
            }
            hits(first: $ssms_size offset: $ssms_offset, filters: $filters) {
              total
            }
            cosmic_id_not_missing: hits(filters: $cosmicFilters) {
              total
            }
            dbsnp_rs_not_missing: hits(filters: $dbsnpRsFilters) {
              total
            }
          }
        }
      }
    `,
  },
};

const ExplorePage = Relay.createContainer(
  withRouter(ExplorePageComponent),
  ExplorePageQuery,
);

export default ExplorePage;
