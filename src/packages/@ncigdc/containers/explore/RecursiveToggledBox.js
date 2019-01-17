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
const RecursiveToggledBox = compose(
  withState('headerCollapsed', 'setheaderCollapsed', {})
)(
  class RecursiveToggledBox extends React.Component {
    constructor() {
      super();
    }
    render() {
      const {
        hash,
        Component,
        headerCollapsed,
        setheaderCollapsed,
      } = this.props;
      if (!hash || Object.keys(hash) === 0) {
        return '';
      }
      if (Object.keys(hash).includes('description')) {
        return Component;
      }

      return Object.keys(hash).map(key => {
        return (
          <NestedWrapper
            key={key + 'nestedWrapper'}
            Component={
              <RecursiveToggledBox hash={hash[key]} Component={Component} />
            }
            title={key}
            isCollapsed={get(headerCollapsed, key, true)}
            setCollapsed={() =>
              setheaderCollapsed({
                ...headerCollapsed,
                [key]: !get(headerCollapsed, key, true),
              })}
          />
        );
      });
    }
  }
);

export default RecursiveToggledBox;
