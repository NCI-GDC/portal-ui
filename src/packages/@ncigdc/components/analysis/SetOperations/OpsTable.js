import React from 'react';
import Table, { Tr, Td, Th } from '@ncigdc/uikit/Table';
import { stringifyJSONParam } from '@ncigdc/utils/uri';
import { theme } from '@ncigdc/theme';
import { Row } from '@ncigdc/uikit/Flex';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { setModal } from '@ncigdc/dux/modal';
import SaveSetModal from '@ncigdc/components/Modals/SaveSetModal';
import { SET_DOWNLOAD_FIELDS as downloadFields } from '@ncigdc/utils/constants';
import DownloadButton from '@ncigdc/components/DownloadButton';
import { iconButton } from '@ncigdc/theme/mixins';

export default ({
  selected,
  toggle,
  push,
  ops,
  CountComponent,
  selectedFilters,
  type,
  dispatch,
  CreateSetButton,
}) =>
  <Table
    headings={[
      { key: 'selected', title: 'Select' },
      { key: 'op', title: 'Set Operation' },
      {
        key: 'count',
        title: '# Items',
        style: { textAlign: 'right' },
      },
    ].map(th => <Th key={th.key}>{th.title}</Th>)}
    body={
      <tbody>
        {ops.map((op, i) =>
          <Tr
            key={op.op}
            index={i}
            style={{
              ...(selected.has(op.op) && {
                backgroundColor: theme.tableHighlight,
              }),
            }}
          >
            <Td>
              <input
                type="checkbox"
                checked={selected.has(op.op)}
                onChange={e => toggle(op.op)}
              />
            </Td>
            <Td>
              {op.op}
            </Td>
            <Td>
              <CountComponent filters={op.filters}>
                {count =>
                  <Row style={{ alignItems: 'center' }}>
                    <span>
                      {count === 0
                        ? 0
                        : <CreateSetButton
                            filters={op.filters}
                            onComplete={setId => {
                              push({
                                pathname: '/exploration',
                                query: {
                                  searchTableTab:
                                    (type === 'ssm' ? 'mutation' : type) + 's',
                                  filters: stringifyJSONParam({
                                    op: 'AND',
                                    content: [
                                      {
                                        op: 'IN',
                                        content: {
                                          field: `${type}s.${type}_id`,
                                          value: [`set_id:${setId}`],
                                        },
                                      },
                                    ],
                                  }),
                                },
                              });
                            }}
                            Component={p =>
                              <Tooltip
                                Component={`View ${type} set in exploration`}
                              >
                                <span
                                  {...p}
                                  style={{
                                    cursor: 'pointer',
                                    color: 'rgb(43, 118, 154)',
                                    textDecoration: 'underline',
                                  }}
                                >
                                  {count.toLocaleString()}
                                </span>
                              </Tooltip>}
                          />}
                    </span>&nbsp;{count > 0 &&
                      <span style={{ marginLeft: 'auto' }}>
                        <Tooltip Component="Save selection as new set">
                          <i
                            style={{
                              cursor: 'pointer',
                              color: 'rgb(37, 94, 153)',
                            }}
                            className="fa fa-save"
                            onClick={() => {
                              dispatch(
                                setModal(
                                  <SaveSetModal
                                    title={`Save selection as new set`}
                                    total={count}
                                    filters={op.filters}
                                    type={type}
                                    displayType={type}
                                    CreateSetButton={CreateSetButton}
                                    setName="My Set"
                                  />,
                                ),
                              );
                            }}
                          />
                        </Tooltip>
                        &nbsp;
                        <Tooltip Component="Export as TSV">
                          <DownloadButton
                            className="test-download-set-tsv"
                            style={iconButton}
                            endpoint={`${type}s`}
                            activeText="" //intentionally blank
                            inactiveText="" //intentionally blank
                            altMessage={false}
                            setParentState={() => {}}
                            active={false}
                            filters={op.filters}
                            extraParams={{ format: 'tsv' }}
                            fields={downloadFields[type]}
                            filename={`${op.op}-set-ids`}
                          />
                        </Tooltip>
                        &nbsp;
                        {type === 'case' &&
                          <CreateSetButton
                            filters={op.filters}
                            onComplete={setId => {
                              push({
                                pathname: '/repository',
                                query: {
                                  filters: stringifyJSONParam({
                                    op: 'AND',
                                    content: [
                                      {
                                        op: 'IN',
                                        content: {
                                          field: `${type}s.${type}_id`,
                                          value: [`set_id:${setId}`],
                                        },
                                      },
                                    ],
                                  }),
                                },
                              });
                            }}
                            Component={p =>
                              <Tooltip Component="View files in repository">
                                <i
                                  className="fa fa-database"
                                  {...p}
                                  style={{
                                    cursor: 'pointer',
                                    color: 'rgb(37, 94, 153)',
                                  }}
                                />
                              </Tooltip>}
                          />}
                        &nbsp;
                      </span>}
                  </Row>}
              </CountComponent>
            </Td>
          </Tr>,
        )}
        <Tr
          style={{
            borderTop: '1px solid black',
            borderBottom: '1px solid black',
          }}
        >
          <Td colSpan="2"><b>Union of selected sets</b></Td>
          <Td style={{ textAlign: 'right' }}>
            {selected.size === 0
              ? <Row>
                  <span>0</span>                         {' '}
                  <span
                    style={{
                      marginLeft: 'auto',
                      opacity: 0,
                    }}
                  >
                    {type === 'case' &&
                      <i
                        className="fa fa-database"
                        style={{
                          cursor: 'pointer',
                          color: 'rgb(37, 94, 153)',
                        }}
                      />}
                  </span>
                </Row>
              : <CountComponent filters={selectedFilters}>
                  {count =>
                    count === 0
                      ? 0
                      : <Row>
                          <CreateSetButton
                            filters={selectedFilters}
                            onComplete={setId => {
                              push({
                                pathname: '/exploration',
                                query: {
                                  searchTableTab:
                                    (type === 'ssm' ? 'mutation' : type) + 's',
                                  filters: stringifyJSONParam({
                                    op: 'AND',
                                    content: [
                                      {
                                        op: 'IN',
                                        content: {
                                          field: `${type}s.${type}_id`,
                                          value: [`set_id:${setId}`],
                                        },
                                      },
                                    ],
                                  }),
                                },
                              });
                            }}
                            Component={p =>
                              <Tooltip
                                Component={`View ${type} set in exploration`}
                              >
                                <span
                                  {...p}
                                  style={{
                                    cursor: 'pointer',
                                    color: 'rgb(43, 118, 154)',
                                    textDecoration: 'underline',
                                  }}
                                >
                                  {count}
                                </span>
                              </Tooltip>}
                          />
                          <span
                            style={{
                              marginLeft: 'auto',
                              opacity: selected.size && count ? 1 : 0,
                            }}
                          >
                            {' '}                      {' '}
                            <Tooltip Component="Save selection as new set">
                              <i
                                style={{
                                  cursor: 'pointer',
                                  color: 'rgb(37, 94, 153)',
                                }}
                                className="fa fa-save"
                                onClick={() => {
                                  dispatch(
                                    setModal(
                                      <SaveSetModal
                                        title={`Save selection as new set`}
                                        total={count}
                                        filters={selectedFilters}
                                        type={type}
                                        displayType={type}
                                        CreateSetButton={CreateSetButton}
                                      />,
                                    ),
                                  );
                                }}
                              />
                            </Tooltip>
                            &nbsp;
                            <Tooltip Component="Export as TSV">
                              <DownloadButton
                                className="test-download-set-tsv"
                                style={{
                                  margin: 0,
                                  padding: 0,
                                  display: 'inline',
                                  color: 'rgb(37, 94, 153)',
                                  backgroundColor: 'transparent',
                                }}
                                endpoint={`${type}s`}
                                activeText="" //intentionally blank
                                inactiveText="" //intentionally blank
                                altMessage={false}
                                setParentState={() => {}}
                                active={false}
                                filters={selectedFilters}
                                extraParams={{ format: 'tsv' }}
                                fields={downloadFields[type]}
                                filename={`union-of-set-ids`}
                              />
                            </Tooltip>
                            &nbsp;
                            {type === 'case' &&
                              <CreateSetButton
                                filters={selectedFilters}
                                onComplete={setId => {
                                  push({
                                    pathname: '/repository',
                                    query: {
                                      filters: stringifyJSONParam({
                                        op: 'AND',
                                        content: [
                                          {
                                            op: 'IN',
                                            content: {
                                              field: `${type}s.${type}_id`,
                                              value: [`set_id:${setId}`],
                                            },
                                          },
                                        ],
                                      }),
                                    },
                                  });
                                }}
                                Component={p =>
                                  <Tooltip Component="View files in repository">
                                    <i
                                      className="fa fa-database"
                                      {...p}
                                      style={{
                                        cursor: 'pointer',
                                        color: 'rgb(37, 94, 153)',
                                      }}
                                    />
                                  </Tooltip>}
                              />}
                            &nbsp;
                          </span>
                        </Row>}
                </CountComponent>}
          </Td>
        </Tr>
      </tbody>
    }
  />;
