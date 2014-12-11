module ngApp.query {
  "use strict";

  /* @ngInject */
  function queryConfig($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
    $urlRouterProvider.when("/query", "/query/f");

    $stateProvider.state("query", {
      url: "/query?query&pagination",
      controller: "QueryController as qc",
      templateUrl: "query/templates/query.html",
      reloadOnQuery: false
    });

    $stateProvider.state("query.participants", {
      url: "/p",
      data: {
        tab: "participants"
      },
      reloadOnQuery: false
    });

    $stateProvider.state("query.files", {
      url: "/f",
      data: {
        tab: "files"
      },
      reloadOnQuery: false
    });

  }

  angular
      .module("ngApp.query", [
        "query.controller",
        "ui.router.state"
      ])
      .config(queryConfig);
}
