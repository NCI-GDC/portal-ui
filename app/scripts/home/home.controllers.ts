module ngApp.home.controllers {
  export interface IHomeController {
  }

  class HomeController implements IHomeController {
    /* @ngInject */
    constructor(private CoreService: ICoreService) {
      CoreService.setPageTitle("Welcome");
    }
  }

  angular
      .module("home.controller", [])
      .controller("HomeController", HomeController);
}
