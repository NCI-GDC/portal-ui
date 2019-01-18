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

const FacetWrapperDiv = styled.div({
  position: 'relative',
  paddingLeft: '10px',
});
export const NestedWrapper = ({
  Component,
  title,
  isCollapsed,
  setCollapsed,
}) => (
  <FacetWrapperDiv key={title + 'div'}>
    <FacetHeader
      title={title}
      collapsed={isCollapsed}
      setCollapsed={setCollapsed}
      key={title}
    />
    {isCollapsed || Component}
  </FacetWrapperDiv>
);
const RecursiveToggledFacet = compose(
  withState('headerCollapsed', 'setHeaderCollapsed', {})
)(
  class RecursiveToggledFacet extends React.Component {
    constructor() {
      super();
    }
    render() {
      const {
        hash,
        Component,
        headerCollapsed,
        setHeaderCollapsed,
      } = this.props;
      if (!hash || Object.keys(hash) === 0) {
        return '';
      }
      if (Object.keys(hash).includes('description')) {
        console.log('primary site', hash);
        return Component(hash);
      }

      return Object.keys(hash).map(key => {
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
      });
    }
  }
);

export default RecursiveToggledFacet;
