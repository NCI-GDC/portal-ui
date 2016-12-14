module ngApp.genes {
  "use strict";

  import IGDCConfig = ngApp.IGDCConfig;
  /* ngInject */
  function genesConfig(
    $stateProvider: ng.ui.IStateProvider,
    $urlRouterProvider: ng.ui.IUrlRouterProvider,
    config: IGDCConfig
  ) {
    $stateProvider.state("gene", {
      url: "/genes/:geneId",
      controller: "GeneController as gc",
      templateUrl: "genes/templates/gene.html",
    });
  }

  angular
      .module("ngApp.genes", [
        "genes.controller",
        "ui.router.state"
      ])
      .config(genesConfig);
}
