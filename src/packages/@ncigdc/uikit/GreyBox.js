// @flow
import React from "react";
import styled from "@ncigdc/theme/styled";

const Box = styled.span({
  backgroundColor: ({ theme }) => theme.greyScale4,
  width: "10px",
  height: "20px",
});

const GreyBox = () => <Box />;

export default GreyBox;
