module ngApp.search.directives {
  import ILocationService = ngApp.components.location.services.ILocationService;

  /* @ngInject */
  function AdvancedQuery($state: ng.ui.IStateService, LocationService: ILocationService): ng.IDirective {
    return {
      restrict: "A",
      link: function($scope: ng.IScope, elem: ng.IAugmentedJQuery) {
        elem.bind("click", (event: any) => {
          var filters = LocationService.filters();
          var query = "";

          _.each(filters.content, (facet, index: number) => {
            query += facet.content.field.toUpperCase() + " IS ";

            _.each(facet.content.value, (value: string, index: number) => {
              query += value;

              if (index !== (facet.content.value.length - 1)) {
                query += " OR ";
              }
            });

            if (index !== (filters.content.length - 1)) {
              query += " AND ";
            }
          });

          var stateParams = {};

          if (query) {
            stateParams = {
              query: angular.toJson(query)
            };
          }

          $state.go("query.files", stateParams, { inherit: true });
        });
      }
    };
  }

  angular.module("search.directives", ["location.services"])
      .directive("advancedQuery", AdvancedQuery);
}

