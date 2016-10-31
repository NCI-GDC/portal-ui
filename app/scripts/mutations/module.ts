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
      resolve: {
        mutation: ($stateParams: ng.ui.IStateParamsService, $http: ng.IHttpService): Object => {
          const hit = $http({
            method: 'POST',
            url: `${config.es_host}/gdc-r1-ssm-centric/ssm-centric/_search`,
            headers: {'Content-Type' : 'application/json'},
            data: {
              "query": {
                "term": {
                  "ssm_id": {
                    "value": $stateParams.mutationId
                  }
                }
              }
            }
          }).then(data => {
            return data.data.hits.hits[0]._source || {};
          }, response => {
            console.log(`error getting mutation ${JSON.stringify(response)}`);
          });
          if (!$stateParams.mutationId) {
            throw Error('Missing route parameter: mutationId. Redirecting to 404 page.');
          }
          return hit;
        }
      }
    });
  }

  angular
      .module("ngApp.mutations", [
        "mutations.controller",
        "ui.router.state"
      ])
      .config(mutationsConfig);
}
