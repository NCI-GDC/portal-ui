module ngApp.components.facets.services {

  import ILocationService = ngApp.components.location.services.ILocationService;
  import ISearch = ngApp.components.location.services.ISearch;
  import ICartService = ngApp.cart.services.ICartService;

  export interface IFacetService {
    addTerm(facet: string, term: string): void;
    removeTerm(facet: string, term: string): void;
    getActives(facet: string, terms: any[]): string[];
    getActiveIDs(facet: string): string[];
    autoComplete(entity: string, query: string, field: string): ng.IPromise<any>;
  }

  class FacetService implements IFacetService {
    /* @ngInject */
    constructor(private LocationService: ILocationService, private Restangular: restangular.IService) {
    }

    autoComplete(entity: string, query: string, field: string): ng.IPromise<any> {
      return this.Restangular.all(entity + "/ids").get("", {
        query: query
      }).then((data) => {
        return data.data.hits;
      });
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

    ensurePath(filters: Object): Object {
      if (!filters.hasOwnProperty("content")) {
        filters = {op: "and", content: []};
      }
      return filters;
    }

    addTerm(facet: string, term: string) {
      var filters = this.ensurePath(this.LocationService.filters());
      // TODO - not like this
      var found = false;
      var cs = filters["content"];
      for (var i = 0; i < cs.length; i++) {
        var c = cs[i]["content"];
        if (c["field"] === facet) {
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
          op: "is",
          content: {
            field: facet,
            value: [term]
          }
        });
      }
      this.LocationService.setFilters(filters);
    }

    removeTerm(facet: string, term: string) {
      var filters = this.ensurePath(this.LocationService.filters());
      var cs = filters["content"];
      for (var i = 0; i < cs.length; i++) {
        var c = cs[i]["content"];
        if (c["field"] === facet) {
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
      module("facets.services", ["location.services", "restangular"])
      .service("FacetService", FacetService);
}
