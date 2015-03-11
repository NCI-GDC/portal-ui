module ngApp.reports {
  "use strict";
  import IReportsService = ngApp.reports.services.IReportsService;
  import IReport = ngApp.reports.models.IReport;

  /* @ngInject */
  function reportsConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("reports", {
      url: "/reports/data-download-statistics",
      controller: "ReportsController as rsc",
      templateUrl: "reports/templates/reports.html",
      resolve: {
        reports: (ReportsService: IReportsService) => {
          return ReportsService.getReports();
        }
      }
    });
  }

  angular
      .module("ngApp.reports", [
        "reports.controller",
        "ui.router.state"
      ])
      .config(reportsConfig);
}