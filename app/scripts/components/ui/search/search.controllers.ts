module ngApp.components.ui.search.controllers {
  import ILocationService = ngApp.components.location.services.ILocationService;

  interface ISearchBarController {
    query: string;
    isSearchQuery: boolean;
    setQuery(): void;
    sendQuery(): void;
    resetQuery(): void;
  }

  class SearchBarController implements ISearchBarController {
    query: string = "";
    isSearchQuery: boolean = false;

    /* @ngInject */
    constructor(private $scope: ng.IScope, private LocationService: ILocationService,
                private $state: ng.ui.IStateService) {
      this.isSearchQuery = !!$state.current.name.match("search.") ||
                           !!$state.current.name.match("query.");
      $scope.$watch("query", () => {
        if (!this.query) {
          this.LocationService.setQuery();
        }
      });
      this.setQuery();
    }

    sendQuery() {
      this.LocationService.setQuery(this.query);
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
    }
  }

  angular.module("ui.search.controllers", [])
      .controller("SearchBarController", SearchBarController);
}
