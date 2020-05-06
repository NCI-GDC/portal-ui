/* @flow */
import React from 'react';
import Relay from 'react-relay/classic';
import { get, isEqual } from 'lodash';
import {
  compose,
  lifecycle,
  setDisplayName,
  withState,
} from 'recompose';

import withControlledAccess from '@ncigdc/utils/withControlledAccess';
import withRouter from '@ncigdc/utils/withRouter';
import SearchPage from '@ncigdc/components/SearchPage';
import TabbedLinks from '@ncigdc/components/TabbedLinks';
import GenesTab from '@ncigdc/components/Explore/GenesTab';
import MutationsTab from '@ncigdc/components/Explore/MutationsTab';
import OncogridTab from '@ncigdc/components/Explore/OncogridTab';
import CasesTab from '@ncigdc/components/Explore/CasesTab';
import NoResultsMessage from '@ncigdc/components/NoResultsMessage';
import ExploreCasesAggregations from '@ncigdc/modern_components/ExploreCasesAggregations';
import GeneAggregations from '@ncigdc/modern_components/GeneAggregations';
import SSMAggregations from '@ncigdc/containers/explore/SSMAggregations';
import ClinicalAggregations from '@ncigdc/modern_components/ClinicalAggregations';
// import MasonryLayout from '@ncigdc/components/Layouts/MasonryLayout';
import { CreateExploreCaseSetButton } from '@ncigdc/modern_components/withSetAction';
import { replaceFilters } from '@ncigdc/utils/filters';
import { stringifyJSONParam } from '@ncigdc/utils/uri';
import { Row } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import ResizeDetector from 'react-resize-detector';
import SummaryPage from '@ncigdc/components/Explore/SummaryPage';
import withFacetData from '@ncigdc/modern_components/IntrospectiveType/Introspective.relay';
import { CaseLimitMessages } from '@ncigdc/modern_components/RestrictionMessage';
import ControlledAccessSwitch from '@ncigdc/components/ControlledAccessSwitch';

import {
  CASE_LIMIT_API,
  DISPLAY_10K,
  DISPLAY_SUMMARY_PAGE,
} from '@ncigdc/utils/constants';

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

const ClinicalAggregationsWithFacetData = withFacetData(props => (
  <ClinicalAggregations
    data={props.introspectiveType}
    globalFilters={props.globalFilters}
    loading={props.loading}
    maxFacetsPanelHeight={props.maxFacetsPanelHeight}
    />
));

