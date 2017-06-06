// @flow
import React from "react";
import { Tooltip } from "@ncigdc/uikit/Tooltip";

const bubbleStyle = {
  color: "white",
  padding: "2px 5px",
  borderRadius: "8px",
  fontSize: "10px",
  fontWeight: "bold",
  display: "inline-block",
};

type TProps = {
  text: string,
  toolTipText: string,
  backgroundColor: string,
};

export default ({ text, toolTipText, backgroundColor }: TProps) => (
  <Tooltip Component={toolTipText}>
    <span
      style={{
        ...bubbleStyle,
        backgroundColor,
      }}
    >
      {text}
    </span>
  </Tooltip>
);
