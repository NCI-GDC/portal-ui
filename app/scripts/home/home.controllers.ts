module ngApp.home.controllers {
  export interface IHomeController {
  }

  class HomeController implements IHomeController {
    /* @ngInject */
    constructor(private $rootScope: ngApp.IRootScope) {
      $rootScope.pageTitle = "Home";
    }
  }

  angular
      .module("home.controller", [
      ])
      .controller("HomeController", HomeController);
}
