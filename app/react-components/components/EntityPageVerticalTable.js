import React, { PropTypes } from 'react';

import { Column } from '../uikit/Flex';
import theme from '../theme';
import Table, { Tr, Td, Th } from '../uikit/Table';

// th are vertical
const EntityPageVerticalTable = ({ style, title, thToTd }) => {
  const styles = {
    table: {
      borderCollapse: 'collapse',
      borderSpacing: 0,
      overflow: 'auto',
      backgroundColor: '#fff',
    },
    tr: {
      borderTop: `1px solid ${theme.greyScale5}`,
      borderBottom: `1px solid ${theme.greyScale5}`,
      borderRight: 0,
      borderLeft: 0,
      color: theme.greyScale2,
    },
    td: {
      borderRight: 0,
      color: theme.greyScale2,
    },
  };
  return (
    <Column
      style={{
        flexWrap: 'wrap',
        overflow: 'scroll',
        borderRight: `1px solid ${theme.greyScale5}`,
        borderTop: `1px solid ${theme.greyScale5}`,
        borderLeft: `1px solid ${theme.greyScale5}`,
        borderBottom: 0,
        ...style,
      }}
    >
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
        }}
      >{title}</h3>
      <Table
        style={styles.table}
        body={
          <tbody>
          {thToTd.map((d, i) => (
            <Tr key={d.th}>
              <Th
                style={{
                  ...styles.tr,
                  backgroundColor: i % 2 === 0 ? theme.greyScale6 : '#fff',
                  textTransform: 'capitalize',
                }}
              >
                {d.th}
              </Th>
              <Td
                style={{
                  ...styles.td,
                  backgroundColor: i % 2 === 0 ? theme.greyScale6 : '#fff',
                }}
              >
                {d.td || '--'}
              </Td>
            </Tr>
          ))}
          </tbody>
        }
      />
    </Column>
  );
};

EntityPageVerticalTable.propTypes = {
  title: PropTypes.node,
  style: PropTypes.object,
  props: PropTypes.any,
  thToTd: PropTypes.array,
};

export default EntityPageVerticalTable;