const ExplorePageComponent = ({
  controlledAccessProps: {
    controlledStudies,
    showControlledAccessModal,
  } = {},
  filters,
  maxFacetsPanelHeight,
  push,
  relay,
  setMaxFacetsPanelHeight,
  viewer,
}) => {
  const hasCaseHits = get(viewer, 'explore.cases.hits.total', 0);
  const hasGeneHits = get(viewer, 'explore.genes.hits.total', 0);
  const hasSsmsHits = get(viewer, 'explore.ssms.hits.total', 0);

  const isCaseLimitExceeded = DISPLAY_10K && hasCaseHits > CASE_LIMIT_API;

  return (
    <SearchPage
      className="test-explore-page"
      ControlledAccess={controlledStudies && [
        <ControlledAccessSwitch
          key="ControlledAccessSwitch"
          studies={controlledStudies}
          switchHandler={showControlledAccessModal}
          />,
      ]}
      facetTabs={[
        {
          component: (
            <ExploreCasesAggregations
              maxFacetsPanelHeight={maxFacetsPanelHeight}
              relay={relay}
              />
          ),
          id: 'cases',
          text: 'Cases',
        },
        {
          component: (
            <ClinicalAggregationsWithFacetData
              globalFilters={filters}
              maxFacetsPanelHeight={maxFacetsPanelHeight}
              relay={relay}
              typeName="ExploreCases"
              />
          ),
          id: 'clinical',
          text: 'Clinical',
        },
        {
          component: (
            <GeneAggregations
              maxFacetsPanelHeight={maxFacetsPanelHeight}
              relay={relay}
              />
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
            onResize={(width, height) =>
              setMaxFacetsPanelHeight(height < 600 ? 600 : height)}
            />

          <TabbedLinks
            defaultIndex={0}
            links={[
              ...(DISPLAY_SUMMARY_PAGE && [
                {
                  component: hasCaseHits ? (
                    <SummaryPage
                      filters={filters}
                      numPerRow={showFacets ? 3 : 4}
                      />
                  ) : (
                    <NoResultsMessage>No Cases Found.</NoResultsMessage>
                    ),
                  id: 'summary',
                  text: 'Summary',
                },
              ]),
              {
                component: hasCaseHits
                  ? (
                    <CasesTab />
                  ) : (
                    <NoResultsMessage>No Cases Found.</NoResultsMessage>
                  ),
                id: 'cases',
                text: `Cases (${hasCaseHits.toLocaleString()})`,
              },
              {
                component: isCaseLimitExceeded || controlledStudies
                  ? (
                    <CaseLimitMessages
                      isCaseLimitExceeded={isCaseLimitExceeded}
                      />
                  )
                  : hasGeneHits
                    ? (
                      <GenesTab viewer={viewer} />
                    )
                    : (
                      <NoResultsMessage>No Genes Found.</NoResultsMessage>
                    ),
                id: 'genes',
                text: `Genes${isCaseLimitExceeded
                  ? ''
                  : ` (${hasGeneHits.toLocaleString()})`}`,
              },
              {
                component: isCaseLimitExceeded || controlledStudies
                  ? (
                    <CaseLimitMessages
                      isCaseLimitExceeded={isCaseLimitExceeded}
                      />
                  )
                  : hasSsmsHits
                    ? (
                      <MutationsTab
                        totalNumCases={hasCaseHits}
                        viewer={viewer}
                        />
                    )
                    : (
                      <NoResultsMessage>No Mutations Found.</NoResultsMessage>
                    ),
                id: 'mutations',
                text: `Mutations${isCaseLimitExceeded
                  ? ''
                  : ` (${hasSsmsHits.toLocaleString()})`}`,
              },
              {
                component: isCaseLimitExceeded || controlledStudies
                  ? (
                    <CaseLimitMessages
                      isCaseLimitExceeded={isCaseLimitExceeded}
                      />
                  )
                  : (
                    <OncogridTab />
                  ),
                id: 'oncogrid',
                text: 'OncoGrid',
              },
            ]}
            queryParam="searchTableTab"
            tabToolbar={(
              <Row>
                {filters
                  ? (
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
                      >
                      View Files in Repository
                    </CreateExploreCaseSetButton>
                  )
                : (
                  <Button
                    disabled={!hasCaseHits}
                    onClick={() => push({
                      pathname: '/repository',
                    })}
                    >
                    View Files in Repository
                  </Button>
                )}
              </Row>
            )}
            />
        </span>
      )}
      />
  );
};

export const ExplorePageQuery = {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
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
        explore {
          cases {
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
  initialVariables: {
    cases_score: 'gene.gene_id',
    cases_offset: null,
    cases_size: null,
    cases_sort: null,
    cosmicFilters: null,
    dbsnpRsFilters: null,
    filters: null,
    genes_offset: null,
    genes_size: null,
    genes_sort: null,
    idAutocompleteSsms: null,
    runAutocompleteSsms: false,
    ssms_offset: null,
    ssms_size: null,
    ssms_sort: null,
  },
  shouldComponentUpdate: () => true, // This should likely be improved.
};

const setVariables = ({ filters, relay }) => {
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
};

const ExplorePage = Relay.createContainer(
  compose(
    setDisplayName('EnhancedExplorePageComponent'),
    withControlledAccess,
    withRouter,
    withState('maxFacetsPanelHeight', 'setMaxFacetsPanelHeight', 0),
    lifecycle({
      componentDidMount() {
        setVariables(this.props);
      },
      componentWillReceiveProps(nextProps) {
        const { filters } = this.props;
        if (!isEqual(filters, nextProps.filters)) {
          setVariables(nextProps);
        }
      },
    }),
  )(ExplorePageComponent),
  ExplorePageQuery,
);

export default ExplorePage;
