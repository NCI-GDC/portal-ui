/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';
import {
  compose,
  setDisplayName,
} from 'recompose';
import { connect } from 'react-redux';

import Pagination from '@ncigdc/components/Pagination';
import Showing from '@ncigdc/components/Pagination/Showing';
import { Row } from '@ncigdc/uikit/Flex';
import TableActions from '@ncigdc/components/TableActions';
import Table, { Tr } from '@ncigdc/uikit/Table';
import {
  isSortedColumn,
  withSort,
} from '@ncigdc/utils/tables';
import timestamp from '@ncigdc/utils/timestamp';

export const AnnotationsTable = compose(
  setDisplayName('EnhancedAnnotationsTable'),
  connect(state => ({ tableColumns: state.tableColumns.annotations })),
  withSort('annotations_sort'),
)(
  ({
    downloadable,
    relay,
    hits,
    entityType = 'annotations',
    sort,
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
            style={{ padding: '1rem', marginTop: '-6rem' }}
          >
            {tableHeader}
          </h3>
        )}
        <Row
          style={{
            backgroundColor: 'white',
            padding: '1rem',
            justifyContent: 'space-between',
          }}
        >
          <Showing
            docType="annotations"
            prefix={entityType}
            params={relay.route.params}
            total={hits.total}
          />
          <TableActions
            type="annotation"
            scope="repository"
            arrangeColumnKey={entityType}
            total={hits.total}
            endpoint="annotations"
            downloadable={downloadable}
            entityType={entityType}
            downloadFields={tableInfo
              .filter(x => x.downloadable)
              .map(x => x.field || x.id)}
            sortOptions={tableInfo.filter(x => x.sortable)}
            tsvSelector="#repository-annotations-table"
            tsvFilename={`repository-annotations-table.${timestamp()}.tsv`}
          />
        </Row>
        <div style={{ overflowX: 'auto' }}>
          <Table
            body={(
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
            )}
            headings={tableInfo.map(x => (
              <x.th
                canAddToCart={canAddToCart}
                hits={hits}
                key={x.id}
                sorted={isSortedColumn(sort, x.id)}
                />
            ))}
            id="repository-annotations-table"
            />
        </div>
        <Pagination
          prefix={entityType}
          params={relay.route.params}
          total={hits.total}
        />
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

export default Relay.createContainer(
  AnnotationsTable,
  AnnotationsTableQuery,
);
