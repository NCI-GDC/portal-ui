/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';
import { get, isEqual } from 'lodash';
import { compose, lifecycle } from 'recompose';

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
import { CreateExploreCaseSetButton } from '@ncigdc/modern_components/withSetAction';
import { replaceFilters } from '@ncigdc/utils/filters';
import withRouter from '@ncigdc/utils/withRouter';
import { stringifyJSONParam } from '@ncigdc/utils/uri';

export type TProps = {
  filters: {},
  autocomplete: {
    cases: {
      hits: Array<Object>,
    },
    genes: {
      hits: Array<Object>,
    },
    ssms: {
      hits: Array<Object>,
    },
  },
  relay: Object,
  filters: Object,
  viewer: {
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
};

function setVariables({ relay, filters }) {
  relay.setVariables({
    cosmicFilters: replaceFilters(
      {
        op: 'and',
        content: [
          { op: 'not', content: { field: 'cosmic_id', value: ['MISSING'] } },
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
export const ExplorePageComponent = (props: TProps) => (
  <SearchPage
    className="test-explore-page"
    facetTabs={[
      {
        id: 'cases',
        text: 'Cases',
        component: (
          <CaseAggregations
            facets={props.viewer.explore.customCaseFacets}
            aggregations={props.viewer.explore.cases.aggregations}
            suggestions={get(props, 'viewer.autocomplete_cases.hits', [])}
            setAutocomplete={(value, onReadyStateChange) =>
              props.relay.setVariables(
                { idAutocompleteCases: value, runAutocompleteCases: !!value },
                onReadyStateChange,
              )}
          />
        ),
      },
      {
        id: 'genes',
        text: 'Genes',
        component: (
          <GeneAggregations
            aggregations={props.viewer.explore.genes.aggregations}
            suggestions={get(props, 'viewer.autocomplete_genes.hits', [])}
            setAutocomplete={(value, onReadyStateChange) =>
              props.relay.setVariables(
                { idAutocompleteGenes: value, runAutocompleteGenes: !!value },
                onReadyStateChange,
              )}
          />
        ),
      },
      {
        id: 'mutations',
        text: 'Mutations',
        component: (
          <SSMAggregations
            defaultFilters={props.filters}
            aggregations={props.viewer.explore.ssms.aggregations}
            ssms={props.viewer.explore.ssms}
            suggestions={get(props, 'viewer.autocomplete_ssms.hits', [])}
            setAutocomplete={(value, onReadyStateChange) =>
              props.relay.setVariables(
                { idAutocompleteSsms: value, runAutocompleteSsms: !!value },
                onReadyStateChange,
              )}
          />
        ),
      },
    ]}
    results={
      <span>
        <CreateExploreCaseSetButton
          filters={props.filters}
          disabled={!props.viewer.explore.cases.hits.total}
          style={{ marginBottom: '2rem' }}
          onComplete={setId => {
            props.push({
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
        >
          View Files in Repository
        </CreateExploreCaseSetButton>
        <TabbedLinks
          queryParam="searchTableTab"
          defaultIndex={0}
          links={[
            {
              id: 'cases',
              text: `Cases (${props.viewer.explore.cases.hits.total.toLocaleString()})`,
              component: !!props.viewer.explore.cases.hits.total ? (
                <CasesTab />
              ) : (
                <NoResultsMessage>No Cases Found.</NoResultsMessage>
              ),
            },
            {
              id: 'genes',
              text: `Genes (${props.viewer.explore.genes.hits.total.toLocaleString()})`,
              component: props.viewer.explore.genes.hits.total ? (
                <GenesTab viewer={props.viewer} />
              ) : (
                <NoResultsMessage>No Genes Found.</NoResultsMessage>
              ),
            },
            {
              id: 'mutations',
              text: `Mutations (${props.viewer.explore.ssms.hits.total.toLocaleString()})`,
              component: props.viewer.explore.ssms.hits.total ? (
                <MutationsTab
                  totalNumCases={props.viewer.explore.cases.hits.total}
                  viewer={props.viewer}
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
        />
      </span>
    }
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
