/* @flow */

import React from 'react';
import Relay from 'react-relay/classic';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import Pagination from '@ncigdc/components/Pagination';
import Showing from '@ncigdc/components/Pagination/Showing';
import AddToCartButtonAll from '@ncigdc/components/AddToCartButtonAll';
import { Row } from '@ncigdc/uikit/Flex';
import TableActions from '@ncigdc/components/TableActions';
import tableModels from '@ncigdc/tableModels';
import Table, { Th, Tr, Td } from '@ncigdc/uikit/Table';
import styled from '@ncigdc/theme/styled';
import Button from '@ncigdc/uikit/Button';
import AddToCartButtonSingle from '@ncigdc/components/AddToCartButtonSingle';
import { toggleFilesInCart } from '@ncigdc/dux/cart';
import { Tooltip } from '@ncigdc/uikit/Tooltip';

const RemoveButton = styled(Button, {
  backgroundColor: '#FFF',
  borderColor: '#CCC',
  color: '#333',
  margin: '0 auto',
  padding: '0px 5px',
  ':hover': {
    background:
      'linear-gradient(to bottom, #ffffff 50%, #e6e6e6 100%) repeat scroll 0 0 #E6E6E6',
    borderColor: '#ADADAD',
  },
});

export const SearchTable = compose(
  connect(state => ({ tableColumns: state.tableColumns.files })),
)(
  ({
    downloadable,
    relay,
    hits,
    entityType = 'files',
    tableColumns,
    canAddToCart = true,
    tableHeader,
    dispatch,
  }) => {
    const tableInfo = tableModels[entityType]
      .slice()
      .sort((a, b) => tableColumns.indexOf(a.id) - tableColumns.indexOf(b.id))
      .filter(x => tableColumns.includes(x.id));

    const prefix = 'files';

    return (
      <div className="test-files-table">
        {tableHeader &&
          <h3
            className="panel-title"
            style={{ padding: '1rem', marginTop: '-6rem' }}
          >
            {tableHeader}
          </h3>}
        <Row
          style={{
            backgroundColor: 'white',
            padding: '1rem',
            justifyContent: 'space-between',
          }}
        >
          <Showing
            docType="files"
            prefix={prefix}
            params={relay.route.params}
            total={hits.total}
          />
          <TableActions
            prefix={prefix}
            total={hits.total}
            sortKey="files_sort"
            endpoint="files"
            downloadable={downloadable}
            entityType={entityType}
            downloadFields={tableInfo
              .filter(x => x.downloadable)
              .map(x => x.field || x.id)}
            sortOptions={tableInfo.filter(x => x.sortable)}
            tsvSelector="#repository-files-table"
            tsvFilename="repository-files-table.tsv"
          />
        </Row>
        <div style={{ overflowX: 'auto' }}>
          <Table
            id="repository-files-table"
            headings={[
              <Th key="add_to_cart">
                {canAddToCart &&
                  <AddToCartButtonAll
                    edges={hits.edges.map(e => e.node)}
                    total={hits.total}
                  />}
              </Th>,
              ...tableInfo.map(x =>
                <x.th key={x.id} hits={hits} canAddToCart={canAddToCart} />,
              ),
            ]}
            body={
              <tbody>
                {hits.edges.map((e, i) =>
                  <Tr key={e.node.id} index={i}>
                    {[
                      <Td key="add_to_cart">
                        {canAddToCart &&
                          <AddToCartButtonSingle file={e.node} />}
                        {!canAddToCart &&
                          <RemoveButton
                            onClick={() => dispatch(toggleFilesInCart(e.node))}
                            aria-label="Remove"
                          >
                            <Tooltip Component={'Remove'}>
                              <i className="fa fa-trash-o" />
                            </Tooltip>
                          </RemoveButton>}
                      </Td>,
                      ...tableInfo
                        .filter(x => x.td)
                        .map(x =>
                          <x.td
                            key={x.id}
                            node={e.node}
                            relay={relay}
                            index={i}
                            total={hits.total}
                          />,
                        ),
                    ]}
                  </Tr>,
                )}
              </tbody>
            }
          />
        </div>
        <Pagination
          prefix={prefix}
          params={relay.route.params}
          total={hits.total}
        />
      </div>
    );
  },
);

export const FileTableQuery = {
  fragments: {
    hits: () => Relay.QL`
      fragment on FileConnection {
        total
        edges {
          node {
            id
            file_id
            file_name
            file_size
            access
            file_state
            state
            acl
            data_category
            data_format
            submitter_id
            platform
            data_type
            experimental_strategy
            cases {
              hits(first: 1) {
                total
                edges {
                  node {
                    case_id
                    project {
                      project_id
                    }
                  }
                }
              }
            }
            annotations {
              hits(first:0) {
                total
              }
            }
          }
        }
      }
    `,
  },
};

const FileTable = Relay.createContainer(SearchTable, FileTableQuery);

export default FileTable;
