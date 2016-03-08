module ngApp.home.controllers {
  import ICoreService = ngApp.core.services.ICoreService;



  export interface IHomeController {
    getFilteredChartData: any;
  }

  export interface IHomeScope extends ng.IScope {
  }

  class HomeController implements IHomeController {

    projectData: any[];

    /* @ngInject */
    constructor(private $scope: IHomeScope, private CoreService: ICoreService, private $filter: ng.ui.IFilterService) {
      CoreService.setPageTitle("Welcome to The Genomics Data Commons Data Portal");

      this.projectData = [
        {key: 'Ovary', value: {cases: 100, files: 1000}},
        {key: 'Breast', value: {cases: 12000, files: 100}},
        {key: 'Kidney', value: {cases: 72, files: 72}},
        {key: 'Pancreas', value: {cases: 10000, files: 72567}}
      ];
    }




    getFilteredChartData() {
      return this.projectData;
    }

    setChartDataFilter() {

    }

  }

  angular
      .module("home.controller", [])
      .controller("HomeController", HomeController);
}
