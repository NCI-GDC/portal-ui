/* global d3 */

import React, { PropTypes } from 'react';
import { Row, Column } from '../uikit/Flex';
import theme from '../theme';
import Table, { Tr, Td, Th } from '../uikit/Table';

const colors = d3.scale.category20();

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
}) => {
  return (
    <Column
      style={{
        flexWrap: 'wrap',
        overflow: 'auto',
        ...style,
      }}
    >
      {title &&
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
          {title} {rightComponent}
        </h3>
      }
      {!!data.length &&
        <Table
          style={styles.table}
          headings={headings.map(h => (
            <Th
              rowSpan={h.subheadings ? 1 : 2}
              colSpan={h.subheadings ? h.subheadings.length : 1}
              key={h.key || h.value}
              style={h.style || {}}
            >
              {h.title}
            </Th>
          ))}
          subheadings={
            headings.map(h => h.subheadings && h.subheadings.map((s, i) =>
              <Th key={`subheading-${i}`}>{s}</Th>)
            )
          }
          body={
            <tbody>
              {data.map((d, i) => {
                return (
                  <Tr
                    style={{
                      ...styles.tr,
                      backgroundColor: i % 2 === 0 ? theme.blueGrey : '#fff',
                    }}
                    key={i}
                  >
                    {headings.map(h => {
                      const value = typeof d[h.key] !== 'undefined' ? d[h.key] : h.value;
                      return [].concat(value).map((v, i) =>
                        <Td key={`${h.key}-${i}`} style={h.style || {}}>
                          {h.color &&
                            <div className="h-color" style={{ backgroundColor: colors(i) }} />
                          }
                          {v || '--'}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}
            </tbody>
          }
        />
      }
      {!data.length &&
        <Row
          style={{
            borderBottom: `1px solid ${theme.greyScale5}`,
          }}
        >
          <h4 style={{ padding: '1rem' }}>{emptyMessage}</h4>
        </Row>
      }
    </Column>
  );
};

EntityPageHorizontalTable.propTypes = {
  title: PropTypes.node,
  style: PropTypes.object,
  rightComponent: PropTypes.object,
  headings: PropTypes.array,
  data: PropTypes.array,
  emptyMessage: PropTypes.string,
};

export default EntityPageHorizontalTable;
