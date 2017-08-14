/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';
import { compose, withPropsOnChange, withState } from 'recompose';
import { connect } from 'react-redux';
import { parse } from 'query-string';

import withFilters from '@ncigdc/utils/withFilters';
import { makeFilter, addInFilters } from '@ncigdc/utils/filters';
import { Row } from '@ncigdc/uikit/Flex';
import Showing from '@ncigdc/components/Pagination/Showing';
import tableModels from '@ncigdc/tableModels';
import Pagination from '@ncigdc/components/Pagination';
import TableActions from '@ncigdc/components/TableActions';
import Table, { Tr } from '@ncigdc/uikit/Table';
import { handleReadyStateChange } from '@ncigdc/dux/loaders';
import { ConnectedLoader } from '@ncigdc/uikit/Loaders/Loader';
import withRouter from '@ncigdc/utils/withRouter';
import CreateExploreCaseSetButton from '@ncigdc/modern_components/setButtons/CreateExploreCaseSetButton';
import RemoveFromExploreCaseSetButton from '@ncigdc/modern_components/setButtons/RemoveFromExploreCaseSetButton';
import {
  parseIntParam,
  parseFilterParam,
  parseJSURLParam,
} from '@ncigdc/utils/uri';

const COMPONENT_NAME = 'ExploreCasesTable';

const createRenderer = (Route, Container) =>
  compose(connect(), withRouter)((props: mixed) =>
    <div style={{ position: 'relative', minHeight: '387px' }}>
      <Relay.Renderer
        environment={Relay.Store}
        queryConfig={new Route(props)}
        onReadyStateChange={handleReadyStateChange(COMPONENT_NAME, props)}
        Container={Container}
        render={({ props: relayProps }) =>
          relayProps ? <Container {...relayProps} {...props} /> : undefined // needed to prevent flicker
        }
      />
      <ConnectedLoader name={COMPONENT_NAME} />
    </div>,
  );

class Route extends Relay.Route {
  static routeName = COMPONENT_NAME;
  static queries = {
    viewer: () => Relay.QL`query { viewer }`,
  };
  static prepareParams = ({
    location: { search },
    defaultSize = 20,
    defaultFilters = null,
  }) => {
    const q = parse(search);

    return {
      filters: parseFilterParam(q.filters, defaultFilters),
      cases_offset: parseIntParam(q.cases_offset, 0),
      cases_size: parseIntParam(q.cases_size, defaultSize),
      cases_sort: parseJSURLParam(q.cases_sort, null),
    };
  };
}

