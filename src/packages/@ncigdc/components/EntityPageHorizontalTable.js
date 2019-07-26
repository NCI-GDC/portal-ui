import React from 'react';
import * as d3 from 'd3';
import { get } from 'lodash';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Table, { Tr, Td, Th } from '@ncigdc/uikit/Table';
import { withTheme } from '@ncigdc/theme';

const colors = d3.scaleOrdinal(d3.schemeCategory20);

const styles = {
  table: {
    borderCollapse: 'collapse',
    borderSpacing: 0,
    overflow: 'auto',
    backgroundColor: '#fff',
  },
  tr: {
    border: 'none !important',
  },
  td: {
    border: 'none !important',
  },
};

// th are horizontal
const EntityPageHorizontalTable = ({
  style,
  title,
  titleStyle,
  rightComponent,
  headings,
  data,
  emptyMessage = 'No valid data to be shown',
  emptyMessageStyle,
  theme,
  tableId,
  idKey,
  dividerStyle,
  tableContainerStyle = {},
  ...props
}) => {
  return (
    <Column
      className={props.className || 'test-entity-table-wrapper'}
      style={{
        flexWrap: 'wrap',
        overflow: 'auto',
        ...style,
        ...tableContainerStyle,
      }}
      >
      {(title || rightComponent) && (
        <h1
          style={{
            color: theme.greyScale7,
            width: '100%',
            fontSize: '2rem',
            lineHeight: '1.4em',
            fontWeight: 'normal',
            marginTop: 0,
            marginBottom: 0,
            padding: '1rem',
            backgroundColor: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            ...titleStyle,
          }}
          >
          {`${title || <span />} ${rightComponent}`}
        </h1>
      )}
      {data.length > 0
        ? (
          <Table
            body={(
              <tbody>
                {data.map((d, k) => (
                  <Tr
                    key={d[idKey] || k}
                    style={{
                      ...styles.tr,
                      backgroundColor: get(d, 'select.props.selected', false)
                        ? theme.tableHighlight
                        : (k % 2 === 0 ? theme.tableStripe : '#fff'),
                    }}
                    >
                    {headings.map((h, i) => [].concat(get(d, h.key, '--')).map((v, j) => (
                      <Td
                        {...h.tdProps}
                        className={h.className || ''}
                        key={`${h.key}-${j}`}
                        style={{
                          ...(h.tdStyle || h.style || {}),
                          ...(i > 0 && j === 0 ? dividerStyle : {}),
                        }}
                        >
                        {h.color && (
                          <div
                            className="h-color"
                            style={{ backgroundColor: colors(i) }}
                            />
                        )}

                        {v || '--'}
                      </Td>
                    )))}
                  </Tr>
                ))}
              </tbody>
            )}
            headings={headings.map((h, i) => (
              <Th
                colSpan={h.subheadings ? h.subheadings.length : 1}
                key={h.key}
                rowSpan={h.subheadings ? 1 : 2}
                style={{
                  ...(h.thStyle || h.style || {}),
                  ...(i > 0 ? dividerStyle : {}),
                }}
                >
                {h.title}
              </Th>
            ))}
            id={tableId}
            style={styles.table}
            subheadings={headings.map(
              (h, i) => h.subheadings &&
                h.subheadings.map((s, j) => (
                  <Th
                    key={`subheading-${j}`}
                    style={{
                      ...(i > 0 && j === 0 ? dividerStyle : {}),
                    }}
                    >
                    {s}
                  </Th>
                ))
            )}
            />
        )
        : (
          <Row
            style={{
              borderBottom: `1px solid ${theme.greyScale5}`,
              ...emptyMessageStyle,
            }}
            >
            {emptyMessage && (
              <h2 style={{
                padding: '1rem',
                fontSize: '18px',
              }}
                  >
                {emptyMessage}
              </h2>
            )}
          </Row>
        )}
    </Column>
  );
};

export default withTheme(EntityPageHorizontalTable);
