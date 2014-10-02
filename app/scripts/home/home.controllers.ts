module ngApp.home.controllers {
  export interface IHomeController {}

  class HomeController implements IHomeController {}

  angular
      .module("home.controller", [])
      .controller("HomeController", HomeController);
}
