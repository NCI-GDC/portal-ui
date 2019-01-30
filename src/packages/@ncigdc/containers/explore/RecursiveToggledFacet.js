import React from 'react';
import { withTheme } from '@ncigdc/theme';
import { get } from 'lodash';
import {
  compose,
  withState,
  lifecycle,
  withProps,
  defaultProps,
  withHandlers,
} from 'recompose';
import styled from '@ncigdc/theme/styled';
import FacetHeader from '@ncigdc/components/Aggregations/FacetHeader';
import { Row, Column } from '@ncigdc/uikit/Flex';
import {
  ToggleMoreLink,
  BottomRow,
} from '@ncigdc/components/Aggregations/TermAggregation';

const FacetWrapperDiv = styled.div({
  position: 'relative',
});
export const NestedWrapper = ({
  Component,
  title,
  isCollapsed,
  setCollapsed,
  style,
  headerStyle,
  angleIconRight,
}) => (
  <FacetWrapperDiv key={title + 'div'} style={style}>
    <FacetHeader
      title={title}
      collapsed={isCollapsed}
      setCollapsed={setCollapsed}
      key={title}
      style={headerStyle}
      angleIconRight
    />
    {isCollapsed || Component}
  </FacetWrapperDiv>
);
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
              title={_.startCase(key)}
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
          <BottomRow>
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
