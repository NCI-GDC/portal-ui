/// <reference path="header/module"/>
/// <reference path="xmlviewer/xmlviewer.directive.ts"/>
/// <reference path="facets/module"/>
/// <reference path="tables/module"/>
/// <reference path="ui/module"/>
/// <reference path="location/module"/>
/// <reference path="charts/chart.directives.ts"/>
/// <reference path="overrides/module"/>
/// <reference path="user/module"/>
/// <reference path="githut/module"/>
/// <reference path="gql/module"/>

declare module ngApp.components {
}

angular
    .module("ngApp.components", [
      "components.header",
      "components.xmlviewer",
      "components.facets",
      "components.tables",
      "components.ui",
      "components.location",
      "components.charts",
      "components.overrides",
      "components.user",
      "components.githut",
      "components.gql",
      "components.quickSearch",
      "components.summaryCard",
      "components.downloader",
      "components.clipboardButton"
    ]);
