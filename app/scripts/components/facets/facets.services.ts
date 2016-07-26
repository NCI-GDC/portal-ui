module ngApp.components.facets.services {

  import ILocationService = ngApp.components.location.services.ILocationService;
  import ILocalStorageService = ngApp.core.services.ILocalStorageService;
  import ISearch = ngApp.components.location.services.ISearch;
  import ICartService = ngApp.cart.services.ICartService;
  import IUserService = ngApp.components.user.services.IUserService;
  import IFilters = ngApp.components.location.IFilters;
  import IFilesService = ngApp.files.services.IFilesService;
  import IParticipantsService = ngApp.participants.services.IParticipantsService;

  export interface IFacetService {
    addTerm(facet: string, term: string, op?:string): void;
    removeTerm(facet: string, term: string, op?: string): void;
    getActives(facet: string, terms: any[]): string[];
    getActiveIDs(facet: string): string[];
    getActivesWithOperator(facet: string): any;
    getActivesWithOperator(facet: string): any;
    autoComplete(entity: string, query: string, field: string): ng.IPromise<any>;
    ensurePath(filters: IFilters): IFilters;
    filterFacets(facets: Object[]): string[];
  }

  class FacetService implements IFacetService {
    /* @ngInject */
    constructor(private LocationService: ILocationService, private Restangular: restangular.IService,
                private UserService: IUserService, private $q: ng.IQService) {}

    autoComplete(entity: string, query: string, field: string): ng.IPromise<any> {
      var projectsKeys = {
        "files": "cases.project.project_id",
        "cases": "project.project_id",
        "projects": "project_id"
      };

      var options: any = {
        query: query
      };

      var filters = this.LocationService.filters();
      _.remove(filters.content, (filter) => {
        return filter.content.field === field;
      });

      if (filters.content && filters.content.length > 0) {
        filters = this.UserService.addMyProjectsFilter(filters, projectsKeys[entity]);
        options.filters = filters;
      }

      return this.Restangular.all(entity + "/ids").get("", options).then((data) => {
        return data.data.hits.length ? data.data.hits : [{ warning: "No results found" }];
      });
    }

    searchAll(params: any): ng.IPromise<any> {
      if (params.hasOwnProperty("fields")) {
        params["fields"] = params["fields"].join();
      }

      if (params.hasOwnProperty("expand")) {
        params["expand"] = params["expand"].join();
      }

      var abort = this.$q.defer();
      var prom: ng.IPromise<any> = this.Restangular.all("all")
      .withHttpConfig({
        timeout: abort.promise
      })
      .get("", params).then((data) => {
        return data;
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

    ensurePath(filters: IFilters): IFilters {
      return filters.content ? filters : { op: "and", content: [] };
    }

    addTerm(facet: string, term: string, op: string = 'in') {
      var filters = this.ensurePath(this.LocationService.filters());

      // TODO - not like this
      var found = false;
      var cs = filters.content;

      for (var i = 0; i < cs.length; i++) {
        var c = cs[i].content;
        if (c.field === facet && cs[i].op === op) {
          found = true;
          if (c.value.indexOf(term) === -1) {
            c.value.push(term);
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

    removeTerm(facet: string, term: string, op: string) {
      var filters = this.ensurePath(this.LocationService.filters());
      var cs = filters["content"];
      for (var i = 0; i < cs.length; i++) {
        var c = cs[i]["content"];
        if (c["field"] === facet && (!op || cs[i]["op"] === op)) {
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
      if (_.get(filters, "content", []).length === 0) {
        this.LocationService.clear();
      } else {
        this.LocationService.setFilters(filters);
      }
    }

    filterFacets(facets: Object[]): string[] {
      return _.filter(facets || [],
        f => _.includes(['terms', 'range'], f.facetType))
      .map(f => f.name);
    }
  }

  export interface ICustomFacetsService {
    nonEmptyOnlyDisplayed: boolean;
    getFacetFields(docType: string): ng.IPromise<any>;
    getNonEmptyFacetFields(docType: string, fields: Array<Object>): ng.IPromise<any>;
    filterFields(docType: String, data: Object): Array<Object>;
  }

  class CustomFacetsService implements ICustomFacetsService {
    private ds: restangular.IElement;
    public nonEmptyOnlyDisplayed: boolean = false;

    /* @ngInject */
    constructor(private Restangular: restangular.IService,
                private SearchTableFilesModel: TableiciousConfig,
                private SearchCasesTableService: TableiciousConfig,
                private FilesService: IFilesService,
                private ParticipantsService: IParticipantsService,
                private LocationService: ILocationService,
                private FacetsConfigService: IFacetsConfigService) {
      this.ds = Restangular.all("gql/_mapping");
    }

    // getFacetFields and getNonEmptyFacetFields do not call this to keep the facet fields sent the same in
    // subsequent calls so Restangular/browser uses the cached version. Call this in the controller.
    filterFields(docType: String, data: Object): Array<Object> {
      var current = _.pluck(this.FacetsConfigService.fieldsMap[docType], "name");
      return _.map(_.filter(data, (datum) => {
        return datum.doc_type === docType &&
               datum.field !== 'archive.revision' &&
               !_.includes(current, datum.field) &&
               !_.includes(docType === 'files'
                ? _.pluck(this.SearchTableFilesModel.facets, "name")
                : _.pluck(this.SearchCasesTableService.model().facets, "name"), datum.field);
               }), f => f);
    }

    getFacetFields(docType: string): ng.IPromise<any> {
      return this.ds.getList().then((data) => data);
    }

    getNonEmptyFacetFields(docType: string, fields: Array<Object>): ng.IPromise<any> {
      var facets = fields.reduce((acc, f) => {
        if (f.doc_type === docType){
          acc.push(f.field);
        }
        return acc;
      }, []);
      var options = { facets: facets,
                      filters: this.LocationService.filters(),
                      size: 0
                    };
      var getNonEmpty = (data) => { return _.reduce(data.aggregations, (acc, agg, key) => {
        var field = _.find(fields, f => f.field === key);
        var filteredBuckets = _.reject(agg.buckets || [], b => b.key === '_missing');
          if (filteredBuckets.length !== 0) {
              acc = acc.concat(field);
          }
          if (agg.max) {
            acc = acc.concat(field);
          }
          return acc;
        }, []);
      };

      if (docType === 'files') {
        return this.FilesService.getFiles(options).then(data => getNonEmpty(data));
      } else if (docType === 'cases') {
        return this.ParticipantsService.getParticipants(options).then(data => getNonEmpty(data));
      }
    }
  }

  export interface IFacetsConfigService {
    addField(docType: string, fieldName: string, fieldType: string): void;
    removeField(docType: string, fieldName: string, fieldType: string): void;
    reset(docType: string): void;
    isDefault(docType: string): boolean;
    save(): void;
  }

  class FacetsConfigService implements IFacetsConfigService {
    public fieldsMap: any = {};
    defaultFieldsMap: any = {};
    FACET_CONFIG_KEY: string = "gdc-facet-config";

     /* @ngInject */
    constructor(private $window: ng.IWindowService,
                private LocalStorageService: ILocalStorageService) {}

    setFields(docType: string, fields: Array<Object>) {
      var saved = _.get(this.LocalStorageService.getItem(this.FACET_CONFIG_KEY), docType, null);

      if(!saved) {
        this.fieldsMap[docType] = fields;
        this.save();
      } else {
        this.fieldsMap[docType] = saved;
      }
      this.defaultFieldsMap[docType] = _.clone(fields, true);
    }

    addField(docType: string, fieldName: string, fieldType: string): void {
      var facetType = 'terms';
      if (_.includes(fieldName, 'datetime')) {
        facetType = 'datetime';
      } else if (_.some(['_id', '_uuid', 'md5sum', 'file_name'], a => _.includes(fieldName, a))) {
        facetType = 'id';
      } else if (fieldType === 'long') {
        facetType = 'range';
      }
      this.fieldsMap[docType].unshift({
          name: fieldName,
          title: fieldName,
          collapsed: false,
          facetType: facetType,
          removable: true
      });
      this.save();
    }

    removeField(docType: string, fieldName: string): void {
      this.fieldsMap[docType ]= _.reject(this.fieldsMap[docType], (facet) => {
        return facet.name === fieldName;
      });
      this.save();
    }

    reset(docType: string): void {
      this.fieldsMap[docType] = _.clone(this.defaultFieldsMap[docType], true);
      this.save();
    }

    isDefault(docType: string): boolean {
      return this.fieldsMap[docType].length === this.defaultFieldsMap[docType].length;
    }

    save(): void {
      this.LocalStorageService.setItem(this.FACET_CONFIG_KEY, this.fieldsMap);
    }

 }

  angular.
      module("facets.services", ["location.services", "restangular", "user.services", "ngApp.core"])
      .service("CustomFacetsService", CustomFacetsService)
      .service("FacetsConfigService", FacetsConfigService)
      .service("FacetService", FacetService);
}
