/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import Pagination from '@ncigdc/components/Pagination';
import Showing from '@ncigdc/components/Pagination/Showing';
import { Row } from '@ncigdc/uikit/Flex';
import TableActions from '@ncigdc/components/TableActions';
import tableModels from '@ncigdc/tableModels';
import Table, { Tr } from '@ncigdc/uikit/Table';

export const SearchTable = compose(
  connect(state => ({ tableColumns: state.tableColumns.cases.ids })),
)(({ relay, hits, entityType = 'cases', tableColumns }) => {
  const tableInfo = tableModels[entityType]
    .slice()
    .sort((a, b) => tableColumns.indexOf(a.id) - tableColumns.indexOf(b.id))
    .filter(x => tableColumns.includes(x.id));

  return (
    <div className="test-cases-table">
      <Row
        style={{
          backgroundColor: 'white',
          padding: '1rem',
          justifyContent: 'space-between',
        }}
      >
        <Showing
          docType="cases"
          prefix={entityType}
          params={relay.route.params}
          total={hits.total}
        />
        <TableActions
          prefix={entityType}
          entityType={entityType}
          total={hits.total}
          sortKey="cases_sort"
          endpoint="cases"
          downloadFields={tableInfo
            .filter(x => x.downloadable)
            .map(x => x.field || x.id)}
          sortOptions={tableInfo.filter(x => x.sortable)}
          tsvSelector="#repository-cases-table"
          tsvFilename="repository-cases-table.tsv"
        />
      </Row>
      <div style={{ overflowX: 'auto' }}>
        <Table
          id="repository-cases-table"
          headings={tableInfo
            .filter(x => !x.subHeading)
            .map(x => <x.th key={x.id} />)}
          subheadings={tableInfo
            .filter(x => x.subHeading)
            .map(x => <x.th key={x.id} />)}
          body={
            <tbody>
              {hits.edges.map((e, i) => (
                <Tr key={e.node.id} index={i}>
                  {tableInfo
                    .filter(x => x.td)
                    .map(x => (
                      <x.td
                        key={x.id}
                        node={e.node}
                        relay={relay}
                        index={i}
                        total={hits.total}
                      />
                    ))}
                </Tr>
              ))}
            </tbody>
          }
        />
      </div>
      <Pagination
        prefix={entityType}
        params={relay.route.params}
        total={hits.total}
      />
    </div>
  );
});

const CasesTable = Relay.createContainer(SearchTable, {
  initialVariables: {
    isFileDataRequired: false,
    isFilteredFileDataRequired: false,
    filesFilters: null,
  },
  fragments: {
    hits: () => Relay.QL`
        fragment on CaseConnection {
          total
          edges {
            node {
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
              annotations {
                hits(first:1) {
                  total
                  edges {
                    node {
                      annotation_id
                    }
                  }
                }
              }
              demographic {
                gender
                ethnicity
                race
              }
              diagnoses {
                hits(first: 99) {
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
  },
});

export default CasesTable;
