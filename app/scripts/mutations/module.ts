module ngApp.mutations {

  "use strict";

  import IGDCConfig = ngApp.IGDCConfig;
  /* ngInject */
  function mutationsConfig(
    $stateProvider: ng.ui.IStateProvider,
    $urlRouterProvider: ng.ui.IUrlRouterProvider,
    config: IGDCConfig
  ) {
    $stateProvider.state("mutation", {
      url: "/mutations/:mutationId",
      controller: "MutationController as mc",
      templateUrl: "mutations/templates/mutation.html",
    });
  }

  angular
      .module("ngApp.mutations", [
        "mutations.controller",
        "ui.router.state"
      ])
      .config(mutationsConfig);
}
