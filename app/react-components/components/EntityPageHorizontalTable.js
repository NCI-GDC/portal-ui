import React, { PropTypes } from 'react';

import { Row, Column } from '../uikit/Flex';
import theme from '../theme';
import Table, { Tr, Td, Th } from '../uikit/Table';

const colors = d3.scale.category20();

// th are horizontal
const EntityPageHorizontalTable = ({ style, title, titleStyle, rightComponent, headings, data, emptyMessage}) => {
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
  return (
    <Column
      style={{
        flexWrap: 'wrap',
        overflow: 'scroll',
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
      {data.length ? (
        <Table
          style={styles.table}
          headings={headings.map(h => <Th key={h.key || h.value}>{h.title}</Th>)}
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

                    return (
                      <Td key={h.key || h.value} style={h.style || {}}>
                        {h.color && <div className="item-color" style={{ backgroundColor: colors(i) }} />}
                        {h.onClick && value ? <a onClick={() => h.onClick(d)}>{value}</a> : (value || '--')}
                      </Td>
                    );
                  })}
                  </Tr>);
              })}
            </tbody>
        }
        />) : (
        <Row
          style={{
            borderBottom: `1px solid ${theme.greyScale5}`,
          }}
        >
          <h4 style={{ padding: '1rem' }}>{emptyMessage}</h4>
        </Row>)
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
