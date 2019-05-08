/* @flow */
import React from 'react';
import Relay from 'react-relay/classic';
import { get, isEqual } from 'lodash';
import { compose, withState, lifecycle } from 'recompose';

import withRouter from '@ncigdc/utils/withRouter';
import SearchPage from '@ncigdc/components/SearchPage';
import TabbedLinks from '@ncigdc/components/TabbedLinks';
import GenesTab from '@ncigdc/components/Explore/GenesTab';
import MutationsTab from '@ncigdc/components/Explore/MutationsTab';
import OncogridTab from '@ncigdc/components/Explore/OncogridTab';
import CasesTab from '@ncigdc/components/Explore/CasesTab';
import NoResultsMessage from '@ncigdc/components/NoResultsMessage';
import CaseAggregations from '@ncigdc/containers/explore/CaseAggregations';
import GeneAggregations from '@ncigdc/containers/explore/GeneAggregations';
import SSMAggregations from '@ncigdc/containers/explore/SSMAggregations';
import ClinicalAggregations from '@ncigdc/containers/explore/ClinicalAggregations';
import { CreateExploreCaseSetButton } from '@ncigdc/modern_components/withSetAction';
import { replaceFilters } from '@ncigdc/utils/filters';
import { stringifyJSONParam } from '@ncigdc/utils/uri';
import { Row } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import ResizeDetector from 'react-resize-detector';

export type TProps = {
  filters: {},
  relay: Object,
  viewer: {
    autocomplete_cases: { hits: Array<Object> },
    autocomplete_genes: { hits: Array<Object> },
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

function setVariables({ relay, filters }) {
  relay.setVariables({
    cosmicFilters: replaceFilters(
      {
        op: 'and',
        content: [
          {
            op: 'not',
            content: {
              field: 'cosmic_id',
              value: ['MISSING'],
            },
          },
        ],
      },
      filters,
    ),
    dbsnpRsFilters: replaceFilters(
      {
        op: 'and',
        content: [
          {
            op: 'not',
            content: {
              field: 'consequence.transcript.annotation.dbsnp_rs',
              value: ['MISSING'],
            },
          },
        ],
      },
      filters,
    ),
  });
}

const enhance = compose(
  withRouter,
  withState('maxFacetsPanelHeight', 'setMaxFacetsPanelHeight', 0),
  lifecycle({
    componentDidMount() {
      setVariables(this.props);
    },
    componentWillReceiveProps(nextProps) {
      if (!isEqual(this.props.filters, nextProps.filters)) {
        setVariables(nextProps);
      }
    },
  }),
);
export const ExplorePageComponent = ({
  viewer,
  filters,
  relay,
  push,
  maxFacetsPanelHeight,
  setMaxFacetsPanelHeight,
}: TProps) => (
  <SearchPage
      className="test-explore-page"
      facetTabs={[
        {
          id: 'cases',
          text: 'Cases',
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
        },
        {
          id: 'clinical',
          text: 'Clinical',
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
        },
        {
          id: 'genes',
          text: 'Genes',
          component: (
            <GeneAggregations
              aggregations={viewer.explore.genes.aggregations}
              cnvAggregations={viewer.explore.cnvs.aggregations}
              setAutocomplete={(value, onReadyStateChange) => relay.setVariables(
                {
                  idAutocompleteGenes: value,
                  runAutocompleteGenes: !!value,
                },
                onReadyStateChange,
              )}
              suggestions={get(viewer, 'autocomplete_genes.hits', [])}
              />
          ),
        },
        {
          id: 'mutations',
          text: 'Mutations',
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
        },
      ]}
      results={(
        <span>
          <ResizeDetector
            handleHeight
            onResize={(width, height) => setMaxFacetsPanelHeight(height)}
            />
          <Row>
            {filters ? (
              <CreateExploreCaseSetButton
                disabled={!viewer.explore.cases.hits.total}
                filters={filters}
                onComplete={setId => {
                  push({
                    pathname: '/repository',
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
                style={{ marginBottom: '2rem' }}
                >
                View Files in Repository
              </CreateExploreCaseSetButton>
            ) : (
              <Button
                  disabled={!viewer.explore.cases.hits.total}
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
                id: 'cases',
                text: `Cases (${viewer.explore.cases.hits.total.toLocaleString()})`,
                component: viewer.explore.cases.hits.total ? (
                  <CasesTab />
                ) : (
                  <NoResultsMessage>No Cases Found.</NoResultsMessage>
                  ),
              },
              {
                id: 'genes',
                text: `Genes (${viewer.explore.genes.hits.total.toLocaleString()})`,
                component: viewer.explore.genes.hits.total ? (
                  <GenesTab viewer={viewer} />
                ) : (
                  <NoResultsMessage>No Genes Found.</NoResultsMessage>
                  ),
              },
              {
                id: 'mutations',
                text: `Mutations (${viewer.explore.ssms.hits.total.toLocaleString()})`,
                component: viewer.explore.ssms.hits.total ? (
                  <MutationsTab
                    totalNumCases={viewer.explore.cases.hits.total}
                    viewer={viewer}
                    />
                ) : (
                  <NoResultsMessage>No Mutations Found.</NoResultsMessage>
                  ),
              },
              {
                id: 'oncogrid',
                text: 'OncoGrid',
                component: <OncogridTab />,
              },
            ]}
            queryParam="searchTableTab"
            />
        </span>
      )}
      />
);

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
    idAutocompleteGenes: null,
    runAutocompleteGenes: false,
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
        autocomplete_genes: query (query: $idAutocompleteGenes types: ["gene_centric"]) @include(if: $runAutocompleteGenes) {
          hits {
            id
            ...on Gene {
              symbol
              name
              gene_id
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
            aggregations(filters: $filters aggregations_filter_themselves: false) {
              ${GeneAggregations.getFragment('aggregations')}
            }
            hits(first: $genes_size offset: $genes_offset, filters: $filters) {
              total
            }
          }
          cnvs {
            aggregations(filters: $filters aggregations_filter_themselves: false) {
              ${GeneAggregations.getFragment('cnvAggregations')}
            }
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
  enhance(ExplorePageComponent),
  ExplorePageQuery,
);

export default ExplorePage;
