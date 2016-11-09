import React, { PropTypes } from 'react';

import { Column } from '../uikit/Flex';
import theme from '../theme';
import Table, { Tr, Td, Th, CollapsibleTd } from '../uikit/Table';

// th are vertical
const EntityPageVerticalTable = ({ style = {}, title, thToTd, className, titleStyle, id }) => {
  const styles = {
    table: {
      borderCollapse: 'collapse',
      borderSpacing: 0,
      overflow: 'auto',
      backgroundColor: '#fff',
    },
    tr: {
      border: 'none !important',
      color: theme.greyScale2,
    },
    td: {
      border: 'none !important',
      color: theme.greyScale2,
    },
  };
  return (
    <Column
      id={id}
      className={className}
      style={{
        flexWrap: 'wrap',
        overflow: 'auto',
        ...style,
      }}
    >
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
          ...titleStyle
        }}
      >
        {title}
      </h1>
      <Table
        style={styles.table}
        body={
          <tbody>
          {thToTd.map((d, i) => (
            <Tr key={d.th}>
              <Th
                style={{
                  ...styles.tr,
                  backgroundColor: i % 2 === 0 ? theme.blueGrey : '#fff',
                  textTransform: 'capitalize',
                  verticalAlign: 'top',
                }}
              >
                {d.th}
              </Th>
              {d.collapsibleTd &&
                (<CollapsibleTd
                  style={{
                    ...styles.td,
                    backgroundColor: i % 2 === 0 ? theme.blueGrey : '#fff',
                    ...d.style,
                  }}
                  text={d.collapsibleTd || '--'}
                />)
              }
              {d.td &&
                (<Td
                  style={{
                    ...styles.td,
                    backgroundColor: i % 2 === 0 ? theme.blueGrey : '#fff',
                    ...d.style,
                  }}
                >
                  {d.td || '--'}
                </Td>)
              }
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
