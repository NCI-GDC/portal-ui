module ngApp.components.location.services {

  export interface ISearch {
    filters: string;
  }

  export interface ILocationService {
    path(): string;
    clear(): ng.ILocationService;
    search(): ISearch;
    filters(): string;
    setFilters(filters: Object): ng.ILocationService;
  }

  class LocationService implements ILocationService {
    /* @ngInject */
    constructor(private $location: ng.ILocationService) {
    }

    path(): string {
      return this.$location.path();
    }

    search(): ISearch {
      return this.$location.search();
    }

    setSearch(search: ISearch): ng.ILocationService {
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
  }

  angular
      .module("location.services", [])
      .service("LocationService", LocationService);
}
