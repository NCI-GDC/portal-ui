module ngApp.components.ui.search.controllers {
  import ILocationService = ngApp.components.location.services.ILocationService;

  interface ISearchBarController {
    gql: any;
    query: string;
    setQuery(): void;
    sendQuery(): void;
    resetQuery(): void;
  }

  class SearchBarController implements ISearchBarController {
    gql: any = null;
    query: string = "";

    /* @ngInject */
    constructor(private $scope: ng.IScope, private LocationService: ILocationService,
                private $state: ng.ui.IStateService) {

      $scope.$watch("query", () => {
        if (!this.query) {
          this.LocationService.setQuery();
        }
      });
      this.setQuery();
    }

    sendQuery() {
      this.LocationService.setSearch({
        query: this.query,
        filters: angular.toJson(this.gql.filters)
      });
    }

    setQuery() {
      var currentQuery = this.LocationService.query();

      if (typeof currentQuery === "string") {
        this.query = currentQuery;
      }
    }

    resetQuery() {
      this.LocationService.clear();
      this.query = "";
      this.gql = null;
    }
  }

  angular.module("ui.search.controllers", [])
      .controller("SearchBarController", SearchBarController);
}
