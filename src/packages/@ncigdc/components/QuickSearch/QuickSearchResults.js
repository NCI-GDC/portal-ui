// @flow
/* eslint react/prop-types:0 */

import React from 'react';
import _ from 'lodash';
import entityShortnameMapping from '@ncigdc/utils/entityShortnameMapping';
import type { TSearchHit } from './types';
import { internalHighlight } from '@ncigdc/uikit/Highlight';

const styles = {
  container: {
    position: 'absolute',
    right: 0,
    top: '100%',
    backgroundColor: '#fff',
    listStyleType: 'none',
    padding: 0,
    boxShadow:
      'rgba(0, 0, 0, 0.156863) 0px 2px 5px 0px, rgba(0, 0, 0, 0.117647) 0px 2px 10px 0px',
    zIndex: 90,
    maxHeight: '500px',
    overflowY: 'auto',
    width: '406px',
  },
  item: {
    padding: '0.5rem 1rem',
    transition: 'all 0.1s ease',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  itemIconWrapper: {
    marginLeft: '-1rem',
    marginTop: '-0.5rem',
    marginBottom: '-0.5rem',
    marginRight: '1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 32,
    backgroundColor: '#505556',
    flexShrink: 0,
  },
  itemIcon: {
    width: '100%',
    height: '3.2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    backgroundColor: '#453D3D',
  },
  itemTitle: {
    fontWeight: '500',
  },
  selectedItem: {
    backgroundColor: 'rgb(0, 80, 131)',
    color: '#fff',
  },
  deemphasizedItem: {
    color: '#999',
  },
  highlights: {
    fontSize: '1.14rem',
    fontStyle: 'italic',
    color: '#525252',
  },
  loadingMessage: {
    minWidth: '11em',
    textAlign: 'left',
    color: '#999',
  },
};

const ResultIcon = ({ type, style }) => (
  <span style={style}>{entityShortnameMapping[type] || type}</span>
);

export const findMatchingToken = (item, lq, value = '') => {
  const ks = Object.keys(item);

  for (let i = 0; i < ks.length; i++) {
    const k = ks[i];
    if (k === 'isSelected') continue;
    const terms = [].concat(item[k]);
    for (let j = 0; j < terms.length; j++) {
      const term = terms[j];
      if (_.isObject(term)) {
        if (term.hits) {
          const edges = term.hits.edges || [];

          for (let jj = 0; jj < edges; jj++) {
            const nextValue = findMatchingToken(edges[jj].node, lq, value);
            if (!(value && value.length < nextValue.length)) {
              value = nextValue;
            }
          }
        }
        const nextValue = findMatchingToken(term, lq, value);
        if (!(value && nextValue && value.length < nextValue.length)) {
          value = nextValue;
        }
        continue;
      }

      if (
        (term || '')
          .toLocaleLowerCase()
          .replace(/[()]/g, '')
          .indexOf(lq) !== -1
      ) {
        value = term;
      }
    }
  }

  return value;
};

const ResultHighlights = ({
  item,
  query,
  style,
}: {
  item: Object,
  query: string,
  style: Object,
}) => {
  const lq = query.toLocaleLowerCase();
  const value = findMatchingToken(item, lq);

  return <div style={style}>{internalHighlight(lq, value)}</div>;
};

type TProps = {
  results: TSearchHit[],
  query: string,
  onSelectItem: Function,
  onActivateItem: Function,
  isLoading: boolean,
  style: object,
};

export default ({
  results = [],
  query,
  isLoading,
  onSelectItem,
  onActivateItem,
  style = {},
}: TProps) => (
  <ul
    style={{ ...styles.container, ...style.container }}
    className="test-quick-search-results"
  >
    {results.map((item, i) => (
      <li
        key={item.id}
        style={{
          ...(item.isSelected && styles.selectedItem),
          ...styles.item,
          ...(isLoading && styles.deemphasizedItem),
        }}
        onMouseEnter={() => onSelectItem(item)}
        onClick={() => onActivateItem(item)}
      >
        <div style={styles.itemIconWrapper}>
          <ResultIcon
            type={atob(item.id).split(':')[0]}
            style={styles.itemIcon}
          />
        </div>
        <div>
          <span style={styles.itemTitle}>
            {item.symbol || atob(item.id).split(':')[1]}
          </span>
          <ResultHighlights
            item={item}
            query={query}
            style={{
              ...styles.highlights,
              ...(item.isSelected && _.pick(styles.selectedItem, 'color')),
            }}
          />
        </div>
      </li>
    ))}
  </ul>
);
