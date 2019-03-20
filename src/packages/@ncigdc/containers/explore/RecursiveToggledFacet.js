import React from 'react';
import { get, startCase } from 'lodash';
import { connect } from 'react-redux';
import {
  addFacetNames,
  changeFacetNames,
} from '@ncigdc/dux/facetsExpandedStatus';

import { compose, withState, withPropsOnChange } from 'recompose';
import { Column } from '@ncigdc/uikit/Flex';
import {
  ToggleMoreLink,
  BottomRow,
} from '@ncigdc/components/Aggregations/TermAggregation';

const RecursiveToggledFacet = compose(
  connect((state: any) => ({
    facetsExpandedStatus: state.facetsExpandedStatus,
  })),
  withState('headerCollapsed', 'setHeaderCollapsed', {}),
  withState('showingMore', 'setShowingMore', false)
  // withPropsOnChange(['hash'], ({ category, hash, dispatch }) => {
  //   dispatch(addFacetNames(category, Object.keys(hash)));
  // })
)(
  ({
    hash,
    Component,
    category,
    showingMore,
    setShowingMore,
    NestedWrapper,
    facetsExpandedStatus,
  }) => {
    const keyArray = Object.keys(hash);
    if (!hash || keyArray === 0) {
      return '';
    }
    if (keyArray.includes('description')) {
      return Component(hash);
    }
    return (
      <Column>
        {keyArray.slice(0, showingMore ? Infinity : 5).map(key => {
          if (Object.keys(hash[key]).includes('description')) {
            return Component(hash[key]);
          }

          return (
            <NestedWrapper
              key={key + 'nestedWrapper'}
              Component={
                <RecursiveToggledFacet hash={hash[key]} Component={Component} />
              }
              title={startCase(key)}
              isCollapsed={get(facetsExpandedStatus[category], key, true)}
              setCollapsed={() => dispatch(changeFacetNames(category, key))}
            />
          );
        })}
        {keyArray.length > 5 && (
          <BottomRow style={{ marginRight: '1rem' }}>
            <ToggleMoreLink onClick={() => setShowingMore(!showingMore)}>
              {showingMore
                ? 'Less...'
                : keyArray.length - 5 && `${keyArray.length - 5} More...`}
            </ToggleMoreLink>
          </BottomRow>
        )}
      </Column>
    );
  }
);

export default RecursiveToggledFacet;
