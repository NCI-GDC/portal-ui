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
    autoComplete(entity: string, query: string, field: string): ng.IPromise<any>;
    ensurePath(filters: IFilters): IFilters;
    filterFacets(facets: Object[]): string[];
  }

  class FacetService implements IFacetService {
    private FilterFactory: Object;

    /* @ngInject */
    constructor(private LocationService: ILocationService, private Restangular: restangular.IService,
                private UserService: IUserService, private $q: ng.IQService) {
      // For filters that take two parameters: facet & value
      this.FilterFactory = {
        is: _.partial(this.createFilter, 'is'),
        '<=': _.partial(this.createFilter, '<='),
        '>=': _.partial(this.createFilter, '>='),
        in: (facet, value) => ({
          op: 'in',
          content: {
            field: facet,
            value: [].concat(value)
          }
        })
      };
    }

    autoComplete(entity: string, query: string, field: string): ng.IPromise<any> {
      var projectsKeys = {
        "files": "cases.project.project_id",
        "cases": "project.project_id",
        "projects": "project_id"
      };

      var options: any = {
        query: query
      };

      var filters = this.ensurePath(this.LocationService.filters());
      filters.content = filters.content.filter((f) => ! this.sameFacet (f, field));

      if (filters.content.length > 0) {
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

    // find out how many operators we're supporting.
    createFilter = (op, facet, value) => ({
      op: op,
      content: {
        field: facet,
        value: value
      }
    })

    OrFilter = (filters = []) => ({
      op: 'or',
      content: filters
    })

    AndFilter = (filters = []) => ({
      op: 'and',
      content: filters
    })

    sameFacet = (filter: Object, name: string): boolean => {
      const content = filter.content;

      return _.isArray(content) ?
        this.sameFacet(content [0], name) :
        content.field === name;
    }

    facetOpValueMap = (facet: string): Object => {
      const filters = this.ensurePath(this.LocationService.filters());
      // There should be only one match per facet.
      const match = filters.content.filter(f => this.sameFacet(f, facet))[0];

      if (! match) {
        return {};
      }

      const content = match.content || {};

      if (_.isArray(content)) {
        return content.reduce((acc, n) => {
          acc[n.op] = (acc[n.op] || []).concat(n.content.value);
          return acc;
        }, {});
      }

      const result = {};
      result[match.op] = [].concat(content.value || []);
      return result;
    }

    isFacetActive = (facet: string = ''): boolean => {
      const filters = this.ensurePath(this.LocationService.filters()).content;

      return filters.some(f =>
        facet === _.get(f, (_.isArray(f.content) ? 'content[0].' : '') + 'content.field', undefined));
    }

    getActives = (facet: string, terms: any[] = []): any[] => {
      const values = this.getActiveIDs(facet);

      return terms.filter(t =>
        values.some(v => (t.key === v) || (t.key === '_missing' && v === 'MISSING')));
    }

    getActiveIDs = (facet: string): string[] => _.unique(_.flatten(_.values(
      this.facetOpValueMap(facet))));

    ensurePath(filters: IFilters): IFilters {
      return filters.content ? filters : this.AndFilter();
    }

    addTerm = (facet: string, term: string, op: string = 'in'): void => {
      const makeFilter = this.FilterFactory[op];
      // Unsupported operator
      if (! makeFilter) {
        return;
      }

      const filters = this.ensurePath(this.LocationService.filters()).content;

      const partitioned = _.partition(filters, (f) => this.sameFacet (f, facet));
      // Consider the first match only - there should be only one.
      const match = partitioned[0][0];
      const rest = partitioned[1];
      const newbie = makeFilter(facet, term);

      const newFilters = match ?
        [].concat(this.mergeFilters(match, newbie), rest) :
        filters.concat(newbie);

      this.LocationService.setFilters(this.AndFilter(newFilters));
    }

    mergeFilters = (oldie, newbie) =>
      (_.isArray(oldie.content) ? this.combineFilters : this.combineSimpleFilters) (oldie, newbie);

    combineSimpleFilters = (oldie = {}, newbie = {}) => {
      return [oldie, newbie].some(f => f.op !== 'in') ?
        this.OrFilter([oldie, newbie]) :
        this.FilterFactory.in(oldie.content.field, _.unique(oldie.content.value.concat(newbie.content.value)));
    }

    combineFilters = (oldie = {}, newbie = {}) => {
      const siblings = oldie.content;

      if (newbie.op !== 'in') {
        return this.OrFilter(siblings.concat(newbie));
      }

      const partitioned = _.partition(siblings, (f) => f.op === 'in');
      // Consider the first match only - there should be only one.
      const match = partitioned[0][0];
      const rest = partitioned[1];

      return this.OrFilter([]
        .concat(rest)
        .concat(match ? this.combineSimpleFilters(match, newbie) : newbie));
    }

    removeTerm = (facet: string, term: string, op: string = 'in'): void => {
      const makeFilter = this.FilterFactory[op];
      // Unsupported operator
      if (! makeFilter) {
        return;
      }

      const filters = this.ensurePath(this.LocationService.filters()).content;

      const partitioned = _.partition(filters, (f) => this.sameFacet(f, facet));
      const matches = partitioned[0];

      if (matches.length) {
        const rest = partitioned[1];
        const baddie = makeFilter(facet, term);
        const newFilters = rest.concat(matches
          .map(m => this.deleteFilter(m, baddie))
          .filter(f => f !== null)
        );

        this.LocationService.setFilters(newFilters.length ? this.AndFilter(newFilters) : '');
      }
    }

    deleteFilter = (oldie, baddie) =>
      (_.isArray(oldie.content) ? this.removeFilter : this.removeSimpleFilter) (oldie, baddie);

    removeSimpleFilter = (oldie = {}, baddie = {}) => {
      if (oldie.op === baddie.op && oldie.content.field === baddie.content.field) {
        if (baddie.op === 'in') {
          const rest = oldie.content.value
            .filter(v => ! _.includes(baddie.content.value, v));

          return rest.length ?
            this.FilterFactory.in(oldie.content.field, rest) :
            null;
        } else {
          // Single-value operation
          return (oldie.content.value === baddie.content.value) ? null : oldie;
        }
      }

      return oldie;
    }

    removeFilter = (oldie = {}, baddie = {}) => {
      const rest = oldie.content
        .map(f => this.removeSimpleFilter(f, baddie))
        .filter(f => f !== null);

      const count = rest.length;

      if (count < 1) {
        return null;
      } else if (count === 1) {
        return rest[0];
      } else {
        return this.OrFilter(rest);
      }
    }

    removeFacet = (facet: string): void => {
      const filters = this.ensurePath(this.LocationService.filters()).content;
      const rest = filters.filter((f) => ! this.sameFacet (f, facet));

      this.LocationService.setFilters(rest.length ? this.AndFilter(rest) : '');
    }

    removeOp = (facet: string, op: string): void => {
      const filters = this.ensurePath(this.LocationService.filters()).content;
      const partitioned = _.partition(filters, (f) => this.sameFacet(f, facet));
      const matches = partitioned[0];

      if (matches.length) {
        const newFilters = partitioned[1].concat(matches
          .map(m => this.deleteFilterOp(m, op))
          .filter(f => f !== null)
        );

        this.LocationService.setFilters(newFilters.length ? this.AndFilter(newFilters) : '');
      }
    }

    deleteFilterOp = (filter, op: string) =>
      (_.isArray(filter.content) ? this.removeFilterOp : this.removeSimpleFilterOp) (filter, op);

    removeSimpleFilterOp = (filter, op: string) => (filter.op === op) ? null : filter;

    removeFilterOp = (filter, op: string) => {
      const rest = filter.content
        .map(f => this.removeSimpleFilterOp(f, op))
        .filter(f => f !== null);

      const count = rest.length;

      if (count < 1) {
        return null;
      } else if (count === 1) {
        return rest[0];
      } else {
        return this.OrFilter(rest);
      }
    }

    filterFacets = (facets: Object[] = []): string[] => facets
      .filter(f => _.includes(['terms', 'range'], f.facetType))
      .map(f => f.name);
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
               !_.includes(datum.field, "_id") &&
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
      this.fieldsMap[docType].unshift({
          name: fieldName,
          title: fieldName,
          collapsed: false,
          facetType: fieldType === 'long' ? 'range' : _.includes(fieldName, 'datetime') ? 'datetime' : 'terms',
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
