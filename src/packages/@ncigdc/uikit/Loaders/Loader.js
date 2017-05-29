// @flow

import React from "react";
import Overlay from "@ncigdc/uikit/Overlay";
import Spinner from "./Material";

type TProps = {
  children?: mixed,
  loading: boolean,
  style?: Object,
  height?: string | number
};

export default (
  { children, style = {}, loading = true, height, ...props }: TProps = {}
) => (
  <div
    style={{ ...style, height: loading ? height || "1rem" : "auto" }}
    {...props}
  >
    <Overlay show={loading} style={{ position: "absolute", zIndex: 10 }}>
      <Spinner />
    </Overlay>
    {children}
  </div>
);
