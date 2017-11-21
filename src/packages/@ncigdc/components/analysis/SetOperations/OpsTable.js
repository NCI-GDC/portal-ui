import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import urlJoin from 'url-join';
import { AUTH_API } from '@ncigdc/utils/constants';

import Table, { Tr, Td, TdNum, ThNum } from '@ncigdc/uikit/Table';
import { stringifyJSONParam } from '@ncigdc/utils/uri';
import { Tooltip } from '@ncigdc/uikit/Tooltip';
import { setModal } from '@ncigdc/dux/modal';
import SaveSetModal from '@ncigdc/components/Modals/SaveSetModal';
import GreyBox from '@ncigdc/uikit/GreyBox';
import { MAX_SET_SIZE } from '@ncigdc/utils/constants';
import { withTheme } from '@ncigdc/theme';
import download from '@ncigdc/utils/download';
import DownloadIcon from '@ncigdc/theme/icons/Download';

const ActionsTd = compose(
  connect(),
  withTheme,
)(
  ({
    theme,
    hide,
    count,
    dispatch,
    filters,
    type,
    CreateSetButton,
    fileName,
    push,
  }) => {
    const saveSetDisabled = count > MAX_SET_SIZE;

    return (
      <Td style={{ textAlign: 'right' }}>
        {hide ? (
          ''
        ) : (
          <span>
            <Tooltip
              Component={
                saveSetDisabled
                  ? `Set Operation can not be saved because it is over the limit of ${MAX_SET_SIZE}`
                  : 'Save selection as new set'
              }
              style={{ marginRight: 5 }}
            >
              <i
                style={
                  saveSetDisabled
                    ? { color: theme.greyScale4 }
                    : { cursor: 'pointer', color: 'rgb(37, 94, 153)' }
                }
                className="fa fa-save"
                onClick={() => {
                  if (saveSetDisabled) return;
                  dispatch(
                    setModal(
                      <SaveSetModal
                        title={`Save selection as new set`}
                        total={count}
                        filters={filters}
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
            <CreateSetButton
              filters={filters}
              onComplete={setId => {
                download({
                  params: {
                    attachment: true,
                    format: 'tsv',
                    sets: [
                      {
                        id: setId,
                        type,
                        filename: `${fileName
                          .replace(/∩/g, 'intersection')
                          .replace(/∪/g, 'union')}.tsv`,
                      },
                    ],
                  },
                  url: urlJoin(AUTH_API, '/tar_sets'),
                  method: 'POST',
                  altMessage: false,
                })(() => {}, () => {});
              }}
              Component={props => (
                <Tooltip
                  {...props}
                  Component={'Export as TSV'}
                  style={{
                    cursor: 'pointer',
                    color: theme.primary,
                    textDecoration: 'underline',
                  }}
                >
                  <DownloadIcon key="icon" style={{ marginRight: '5px' }} />
                </Tooltip>
              )}
            />
            {type === 'case' && (
              <CreateSetButton
                filters={filters}
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
                Component={p => (
                  <Tooltip Component="View files in repository">
                    <i
                      className="fa fa-database"
                      {...p}
                      style={{
                        cursor: 'pointer',
                        color: 'rgb(37, 94, 153)',
                      }}
                    />
                  </Tooltip>
                )}
              />
            )}
          </span>
        )}
      </Td>
    );
  },
);

export default compose(
  withTheme,
)(
  ({
    selected,
    toggle,
    push,
    ops,
    CountComponent,
    selectedFilters,
    type,
    CreateSetButton,
    theme,
  }) => (
    <Table
      headings={[
        'Select',
        'Set Operation',
        <ThNum key="# Items"># Items</ThNum>,
        '',
      ]}
      body={
        <tbody>
          {ops.map((op, i) => (
            <CountComponent filters={op.filters} key={op.op}>
              {count => (
                <Tr
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
                      aria-label={`Select ${op.op}`}
                      checked={selected.has(op.op)}
                      onChange={e => toggle(op.op)}
                    />
                  </Td>
                  <Td>{op.op}</Td>
                  <TdNum>
                    {count === 0 ? (
                      0
                    ) : count === '' ? (
                      <GreyBox />
                    ) : (
                      <CreateSetButton
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
                        Component={props => (
                          <Tooltip
                            {...props}
                            Component={`View ${type} set in exploration`}
                            style={{
                              cursor: 'pointer',
                              color: theme.primary,
                              textDecoration: 'underline',
                            }}
                          >
                            {count.toLocaleString()}
                          </Tooltip>
                        )}
                      />
                    )}
                  </TdNum>
                  <ActionsTd
                    hide={!count}
                    count={count}
                    filters={op.filters}
                    fileName={`${op.op}-set-ids`}
                    type={type}
                    CreateSetButton={CreateSetButton}
                    push={push}
                  />
                </Tr>
              )}
            </CountComponent>
          ))}
          <CountComponent filters={selectedFilters}>
            {count => (
              <Tr
                style={{
                  borderTop: '1px solid black',
                  borderBottom: '1px solid black',
                }}
              >
                <Td colSpan="2">
                  <b>Union of selected sets</b>
                </Td>
                <TdNum>
                  {selected.size === 0 || count === 0 ? (
                    0
                  ) : count === '' ? (
                    <GreyBox />
                  ) : (
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
                      Component={p => (
                        <Tooltip Component={`View ${type} set in exploration`}>
                          <span
                            {...p}
                            style={{
                              cursor: 'pointer',
                              color: theme.primary,
                              textDecoration: 'underline',
                            }}
                          >
                            {count.toLocaleString()}
                          </span>
                        </Tooltip>
                      )}
                    />
                  )}
                </TdNum>
                <ActionsTd
                  hide={!selected.size || !count}
                  count={count}
                  filters={selectedFilters}
                  fileName="union-of-set-ids"
                  type={type}
                  CreateSetButton={CreateSetButton}
                  push={push}
                />
              </Tr>
            )}
          </CountComponent>
        </tbody>
      }
    />
  ),
);
