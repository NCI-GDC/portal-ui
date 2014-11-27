module ngApp.components.location.services {

  export interface ISearch {
    filters: string;
    query: string;
  }

  export interface ILocationService {
    path(): string;
    clear(): ng.ILocationService;
    search(): ISearch;
    filters(): string;
    setFilters(filters: Object): ng.ILocationService;
    query(): string;
    setQuery(query: Object): ng.ILocationService;
  }

  class LocationService implements ILocationService {
    /* @ngInject */
    constructor(private $rootScope: ng.IRootScopeService, private $location: ng.ILocationService) {
      var cachedFilters: any = {};
      var validSwitches = [
        "search",
        "query"
      ];

      $rootScope.$on("$stateChangeStart", (event: any, toState: any, toParams: any, fromState: any, fromParams: any) => {
        var toStateRoot = toState.name.substr(0, toState.name.indexOf("."));
        var fromStateRoot = fromState.name.substr(0, fromState.name.indexOf("."));

        if (validSwitches.indexOf(toStateRoot) !== -1 && validSwitches.indexOf(fromStateRoot) !== -1) {
          if (toState.name.match("query.") && fromState.name.match("search.")) {
            cachedFilters = this.filters();
            var query = "";

            _.each(cachedFilters.content, (facet, index: number) => {
              query += facet.content.field.toUpperCase() + " IS ";

              _.each(facet.content.value, (value: string, index: number) => {
                query += value;

                if (index !== (facet.content.value.length - 1)) {
                  query += " OR ";
                }
              });

              if (index !== (cachedFilters.content.length - 1)) {
                query += " AND ";
              }
            });

            cachedFilters = query;
          } else if (toState.name.match("query.") && fromState.name.match("query.")) {
            cachedFilters = this.query();
          } else if (toState.name.match("search.") && fromState.name.match("search.")) {
            cachedFilters = this.filters();
          }
        }
      });

      $rootScope.$on("$stateChangeSuccess", (event: any, toState: any, toParams: any, fromState: any, fromParams: any) => {
        var toStateRoot = toState.name.substr(0, toState.name.indexOf("."));
        var fromStateRoot = fromState.name.substr(0, fromState.name.indexOf("."));

        if (validSwitches.indexOf(toStateRoot) !== -1 && validSwitches.indexOf(fromStateRoot) !== -1) {
          if ((toState.name.match("query.") && fromState.name.match("search.")) ||
              (toState.name.match("query.") && fromState.name.match("query."))) {
            this.setQuery(cachedFilters);
          } else if (toState.name.match("search.") && fromState.name.match("search.")) {
            this.setFilters(cachedFilters);
          }
        }
      });
    }

    path(): string {
      return this.$location.path();
    }

    search(): ISearch {
      return this.$location.search();
    }

    setSearch(search): ng.ILocationService {
      if (!_.keys(search).length) {
        search = "";
      }

      var propsWithValues = _.find(search, function(val) {

        if (typeof val === "object" || val === "{}") {
          return false;
        }

        return val;
      });

      if (!propsWithValues) {
        search = "";
      }

      return this.$location.search(search);
    }

    clear(): ng.ILocationService {
      return this.$location.search({});
    }

    filters(): string {
      // TODO error handling
      var f = this.search()["filters"];
      return f ? angular.fromJson(f) : {};
    }

    setFilters(filters: Object): ng.ILocationService {
      var search: ISearch = this.search();
      if (filters) {
        search.filters = angular.toJson(filters);
      } else {
        delete search.filters;
      }
      return this.setSearch(search);
    }

    query(): string {
      // TODO error handling
      var f = this.search()["query"];
      return f ? angular.fromJson(f) : {};
    }

    setQuery(query: Object): ng.ILocationService {
      var search: ISearch = this.search();
      if (query) {
        search.query = angular.toJson(query);
      } else {
        delete search.query;
      }
      return this.setSearch(search);
    }
  }

  angular
      .module("location.services", [])
      .service("LocationService", LocationService);
}
