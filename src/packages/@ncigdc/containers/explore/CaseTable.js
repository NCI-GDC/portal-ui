/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';
import withFilters from '@ncigdc/utils/withFilters';
import { makeFilter, addInFilters } from '@ncigdc/utils/filters';
import { connect } from 'react-redux';
import { Row } from '@ncigdc/uikit/Flex';
import Showing from '@ncigdc/components/Pagination/Showing';
import tableModels from '@ncigdc/tableModels';
import Pagination from '@ncigdc/components/Pagination';

import TableActions from '@ncigdc/components/TableActions';

import Table, { Tr } from '@ncigdc/uikit/Table';

import { compose, withPropsOnChange, withState } from 'recompose';

import type { TTableProps } from '../types';

export const CaseTableComponent = compose(
  withFilters(),
  withState('ssmCountsLoading', 'setSsmCountsLoading', true),
  withPropsOnChange(
    ['hits'],
    ({
      setSsmCountsLoading,
      ssmCountsLoading,
      hits,
      relay,
      filters,
    }: TTableProps) => {
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
  withPropsOnChange(['explore'], ({ explore }: TTableProps) => {
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
  connect(state => ({ tableColumns: state.tableColumns.exploreCases })),
)((props: TTableProps) => {
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
          total={props.hits.total}
        />
        <TableActions
          prefix={prefix}
          entityType="exploreCases"
          total={props.hits.total}
          sortKey="cases_sort"
          endpoint={props.endpoint || 'cases'}
          downloadTooltip="Export All Except #Mutations and #Genes"
          downloadFields={[
            'case_id',
            'project.project_id',
            'cases.primary_site',
            'demographic.gender',
            'summary.data_categories.file_count',
            'summary.data_categories.data_category',
          ]}
          sortOptions={[
            {
              id: 'project.project_id',
              name: 'Project',
            },
            {
              id: 'primary_site',
              name: 'Primary Site',
            },
            {
              id: 'demographic.gender',
              name: 'Gender',
            },
          ]}
          tsvSelector="#explore-case-table"
          tsvFilename="explore-case-table.tsv"
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
              {props.hits.edges.map((e, i) =>
                <Tr key={e.node.id} index={i}>
                  {tableInfo
                    .filter(x => x.td)
                    .map(x =>
                      <x.td
                        key={x.id}
                        node={e.node}
                        relay={props.relay}
                        index={i}
                        total={props.hits.total}
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
        total={props.hits.total}
      />
    </div>
  );
});

export const CaseTableQuery = {
  initialVariables: {
    fetchSsmCounts: false,
    ssmCountsfilters: null,
  },
  fragments: {
    hits: () => Relay.QL`
      fragment on ECaseConnection {
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
    `,
    explore: () => Relay.QL`
      fragment on Explore {
        ssms {
          blah: hits(first: 0) { total }
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
    `,
  },
};

const CaseTable = Relay.createContainer(CaseTableComponent, CaseTableQuery);

export default CaseTable;
