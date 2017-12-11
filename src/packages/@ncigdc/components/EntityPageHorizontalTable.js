// @flow

import React from 'react';
import * as d3 from 'd3';
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
  emptyMessage,
  emptyMessageStyle,
  theme,
  tableId,
  idKey,
  dividerStyle,
  ...props
}) => (
  <Column
    className={props.className || 'test-entity-table-wrapper'}
    style={{
      flexWrap: 'wrap',
      overflow: 'auto',
      ...style,
    }}
  >
    {(title || rightComponent) && (
        <h3
          style={{
            color: theme.greyScale7,
            width: '100%',
            fontSize: '24px',
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
          {title || <span />} {rightComponent}
        </h3>
      )}
    {!!data.length && (
      <Table
        id={tableId}
        style={styles.table}
        headings={headings.map((h, i) => (
          <Th
            rowSpan={h.subheadings ? 1 : 2}
            colSpan={h.subheadings ? h.subheadings.length : 1}
            key={h.key}
            style={{
              ...(h.thStyle || h.style || {}),
              ...(i > 0 ? dividerStyle : {}),
            }}
          >
            {h.title}
          </Th>
        ))}
        subheadings={headings.map(
          (h, i) =>
            h.subheadings &&
            h.subheadings.map((s, j) => (
              <Th
                key={`subheading-${j}`}
                style={{
                  ...(i > 0 && j === 0 ? dividerStyle : {}),
                }}
              >
                {s}
              </Th>
            )),
        )}
        body={
          <tbody>
            {data.map((d, i) => (
              <Tr
                style={{
                  ...styles.tr,
                  backgroundColor: i % 2 === 0 ? theme.tableStripe : '#fff',
                }}
                key={d[idKey] || i}
              >
                {headings.map((h, i) =>
                  [].concat(d[h.key]).map((v, j) => (
                    <Td
                      {...h.tdProps}
                      key={`${h.key}-${j}`}
                      style={{
                        ...(h.tdStyle || h.style || {}),
                        ...(i > 0 && j === 0 ? dividerStyle : {}),
                      }}
                      className={h.className || ''}
                    >
                      {h.color && (
                        <div
                          className="h-color"
                          style={{ backgroundColor: colors(i) }}
                        />
                      )}
                      {v || '--'}
                    </Td>
                  )),
                )}
              </Tr>
            ))}
          </tbody>
        }
      />
    )}
    {!data.length && (
      <Row
        style={{
          borderBottom: `1px solid ${theme.greyScale5}`,
          ...emptyMessageStyle,
        }}
      >
        {emptyMessage && <h4 style={{ padding: '1rem' }}>{emptyMessage}</h4>}
      </Row>
    )}
  </Column>
);

export default withTheme(EntityPageHorizontalTable);
