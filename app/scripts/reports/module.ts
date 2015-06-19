module ngApp.reports {
  "use strict";
  import IReportsService = ngApp.reports.services.IReportsService;
  import IReport = ngApp.reports.models.IReport;

  var reportServiceExpand = [
                "data_access",
                "data_subtypes",
                "tags",
                "countries",
                "data_formats",
                "experimental_strategies",
                "platforms",
                "user_access_types",
                "data_types",
                "centers"
              ];

  /* @ngInject */
  function reportsConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("reports", {
      url: "/reports/data-download-statistics",
      controller: "ReportsController as rsc",
      templateUrl: "reports/templates/reports.html",
      resolve: {
        reports: (ReportsService: IReportsService) => {
          return ReportsService.getReports({
            expand: reportServiceExpand
          });
        }
      }
    });
  }

  angular
      .module("ngApp.reports", [
        "reports.controller",
        "ui.router.state"
      ])
      .value("reportServiceExpand", reportServiceExpand)
      .config(reportsConfig);
}
