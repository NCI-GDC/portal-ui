/* @flow */
import React from "react";
import styled from "@ncigdc/theme/styled";
import { withTheme } from "@ncigdc/theme";

type TNoResultsProps = {
  children: any,
  style: any
};

const NoResultsMessage = withTheme(
  ({ children, style, theme }: TNoResultsProps) => (
    <span
      style={Object.assign({ padding: 10, color: theme.greyScale3 }, style)}
    >
      {children || "No results found"}
    </span>
  )
);

export default NoResultsMessage;
