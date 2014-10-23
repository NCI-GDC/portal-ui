declare module ngApp.components {}

angular
  .module("ngApp.components", [
    "components.header",
    "components.xmlviewer",
    "components.datefilter",
    "components.facets"
  ]);
