module ngApp.home.controllers {
  import ICoreService = ngApp.core.services.ICoreService;

  export interface IHomeController {
  }

  class HomeController implements IHomeController {
    /* @ngInject */
    constructor(private CoreService: ICoreService, $scope: ng.IScope) {
      CoreService.setPageTitle("Welcome");
      $scope.chartData = [{
                          key: 'awesomeness',
                          value: 100
                          }];
      $scope.chartConfig = {
              legend: {
              awesomeness: 'awesomeness'
            }
          };
    }
  }

  angular
      .module("home.controller", [])
      .controller("HomeController", HomeController);
}
