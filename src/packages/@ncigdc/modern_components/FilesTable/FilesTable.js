/* @flow */

import React from 'react';
import {
  compose, setDisplayName, branch, renderComponent,
} from 'recompose';
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
import timestamp from '@ncigdc/utils/timestamp';

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

export default compose(
  setDisplayName('FilesTablePresentation'),
  connect(state => ({ tableColumns: state.tableColumns.files })),
  branch(
    ({ viewer }) => !viewer.repository.files.hits ||
      !viewer.repository.files.hits.edges.length,
    renderComponent(() => <div>No results found</div>)
  )
)(
  ({
    downloadable,
    viewer: { repository: { files: { hits } } },
    entityType = 'files',
    tableColumns,
    canAddToCart = true,
    tableHeader,
    dispatch,
    parentVariables,
  }) => {
    const tableInfo = tableColumns.slice().filter(x => !x.hidden);

    const prefix = 'files';

    return (
      <div className="test-files-table">
        {tableHeader && (
          <h1
            className="panel-title"
            style={{
              padding: '1rem',
              marginTop: '-6rem',
            }}>
            {tableHeader}
          </h1>
        )}
        <Row
          style={{
            backgroundColor: 'white',
            padding: '1rem',
            justifyContent: 'space-between',
          }}>
          <Showing
            docType="files"
            params={parentVariables}
            prefix={prefix}
            total={hits.total} />
          <TableActions
            arrangeColumnKey={entityType}
            downloadable={downloadable}
            downloadFields={tableInfo
              .filter(x => x.downloadable)
              .map(x => x.field || x.id)}
            endpoint="files"
            scope="repository"
            sortOptions={tableInfo.filter(x => x.sortable)}
            total={hits.total}
            tsvFilename={`repository-files-table.${timestamp()}.tsv`}
            tsvSelector="#repository-files-table"
            type="file" />
        </Row>
        <div style={{ overflowX: 'auto' }}>
          <Table
            body={(
              <tbody>
                {hits.edges.map((e, i) => (
                  <Tr index={i} key={e.node.id}>
                    {[
                      <Td key="add_to_cart">
                        {canAddToCart && (
                          <AddToCartButtonSingle file={e.node} />
                        )}
                        {!canAddToCart && (
                          <RemoveButton
                            aria-label="Remove"
                            onClick={() => dispatch(toggleFilesInCart(e.node))}>
                            <Tooltip Component="Remove">
              <i className="fa fa-trash-o" />
            </Tooltip>
                          </RemoveButton>
                        )}
                      </Td>,
                      ...tableInfo
                        .filter(x => x.td)
                        .map(x => (
                          <x.td
                            index={i}
                            key={x.id}
                            node={e.node}
                            total={hits.total} />
                        )),
                    ]}
                  </Tr>
                ))}
              </tbody>
            )}
            headings={[
              canAddToCart ? (
                <Th key="add_to_cart">
                  <AddToCartButtonAll
                    edges={hits.edges.map(e => e.node)}
                    total={hits.total} />
                </Th>
              ) : (
                <Th key="remove_from_cart" />
              ),
              ...tableInfo.map(x => (
                <x.th canAddToCart={canAddToCart} hits={hits} key={x.id} />
              )),
            ]}
            id="repository-files-table" />
        </div>
        <Pagination
          params={parentVariables}
          prefix={prefix}
          total={hits.total} />
      </div>
    );
  }
);