const createContainer = Component =>
  Relay.createContainer(Component, {
    initialVariables: {
      fetchSsmCounts: false,
      ssmCountsfilters: null,
      cases_offset: null,
      cases_size: null,
      cases_sort: null,
      cases_score: 'gene.gene_id',
      filters: null,
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Root {
          explore {
            cases {
              hits(first: $cases_size offset: $cases_offset filters: $filters score: $cases_score sort: $cases_sort) {
                total
                edges {
                  node {
                    score
                    id
                    case_id
                    primary_site
                    disease_type
                    submitter_id
                    project {
                      project_id
                      program {
                        name
                      }
                    }
                    diagnoses {
                      hits(first: 1) {
                        edges {
                          node {
                            primary_diagnosis
                            age_at_diagnosis
                            vital_status
                            days_to_death
                          }
                        }
                      }
                    }
                    demographic {
                      gender
                      ethnicity
                      race
                    }
                    summary {
                      data_categories {
                        file_count
                        data_category
                      }
                      file_count
                    }
                  }
                }
              }
            }
            ssms {
              aggregations(filters: $ssmCountsfilters aggregations_filter_themselves: true) @include(if: $fetchSsmCounts){
                occurrence__case__case_id {
                  buckets {
                    key
                    doc_count
                  }
                }
              }
            }
          }
        }
      `,
    },
  });

const Component = compose(
  withFilters(),
  withState('ssmCountsLoading', 'setSsmCountsLoading', true),
  withPropsOnChange(
    ['viewer'],
    ({
      setSsmCountsLoading,
      ssmCountsLoading,
      viewer: { explore: { cases: { hits } } },
      relay,
      filters,
    }) => {
      const caseIds = hits.edges.map(e => e.node.case_id);
      if (!ssmCountsLoading) {
        setSsmCountsLoading(true);
      }
      relay.setVariables(
        {
          fetchSsmCounts: !!caseIds.length,
          ssmCountsfilters: caseIds.length
            ? addInFilters(
                filters,
                makeFilter(
                  [
                    {
                      field: 'occurrence.case.case_id',
                      value: caseIds,
                    },
                  ],
                  false,
                ),
              )
            : null,
        },
        readyState => {
          if (readyState.done) {
            setSsmCountsLoading(false);
          }
        },
      );
    },
  ),
  withPropsOnChange(['viewer'], ({ viewer: { explore } }) => {
    const { occurrence__case__case_id: { buckets } } = explore.ssms
      .aggregations || {
      occurrence__case__case_id: { buckets: [] },
    };
    const ssmCounts = buckets.reduce(
      (acc, b) => ({ ...acc, [b.key]: b.doc_count }),
      {},
    );
    return { ssmCounts };
  }),
  connect(state => ({ tableColumns: state.tableColumns.exploreCases.ids })),
)(props => {
  const prefix = 'cases';
  const { ssmCounts, ssmCountsLoading, tableColumns } = props;

  const tableInfo = tableModels.exploreCases
    .slice()
    .sort((a, b) => tableColumns.indexOf(a.id) - tableColumns.indexOf(b.id))
    .filter(x => tableColumns.includes(x.id));

  return (
    <div>
      <Row
        style={{
          backgroundColor: 'white',
          padding: '1rem',
          justifyContent: 'space-between',
        }}
      >
        <Showing
          docType="cases"
          prefix={prefix}
          params={props.relay.route.params}
          total={props.viewer.explore.cases.hits.total}
        />
        <TableActions
          type="case"
          arrangeColumnKey="exploreCases"
          total={props.viewer.explore.cases.hits.total}
          endpoint="case_ssms"
          downloadTooltip="Export All Except #Mutations and #Genes"
          currentFilters={props.filters}
          downloadFields={tableInfo
            .filter(x => x.downloadable)
            .map(x => x.field || x.id)}
          sortOptions={tableInfo.filter(x => x.sortable)}
          tsvSelector="#explore-case-table"
          tsvFilename="explore-case-table.tsv"
          CreateSetButton={CreateExploreCaseSetButton}
          RemoveFromSetButton={RemoveFromExploreCaseSetButton}
          idField="cases.case_id"
        />
      </Row>
      <div style={{ overflowX: 'auto' }}>
        <Table
          id="explore-case-table"
          headings={tableInfo
            .filter(x => !x.subHeading)
            .map(x => <x.th key={x.id} />)}
          subheadings={tableInfo
            .filter(x => x.subHeading)
            .map(x => <x.th key={x.id} />)}
          body={
            <tbody>
              {props.viewer.explore.cases.hits.edges.map((e, i) =>
                <Tr key={e.node.id} index={i}>
                  {tableInfo
                    .filter(x => x.td)
                    .map(x =>
                      <x.td
                        key={x.id}
                        node={e.node}
                        relay={props.relay}
                        index={i}
                        total={props.viewer.explore.cases.hits.total}
                        ssmCount={ssmCounts[e.node.case_id]}
                        ssmCountsLoading={ssmCountsLoading}
                        filters={props.filters}
                      />,
                    )}
                </Tr>,
              )}
            </tbody>
          }
        />
      </div>
      <Pagination
        prefix={prefix}
        params={props.relay.route.params}
        total={props.viewer.explore.cases.hits.total}
      />
    </div>
  );
});

export default createRenderer(Route, createContainer(Component));
