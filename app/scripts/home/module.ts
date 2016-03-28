module ngApp.home {
  "use strict";

  /* @ngInject */
  function homeConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("home", {
      url: "/",
      controller: "HomeController as hc",
      templateUrl: "home/templates/home.html"
    });
  }

  angular
      .module("ngApp.home", [
        "home.services",
        "home.controller",
        "ui.router.state"
      ])
      .config(homeConfig);
}
