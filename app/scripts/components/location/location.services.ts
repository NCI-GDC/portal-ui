module ngApp.components.location.services {

  import IGDCWindowService = ngApp.core.models.IGDCWindowService;

  export interface ISearch {
    filters: string;
    query: string;
    pagination: any;
  }

  export interface IFilters {
    op: string;
  }

  export interface ILocationService {
    path(): string;
    clear(): ng.ILocationService;
    search(): ISearch;
    setSearch(search: any): ng.ILocationService;
    filters(): any;
    setFilters(filters: Object): ng.ILocationService;
    query(): string;
    setQuery(query?: string): ng.ILocationService;
    pagination(): any;
    setPaging(pagination: any): ng.ILocationService;
    setHref(href: string): void;
    getHref(): string;
    filter2query(f: any): string;
  }

  class LocationService implements ILocationService {
    /* @ngInject */
    constructor(private $location: ng.ILocationService, private $window: IGDCWindowService) {}

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

      if (propsWithValues !== undefined && !propsWithValues) {
        search = "";
      }

      return this.$location.search(search);
    }

    clear(): ng.ILocationService {
      return this.$location.search({});
    }

    filters(): any {
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
      var q = this.search()["query"];
      return q ? q : "";
    }

    setQuery(query?: string): ng.ILocationService {
      var search: ISearch = this.search();
      if (query) {
        search.query = query;
      } else {
        delete search.query;
      }
      return this.setSearch(search);
    }

    pagination(): any {
      var f = this.search()["pagination"];
      return f ? angular.fromJson(f) : {};
    }

    setPaging(pagination: any): ng.ILocationService {
      var search: ISearch = this.search();
      if (pagination) {
        search.pagination = angular.toJson(pagination);
      } else if (_.isEmpty(search.pagination)) {
        delete search.pagination;
      }

      return this.setSearch(search);
    }

    setHref(href: string): void {
      this.$window.location.href = href;
    }

    getHref(): string {
      return this.$window.location.href;
    }

    filter2query(f): string {
      var q = _.map(f.content, (ftr) => {
        var c = ftr.content;
        var t = " in " + angular.toJson(c.value);
        return c.field + t;
      });

      return q.join(" and ");
    }


  }

  angular
      .module("location.services", [])
      .service("LocationService", LocationService);
}
