import React from 'react';
import { get, startCase, orderBy } from 'lodash';
import { compose, withState } from 'recompose';
import { Column } from '@ncigdc/uikit/Flex';
import {
  ToggleMoreLink,
  BottomRow,
} from '@ncigdc/components/Aggregations/TermAggregation';

const RecursiveToggledFacet = compose(
  withState('headerCollapsed', 'setHeaderCollapsed', {}),
  withState('showingMore', 'setShowingMore', false)
)(
  ({
    hash,
    Component,
    headerCollapsed,
    setHeaderCollapsed,
    showingMore,
    setShowingMore,
    NestedWrapper,
  }) => {
    const keyArray = orderBy(Object.keys(hash), [key => key], ['asc']);
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
              isCollapsed={get(headerCollapsed, key, true)}
              setCollapsed={() =>
                setHeaderCollapsed({
                  ...headerCollapsed,
                  [key]: !get(headerCollapsed, key, true),
                })}
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
