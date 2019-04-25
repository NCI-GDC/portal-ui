// @flow

import React from 'react';
import PropTypes from 'prop-types';

import { Column } from '@ncigdc/uikit/Flex';
import { withTheme } from '@ncigdc/theme';
import Table, {
  Tr, Td, Th, CollapsibleTd,
} from '@ncigdc/uikit/Table';

// th are vertical
const EntityPageVerticalTable = ({
  style = {},
  title,
  description = '',
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
      className={`${className} test-entity-table-wrapper`}
      id={id}
      style={{
        flexWrap: 'wrap',
        ...style,
      }}>
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
          }}>
          {title}
        </h1>
      )}
      {description}
      <Table
        body={(
          <tbody>
            {thToTd.map((d, i) => (
              <Tr key={d.th}>
                <Th
                  style={{
                    ...styles.tr,
                    width: '30%',
                    backgroundColor: i % 2 === 0 ? theme.tableStripe : '#fff',
                    textTransform: 'capitalize',
                    verticalAlign: 'top',
                  }}>
                  {d.th}
                </Th>
                {!!d.collapsibleTd && (
                  <CollapsibleTd
                    style={{
                      ...styles.td,
                      backgroundColor: i % 2 === 0 ? theme.tableStripe : '#fff',
                      ...d.style,
                    }}
                    text={d.collapsibleTd} />
                )}
                {!!d.td && (
                  <Td
                    style={{
                      ...styles.td,
                      backgroundColor: i % 2 === 0 ? theme.tableStripe : '#fff',
                      ...d.style,
                    }}>
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
                    }}>
                      --
                  </Td>
                )}
              </Tr>
            ))}
          </tbody>
        )}
        style={styles.table} />
    </Column>
  );
};

EntityPageVerticalTable.propTypes = {
  props: PropTypes.any,
  style: PropTypes.object,
  thToTd: PropTypes.array,
  title: PropTypes.node,
};

export default withTheme(EntityPageVerticalTable);
