// @flow

import React from "react";

import Link from "@ncigdc/components/Links/Link";
import UndoIcon from "@ncigdc/theme/icons/UndoIcon";
import { getFilterValue } from "@ncigdc/utils/filters";
import Hidden from "@ncigdc/components/Hidden";
import styled from "@ncigdc/theme/styled";

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
  const currentValues = getFilterValue({
    currentFilters,
    dotField: field
  }) || { content: { value: [] } };
  const display = !!currentValues.content.value.length;
  return (
    <StyledLink
      merge="toggle"
      style={{ display: display ? "inline" : "none", ...style }}
      query={
        !!currentValues.content.value.length && {
          offset: 0,
          filters: {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field,
                  value: currentValues.content.value
                }
              }
            ]
          }
        }
      }
    >
      <ShadowedUndoIcon /><Hidden>reset</Hidden>
    </StyledLink>
  );
};

export default FacetResetButton;
