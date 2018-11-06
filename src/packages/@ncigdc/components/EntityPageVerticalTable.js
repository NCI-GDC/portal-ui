// @flow

import React from 'react';
import PropTypes from 'prop-types';

import { Column } from '@ncigdc/uikit/Flex';
import { withTheme } from '@ncigdc/theme';
import Table, { Tr, Td, Th, CollapsibleTd } from '@ncigdc/uikit/Table';

// th are vertical
const EntityPageVerticalTable = ({
  style = {},
  title,
  thToTd,
  className,
  titleStyle,
  id,
  theme,
  ...props
}) => {
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
      className={className + ' test-entity-table-wrapper'}
      style={{
        flexWrap: 'wrap',
        ...style,
      }}
    >
      {title && (
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
            ...titleStyle,
          }}
        >
          {title}
        </h1>
      )}
      {
        <div style={{ paddingLeft: '10px', marginBottom: '20px' }}>
          <div>
            The project has controlled access data which required dbGAP Access.
          </div>
          <div>
            See instructions for{' '}
            <a href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data">
              Obtaining Access to Controlled Data.
            </a>
          </div>
        </div>
      }
      <Table
        style={styles.table}
        body={
          <tbody>
            {thToTd.map((d, i) => (
              <Tr key={d.th}>
                <Th
                  style={{
                    ...styles.tr,
                    backgroundColor: i % 2 === 0 ? theme.tableStripe : '#fff',
                    textTransform: 'capitalize',
                    verticalAlign: 'top',
                  }}
                >
                  {d.th}
                </Th>
                {!!d.collapsibleTd && (
                  <CollapsibleTd
                    style={{
                      ...styles.td,
                      backgroundColor: i % 2 === 0 ? theme.tableStripe : '#fff',
                      ...d.style,
                    }}
                    text={d.collapsibleTd}
                  />
                )}
                {!!d.td && (
                  <Td
                    style={{
                      ...styles.td,
                      backgroundColor: i % 2 === 0 ? theme.tableStripe : '#fff',
                      ...d.style,
                    }}
                  >
                    {d.td}
                  </Td>
                )}
                {!d.td &&
                  !d.collapsibleTd && (
                    <Td
                      style={{
                        ...styles.td,
                        backgroundColor:
                          i % 2 === 0 ? theme.tableStripe : '#fff',
                        ...d.style,
                      }}
                    >
                      --
                    </Td>
                  )}
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

export default withTheme(EntityPageVerticalTable);
