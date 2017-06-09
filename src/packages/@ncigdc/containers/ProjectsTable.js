/* @flow */

import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay/compat';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Row } from '@ncigdc/uikit/Flex';
import TableActions from '@ncigdc/components/TableActions';
import tableModels from '@ncigdc/tableModels';

import Table, { Tr, Td } from '@ncigdc/uikit/Table';

export const SearchTable = compose(
  connect(state => ({ tableColumns: state.tableColumns.projects })),
)(
  ({
    downloadable,
    hits,
    params,
    entityType = 'projects',
    tableHeader,
    tableColumns,
  }) => {
    const tableInfo = tableModels[entityType]
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
            alignItems: 'center',
          }}
        >
          {tableHeader &&
            <h3 className="panel-title">
              {tableHeader}
            </h3>}
          <div><b>{hits.total}</b> Projects</div>
          <TableActions
            prefix={entityType}
            entityType={entityType}
            total={hits.total}
            sortKey={`${entityType}_sort`}
            endpoint={entityType}
            downloadable={downloadable}
            downloadFields={tableModels[entityType]
              .filter(x => x.downloadable)
              .map(x => x.id)}
            sortOptions={tableModels[entityType].filter(x => x.sortable)}
            tsvSelector="#projects-table"
            tsvFilename="projects-table.tsv"
          />
        </Row>
        <div style={{ overflowX: 'auto' }}>
          <Table
            id="projects-table"
            headings={tableInfo
              .filter(x => !x.subHeading)
              .map(x => <x.th key={x.id} />)}
            subheadings={tableInfo
              .filter(x => x.subHeading)
              .map(x => <x.th key={x.id} />)}
            body={
              <tbody>
                {hits.edges.map((e, i) =>
                  <Tr key={e.node.id} index={i}>
                    {tableInfo
                      .filter(x => x.td)
                      .map(x => <x.td key={x.id} node={e.node} />)}
                  </Tr>,
                )}
                <Tr>
                  {tableInfo
                    .filter(x => x.td)
                    .map(
                      x =>
                        x.total
                          ? <x.total key={x.id} hits={hits} />
                          : <Td key={x.id} />,
                    )}
                </Tr>
              </tbody>
            }
          />
        </div>
      </div>
    );
  },
);

const ProjectsTable = createFragmentContainer(
  SearchTable,
  graphql`
    fragment ProjectsTable_hits on ProjectConnection {
      total
      edges @relay(plural: true) {
        node {
          id
          project_id
          disease_type
          program {
            name
          }
          primary_site
          summary {
            case_count
            data_categories {
              case_count
              data_category
            }
            file_count
            file_size
          }
        }
      }
    }
  `,
);

export default ProjectsTable;
