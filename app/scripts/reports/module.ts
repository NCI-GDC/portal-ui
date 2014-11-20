module ngApp.reports {
  "use strict";
  import IReportsService = ngApp.reports.services.IReportsService;
  import IReport = ngApp.reports.models.IReport;

  /* @ngInject */
  function reportsConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("report", {
      url: "/reports/:reportId",
      controller: "ReportController as rc",
      templateUrl: "reports/templates/report.html",
      resolve: {
        report: ($stateParams: ng.ui.IStateParamsService, ReportsService: IReportsService): ng.IPromise<IReport> => {
          return ReportsService.getReport($stateParams["reportId"]);
        }
      }
    });

    $stateProvider.state("reports", {
      url: "/reports",
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
