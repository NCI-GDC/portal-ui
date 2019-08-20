// @flow

import React from 'react';

import Link from '@ncigdc/components/Links/Link';
import Undo from '@ncigdc/theme/icons/Undo';
import styled from '@ncigdc/theme/styled';
import withRouter from '@ncigdc/utils/withRouter';

import {
  removeFilter,
  fieldInCurrentFilters,
} from '@ncigdc/utils/filters/index';

const ShadowedUndoIcon = styled(Undo, {
  ':hover::before': {
    textShadow: ({ theme }) => theme.textShadow,
  },
});

const StyledLink = styled(Link, {
  ':link': {
    color: ({ theme }) => theme.greyScale3,
  },
  ':visited': {
    color: ({ theme }) => theme.greyScale3,
  },
});

const FacetResetButton = ({
  field,
  currentFilters,
  query,
  style,
  ...props
}) => {
  const newFilters = removeFilter(field, currentFilters);
  const newQuery = {
    ...query,
    offset: 0,
    filters: newFilters,
  };
  const inCurrent = fieldInCurrentFilters({
    currentFilters: currentFilters.content || [],
    field,
  });
  return (
    inCurrent && (
      <StyledLink
        className="test-facet-reset-button"
        style={{ display: inCurrent ? 'inline' : 'none', ...style }}
        query={newQuery}
        aria-label="reset"
      >
        <ShadowedUndoIcon />
      </StyledLink>
    )
  );
};

export default withRouter(FacetResetButton);
