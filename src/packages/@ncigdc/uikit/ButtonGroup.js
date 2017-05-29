// @flow

// Vendor
import React, { Children, cloneElement } from "react";
import StyleBuilder from "style-builder";

// Custom
import { Row } from "./Flex";

/*----------------------------------------------------------------------------*/

const ButtonGroup = ({ style, children, ...props }) => (
  <Row style={style} {...props}>
    {Children.map(children, (child, i) =>
      cloneElement(child, {
        ...child.props,
        style: StyleBuilder.build({
          ...(child.props || {}).style,
          // shouldn't have newlines
          borderRadius: `${!i ? "4px" : "0px"} ` +
            `${i === children.length - 1 ? "4px" : "0px"} ` +
            `${i === children.length - 1 ? "4px" : "0px"} ` +
            `${!i ? "4px" : "0px"}`,
          ...(i ? { borderLeft: "none" } : {}),
          display: "inline"
        })
      })
    )}
  </Row>
);

/*----------------------------------------------------------------------------*/

export default ButtonGroup;
