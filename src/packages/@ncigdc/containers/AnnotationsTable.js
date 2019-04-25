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
import timestamp from '@ncigdc/utils/timestamp';

export const SearchTable = compose(
  connect(state => ({ tableColumns: state.tableColumns.annotations }))
)(
  ({
    downloadable,
    relay,
    hits,
    entityType = 'annotations',
    tableColumns,
    canAddToCart = true,
    tableHeader,
    dispatch,
  }) => {
    const tableInfo = tableColumns.slice().filter(x => !x.hidden);

    return (
      <div className="test-annotations-table">
        {tableHeader && (
          <h3
            className="panel-title"
            style={{
              padding: '1rem',
              marginTop: '-6rem',
            }}>
            {tableHeader}
          </h3>
        )}
        <Row
          style={{
            backgroundColor: 'white',
            padding: '1rem',
            justifyContent: 'space-between',
          }}>
          <Showing
            docType="annotations"
            params={relay.route.params}
            prefix={entityType}
            total={hits.total} />
          <TableActions
            arrangeColumnKey={entityType}
            downloadable={downloadable}
            downloadFields={tableInfo
              .filter(x => x.downloadable)
              .map(x => x.field || x.id)}
            endpoint="annotations"
            entityType={entityType}
            scope="repository"
            sortOptions={tableInfo.filter(x => x.sortable)}
            total={hits.total}
            tsvFilename={`repository-annotations-table.${timestamp()}.tsv`}
            tsvSelector="#repository-annotations-table"
            type="annotation" />
        </Row>
        <div style={{ overflowX: 'auto' }}>
          <Table
            body={(
              <tbody>
                {hits.edges.map((e, i) => (
                  <Tr index={i} key={e.node.id}>
                    {tableInfo
                      .filter(x => x.td)
                      .map(x => (
                        <x.td
                          index={i}
                          key={x.id}
                          node={e.node}
                          relay={relay}
                          total={hits.total} />
                      ))}
                  </Tr>
                ))}
              </tbody>
            )}
            headings={tableInfo.map(x => (
              <x.th canAddToCart={canAddToCart} hits={hits} key={x.id} />
            ))}
            id="repository-annotations-table" />
        </div>
        <Pagination
          params={relay.route.params}
          prefix={entityType}
          total={hits.total} />
      </div>
    );
  }
);

export const AnnotationsTableQuery = {
  fragments: {
    hits: () => Relay.QL`
      fragment on AnnotationConnection {
        total
        edges {
          node {
            id
            annotation_id
            case_id
            case_submitter_id
            project {
              project_id
              program {
                name
              }
            }
            entity_type
            entity_id
            entity_submitter_id
            category
            classification
            created_datetime
            status
            notes
          }
        }
      }
    `,
  },
};

const AnnotationsTable = Relay.createContainer(
  SearchTable,
  AnnotationsTableQuery
);

export default AnnotationsTable;
