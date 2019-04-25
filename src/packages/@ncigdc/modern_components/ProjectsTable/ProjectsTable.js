/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import { compose, setDisplayName, mapProps } from 'recompose';
import { Row } from '@ncigdc/uikit/Flex';
import TableActions from '@ncigdc/components/TableActions';
import tableModels from '@ncigdc/tableModels';
import timestamp from '@ncigdc/utils/timestamp';

import Table, { Tr, Td } from '@ncigdc/uikit/Table';

export default compose(
  setDisplayName('ProjectsTablePresentation'),
  connect(state => ({ tableColumns: state.tableColumns.projects })),
  mapProps(props => ({
    ...props,
    hits: props.viewer.projects.hits,
  }))
)(
  ({
    downloadable,
    hits,
    params,
    entityType = 'projects',
    tableHeader,
    tableColumns,
  }) => {
    const tableInfo = tableColumns.slice().filter(x => !x.hidden);
    return (
      <div className="test-projects-table">
        <Row
          style={{
            backgroundColor: 'white',
            padding: '1rem',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {tableHeader && <h3 className="panel-title">{tableHeader}</h3>}
          <div>
            <b>{hits.total}</b>
            {' '}
Projects
          </div>
          <TableActions
            arrangeColumnKey={entityType}
            downloadable={downloadable}
            downloadFields={tableInfo
              .filter(x => x.downloadable)
              .map(x => x.field || x.id)}
            endpoint={entityType}
            scope="repository"
            sortOptions={tableInfo.filter(x => x.sortable)}
            total={hits.total}
            tsvFilename={`projects-table.${timestamp()}.tsv`}
            tsvSelector="#projects-table"
            type="project" />
        </Row>
        <div style={{ overflowX: 'auto' }}>
          <Table
            body={(
              <tbody>
                {hits.edges.map((e, i) => (
                  <Tr index={i} key={e.node.id}>
                    {tableInfo
                      .filter(x => x.td)
                      .map(x => <x.td key={x.id} node={e.node} />)}
                  </Tr>
                ))}
                <Tr>
                  {hits.total > 1 &&
                    tableInfo
                      .filter(x => x.td)
                      .map(
                        x => (x.total ? (
                          <x.total hits={hits} key={x.id} />
                          ) : (
                            <Td key={x.id} />
                          ))
                      )}
                </Tr>
              </tbody>
            )}
            headings={tableInfo
              .filter(x => !x.subHeading)
              .map(x => <x.th key={x.id} />)}
            id="projects-table"
            subheadings={tableInfo
              .filter(x => x.subHeading)
              .map(x => <x.th key={x.id} />)} />
        </div>
      </div>
    );
  }
);
