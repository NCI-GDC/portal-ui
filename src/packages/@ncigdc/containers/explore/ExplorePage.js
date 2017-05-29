/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';
import { get } from 'lodash';

import SearchPage from '@ncigdc/components/SearchPage';
import TabbedLinks from '@ncigdc/components/TabbedLinks';
import GenesTab from '@ncigdc/components/Explore/GenesTab';
import MutationsTab from '@ncigdc/components/Explore/MutationsTab';
import OncogridTab from '@ncigdc/components/Explore/OncogridTab';
import CasesTab from '@ncigdc/components/Explore/CasesTab';
import NoResultsMessage from '@ncigdc/components/NoResultsMessage';

import ExploreCasesPies from '@ncigdc/components/TabPieCharts/ExploreCasesPies';

import CaseTable from '@ncigdc/containers/explore/CaseTable';
import CaseAggregations from '@ncigdc/containers/explore/CaseAggregations';
import GeneAggregations from '@ncigdc/containers/explore/GeneAggregations';
import SSMAggregations from '@ncigdc/containers/explore/SSMAggregations';
import FrequentlyMutatedGenesChart from '@ncigdc/containers/FrequentlyMutatedGenesChart';
import MutationsCount from '@ncigdc/containers/MutationsCount';

import FrequentMutationsChart from '@ncigdc/containers/FrequentMutationsChart';

export type TProps = {
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
  viewer: {
    explore: {
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

export const ExplorePageComponent = (props: TProps) => (
  <SearchPage
    facetTabs={[
      {
        id: 'cases',
        text: 'Cases',
        component: (
          <CaseAggregations
            aggregations={props.viewer.explore.cases.aggregations}
            suggestions={get(props, 'viewer.autocomplete_cases.hits', [])}
            setAutocomplete={
              (value, onReadyStateChange) => props.relay.setVariables({ idAutocompleteCases: value, runAutocompleteCases: !!value }, onReadyStateChange)
            }
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
            setAutocomplete={
              (value, onReadyStateChange) => props.relay.setVariables({ idAutocompleteGenes: value, runAutocompleteGenes: !!value }, onReadyStateChange)
            }
          />
        ),
      },
      {
        id: 'mutations',
        text: 'Mutations',
        component: (
          <SSMAggregations
            aggregations={props.viewer.explore.ssms.aggregations}
            ssms={props.viewer.explore.ssms}
            suggestions={get(props, 'viewer.autocomplete_ssms.hits', [])}
            setAutocomplete={
              (value, onReadyStateChange) => props.relay.setVariables({ idAutocompleteSsms: value, runAutocompleteSsms: !!value }, onReadyStateChange)
            }
          />
        ),
      },
    ]}
    results={
      <TabbedLinks
        queryParam="searchTableTab"
        defaultIndex={0}
        links={[
          {
            id: 'cases',
            text: `Cases (${props.viewer.explore.cases.hits.total.toLocaleString()})`,
            component: (
              !!props.viewer.explore.cases.hits.total
              ? <CasesTab
                explore={props.viewer.explore}
                hits={props.viewer.explore.cases.hits}
                aggregations={props.viewer.explore.cases.aggregations}
              />
              : <NoResultsMessage>No Cases Found.</NoResultsMessage>
            ),
          },
          {
            id: 'genes',
            text: `Genes (${props.viewer.explore.genes.hits.total.toLocaleString()})`,
            component: (
              props.viewer.explore.genes.hits.total
              ? <GenesTab
                viewer={props.viewer}
              />
              : <NoResultsMessage>No Genes Found.</NoResultsMessage>
            ),
          },
          {
            id: 'mutations',
            text: `Mutations (${props.viewer.explore.ssms.hits.total.toLocaleString()})`,
            component: (
              props.viewer.explore.ssms.hits.total
              ? <MutationsTab
                totalNumCases={props.viewer.explore.cases.hits.total}
                viewer={props.viewer}
              />
              : <NoResultsMessage>No Mutations Found.</NoResultsMessage>
            ),
          },
          {
            id: 'oncogrid',
            text: 'OncoGrid',
            component: (
              <OncogridTab />
            ),
          },
        ]}
      />
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
        frequentMutationsChartFragment: explore {
          ${FrequentMutationsChart.getFragment('explore')}
        }
        frequentlyMutatedGenesChartFragment: explore {
          ${FrequentlyMutatedGenesChart.getFragment('explore')}
        }
        explore {
          mutationsCountFragment: ssms {
            ${MutationsCount.getFragment('ssms')}
          }
          cases {
            aggregations(filters: $filters) {
              ${CaseAggregations.getFragment('aggregations')}
              ${ExploreCasesPies.getFragment('aggregations')}
            }
            hits(first: $cases_size offset: $cases_offset filters: $filters score: $cases_score sort: $cases_sort) {
              ${CaseTable.getFragment('hits')}
              total
            }
          }
          genes {
            aggregations(filters: $filters) {
              ${GeneAggregations.getFragment('aggregations')}
            }
            hits(first: $genes_size offset: $genes_offset, filters: $filters) {
              total
            }
          }
          ssms {
            aggregations(filters: $filters) {
              ${SSMAggregations.getFragment('aggregations')}
            }
            hits(first: $ssms_size offset: $ssms_offset, filters: $filters) {
              total
            }
            ${SSMAggregations.getFragment('ssms')}
          }
        }
      }
    `,
  },
};

const ExplorePage = Relay.createContainer(
  ExplorePageComponent,
  ExplorePageQuery
);

export default ExplorePage;
