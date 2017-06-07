// @flow

import React from "react";

import Link from "@ncigdc/components/Links/Link";
import UndoIcon from "@ncigdc/theme/icons/UndoIcon";
import Hidden from "@ncigdc/components/Hidden";
import styled from "@ncigdc/theme/styled";
import {
  removeFilter,
  fieldInCurrentFilters
} from "@ncigdc/utils/filters/index";

const ShadowedUndoIcon = styled(UndoIcon, {
  ":hover::before": {
    textShadow: ({ theme }) => theme.textShadow
  }
});

const StyledLink = styled(Link, {
  ":link": {
    color: ({ theme }) => theme.greyScale3
  },
  ":visited": {
    color: ({ theme }) => theme.greyScale3
  }
});

const FacetResetButton = ({ field, currentFilters, style, ...props }) => {
  const newFilters = removeFilter(field, currentFilters);
  const newQuery = newFilters
    ? {
        offset: 0,
        filters: newFilters
      }
    : {};
  const inCurrent = fieldInCurrentFilters({
    currentFilters: currentFilters.content || [],
    field
  });
  return (
    <StyledLink
      style={{ display: inCurrent ? "inline" : "none", ...style }}
      query={inCurrent ? newQuery : {}}
    >
      <ShadowedUndoIcon /><Hidden>reset</Hidden>
    </StyledLink>
  );
};

export default FacetResetButton;
