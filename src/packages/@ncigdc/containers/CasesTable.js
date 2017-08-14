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
import CreateRepositoryCaseSetButton from '@ncigdc/modern_components/setButtons/CreateRepositoryCaseSetButton';
import RemoveFromRepositoryCaseSetButton from '@ncigdc/modern_components/setButtons/RemoveFromRepositoryCaseSetButton';
import { theme } from '@ncigdc/theme';
import withSelectIds from '@ncigdc/utils/withSelectIds';

export const SearchTable = compose(
  connect(state => ({ tableColumns: state.tableColumns.cases.ids })),
  withSelectIds,
)(
  ({
    relay,
    hits,
    entityType = 'cases',
    tableColumns,
    filters,
    selectedIds,
    setSelectedIds,
  }) => {
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
            type="case"
            arrangeColumnKey={entityType}
            total={hits.total}
            endpoint="cases"
            downloadFields={tableInfo
              .filter(x => x.downloadable)
              .map(x => x.field || x.id)}
            sortOptions={tableInfo.filter(x => x.sortable)}
            tsvSelector="#repository-cases-table"
            tsvFilename="repository-cases-table.tsv"
            currentFilters={filters}
            CreateSetButton={CreateRepositoryCaseSetButton}
            RemoveFromSetButton={RemoveFromRepositoryCaseSetButton}
            idField="cases.case_id"
            selectedIds={selectedIds}
          />
        </Row>
        <div style={{ overflowX: 'auto' }}>
          <Table
            id="repository-cases-table"
            headings={tableInfo
              .filter(x => !x.subHeading)
              .map(x =>
                <x.th
                  key={x.id}
                  nodes={hits.edges}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                />,
              )}
            subheadings={tableInfo
              .filter(x => x.subHeading)
              .map(x => <x.th key={x.id} />)}
            body={
              <tbody>
                {hits.edges.map((e, i) =>
                  <Tr
                    key={e.node.id}
                    index={i}
                    style={{
                      ...(selectedIds.includes(e.node.case_id) && {
                        backgroundColor: theme.tableHighlight,
                      }),
                    }}
                  >
                    {tableInfo
                      .filter(x => x.td)
                      .map(x =>
                        <x.td
                          key={x.id}
                          node={e.node}
                          relay={relay}
                          index={i}
                          total={hits.total}
                          selectedIds={selectedIds}
                          setSelectedIds={setSelectedIds}
                        />,
                      )}
                  </Tr>,
                )}
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
  },
);

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
