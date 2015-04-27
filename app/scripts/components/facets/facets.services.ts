module ngApp.components.facets.services {

  import ILocationService = ngApp.components.location.services.ILocationService;
  import ISearch = ngApp.components.location.services.ISearch;
  import ICartService = ngApp.cart.services.ICartService;
  import IUserService = ngApp.components.user.services.IUserService;

  export interface IFacetService {
    addRange(facet: string, operator: string, term: string): void;
    addTerm(facet: string, term: string): void;
    removeTerm(facet: string, term: string): void;
    getActives(facet: string, terms: any[]): string[];
    getActiveIDs(facet: string): string[];
    getActivesWithOperator(facet: string): any;
    autoComplete(entity: string, query: string, field: string): ng.IPromise<any>;
  }

  class FacetService implements IFacetService {
    /* @ngInject */
    constructor(private LocationService: ILocationService, private Restangular: restangular.IService,
                private UserService: IUserService, private $q: ng.IQService) {}

    autoComplete(entity: string, query: string, field: string): ng.IPromise<any> {
      var projectsKeys = {
        "files": "participants.project.project_id",
        "participants": "project.project_id",
        "projects": "project_id"
      };
      var options = {
        query: query
      };

      var filters = this.LocationService.filters();
      _.remove(filters.content, (filter) => {
        return filter.content.field === field;
      });

      if (filters.content) {
        filters = this.UserService.addMyProjectsFilter(filters, projectsKeys[entity]);
        options.filters = filters;
      }

      return this.Restangular.all(entity + "/ids").get("", options).then((data) => {
        return data.data.hits;
      });
    }

    searchAll(query: string): ng.IPromise<any> {
      var abort = this.$q.defer();
      var prom: ng.IPromise<any> = this.Restangular.all("all")
      .withHttpConfig({
        timeout: abort.promise
      })
      .get("", {
        query: query
      }).then((data) => {
        return data.data.hits;
      });

      return prom;
    }

    getActives(facet: string, terms: any[]): string[] {
      var filters = this.ensurePath(this.LocationService.filters());
      var xs = [];
      var cs = filters["content"];
      for (var i = 0; i < filters["content"].length; i++) {
        var c = cs[i]["content"];
        if (facet === c["field"]) {
          c["value"].forEach((v) => {
            terms.forEach((t) => {
              if (t.key === v) {
                xs.push(t);
              }
            });
          });
          break;
        }
      }
      return xs;
    }

    getActiveIDs(facet: string): string[] {
      var filters = this.ensurePath(this.LocationService.filters());
      var xs = [];
      var cs = filters["content"];
      for (var i = 0; i < filters["content"].length; i++) {
        var c = cs[i]["content"];
        if (facet === c["field"]) {
          c["value"].forEach((v) => {
            xs.push(v);
          });
          break;
        }
      }
      return xs;
    }

    getActivesWithOperator(facet: string): Object {
      var filters = this.ensurePath(this.LocationService.filters());
      var xs = {};
      var cs = filters["content"];
      for (var i = 0; i < filters["content"].length; i++) {
        var c = cs[i]["content"];
        if (facet === c["field"]) {
          c["value"].forEach((v) => {
            xs[cs[i]["op"]] = v;
          });
        }
      }
      return xs;
    }

    getActivesWithValue(facet: string): any {
      var filters = this.ensurePath(this.LocationService.filters());
      var xs = {};
      var cs = filters["content"];
      for (var i = 0; i < filters["content"].length; i++) {
        var c = cs[i]["content"];
        if (facet === c["field"]) {
          c["value"].forEach((v) => {
            xs[facet] = v;
          });
        }
      }
      return xs;
    }

    ensurePath(filters: Object): Object {
      if (!filters.hasOwnProperty("content")) {
        filters = {op: "and", content: []};
      }
      return filters;
    }

    addTerm(facet: string, term: string, op: string = 'in') {
      var filters = this.ensurePath(this.LocationService.filters());
      // TODO - not like this
      var found = false;
      var cs = filters["content"];
      for (var i = 0; i < cs.length; i++) {
        var c = cs[i]["content"];
        if (c["field"] === facet && cs[i]["op"] === op) {
          found = true;
          if (c["value"].indexOf(term) === -1) {
            c["value"].push(term);
          } else {
            return;
          }
          break;
        }
      }
      if (!found) {
        cs.push({
          op: op,
          content: {
            field: facet,
            value: [term]
          }
        });
      }
      this.LocationService.setFilters(filters);
    }

    removeTerm(facet: string, term: string, op: string = 'in') {
      var filters = this.ensurePath(this.LocationService.filters());
      var cs = filters["content"];
      for (var i = 0; i < cs.length; i++) {
        var c = cs[i]["content"];
        if (c["field"] === facet && cs[i]["op"] === op) {
          if (!term) {
            cs.splice(i, 1);
          } else {
            var vs = c["value"];
            vs.splice(vs.indexOf(term), 1);
            if (vs.length === 0) {
              cs.splice(i, 1);
            }
          }

          if (cs.length === 0) {
            filters = null;
          }

          break;
        }
      }
      this.LocationService.setFilters(filters);
    }
  }
  angular.
      module("facets.services", ["location.services", "restangular", "user.services"])
      .service("FacetService", FacetService);
}
