module ngApp.reports.controllers {
  import ICoreService = ngApp.core.services.ICoreService;

  export interface IReportsController {
  }

  class ReportsController implements IReportsController {
    /* @ngInject */
    constructor(private CoreService: ICoreService) {
      CoreService.setPageTitle("Reports");
    }
  }

  angular
      .module("reports.controller", [])
      .controller("ReportsController", ReportsController);
}
