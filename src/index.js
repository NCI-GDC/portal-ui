/* @flow */

// import "babel-polyfill";

import React from "react";
import ReactDOM from "react-dom";

import { setTheme } from "@ncigdc/theme";

import Root from "./Root";
import registerServiceWorker from "./registerServiceWorker";

const regeneratorRuntime = require("babel-runtime/regenerator");

if (!regeneratorRuntime.default) {
  regeneratorRuntime.default = regeneratorRuntime;
}

setTheme("active");

ReactDOM.render(<Root />, document.getElementById("root"));
registerServiceWorker();
