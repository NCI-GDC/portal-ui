module ngApp.reports {
  "use strict";

  /* @ngInject */
  function reportsConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("reports", {
      url: "/reports",
      controller: "ReportsController as rc",
      templateUrl: "reports/templates/reports.html"
    });
  }

  angular
      .module("ngApp.reports", [
        "reports.controller",
        "ui.router.state"
      ])
      .config(reportsConfig);
}
