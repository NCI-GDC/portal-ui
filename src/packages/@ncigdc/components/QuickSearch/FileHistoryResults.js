// @flow

import React from 'react';
import _ from 'lodash';

import withSelectableList from '@ncigdc/utils/withSelectableList';
import { styles as resultStyles } from './QuickSearchResults';
import { Row, Column } from '@ncigdc/uikit/Flex';

const styles = {
  resultIcon: {
    width: 32,
    height: '3.2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    backgroundColor: '#453D3D',
  },
};

export default ({
  results = [],
  query,
  isLoading,
  onActivateItem,
  onSelectItem,
  style = {},
}) =>
  results.map((result, i) => (
    <div style={{ ...resultStyles.container, ...style.container }} key={i}>
      <Row
        style={{
          ...resultStyles.item,
          ...(isLoading && resultStyles.deemphasizedItem),
          ...(result.isSelected && resultStyles.selectedItem),
        }}
        onMouseEnter={() => onSelectItem(result)}
        onClick={() => onActivateItem(result)}
      >
        <div style={resultStyles.itemIconWrapper}>
          <span style={styles.resultIcon}>FL</span>
        </div>
        <Column>
          <div style={{ verticalAlign: 'middle' }}>
            <span style={resultStyles.itemTitle}>{result.uuid}</span>
          </div>
          <div
            style={{
              ...resultStyles.highlights,
              ...(result.isSelected &&
                _.pick(resultStyles.selectedItem, 'color')),
            }}
          >
            File version {query} was updated
          </div>
        </Column>
      </Row>
    </div>
  ));
