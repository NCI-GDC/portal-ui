module ngApp.home.controllers {
  import ICoreService = ngApp.core.services.ICoreService;

  export interface IHomeController {
  }

  class HomeController implements IHomeController {
    /* @ngInject */
    constructor(private CoreService: ICoreService) {
      CoreService.setPageTitle("Welcome");
    }
  }

  angular
      .module("home.controller", [
        "core.services"
      ])
      .controller("HomeController", HomeController);
}
