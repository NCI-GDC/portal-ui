module ngApp.home.services {

  import IProjects = ngApp.projects.models.IProjects;
  import ISearchService = ngApp.search.services.ISearchService;
  import ILocationService = ngApp.components.location.services.ILocationService;
  import IRootScope = ngApp.IRootScope;
  import IParticipants = ngApp.participants.IParticipant;
  import IFiles = ngApp.files.models.IFiles;

  import IReportsService = ngApp.reports.services.IReportsService;
  import IReports = ngApp.reports.models.IReports;

  export interface IHomeService {
    getProjects(params?: Object): ng.IPromise<IProjects>;
    getParticipants(params: Object = {}): ng.IPromise<IParticipants>;
    getFiles(params: Object = {}): ng.IPromise<IFiles>;
    getReports(params: Object = {}): ng.IPromise<IReports>;
    getSummary(): any;
  }

  class HomeService implements IHomeService {

    private projectsDataSource: restangular.IElement;
    private participantsDataSource: restangular.IElement;
    private filesDataStore: restangular.IElement;

    /* @ngInject */
    constructor(Restangular: restangular.IService, private ReportsService: IReportsService,  public SearchService: ISearchService, private LocationService: ILocationService,
                private $rootScope: IRootScope, private $q: ng.IQService) {
      this.projectsDataSource = Restangular.all("projects");
      this.participantsDataSource = Restangular.all("cases");
      this.filesDataStore = Restangular.all("files");
    }

    prepParams(params:Object = {}) {
      return _.extend({}, params, {
        fields: params.fields && params.fields.join(),
        expand: params.expand && params.expand.join(),
        facets: params.facets && params.facets.join(),
      })
    }

    getProjects(params:Object = {}):ng.IPromise<IProjects> {

      var params = this.prepParams(params);

      // Testing is expecting these values in URL, so this is needed.
      var paging = params.paging || {
        size: 20,
        from: 1
      };

      var defaults = {
        size: params.size || paging.size,
        from:  params.from || paging.from,
        sort: paging.sort || "summary.case_count:desc",
        filters: params.filters || this.LocationService.filters()
      };

      var abort = this.$q.defer();
      var prom:ng.IPromise<IProjects> = this.projectsDataSource.withHttpConfig({
          timeout: abort.promise
        })
        .get("", angular.extend(defaults, params)).then((response):IFiles => {
          return response["data"];
        });

      var eventCancel = this.$rootScope.$on("gdc-cancel-request", () => {
        abort.resolve();
        eventCancel();
      });

      return prom;
    }


    getParticipants(params: Object = {}): ng.IPromise<IParticipants> {

      var params = this.prepParams(params);

      // Testing is expecting these values in URL, so this is needed.
      var paging = params.paging || {
          size: 20,
          from: 1
        };

      var defaults = {
        size: paging.size,
        from: paging.from,
        sort: paging.sort || 'case_id:asc',
        filters: params.filters || this.LocationService.filters()
      };


      var abort = this.$q.defer();
      var prom: ng.IPromise<IParticipants> = this.participantsDataSource.withHttpConfig({
          timeout: abort.promise
        })
        .get("", angular.extend(defaults, params)).then((response): IParticipants => {
          return response["data"];
        });

      var eventCancel = this.$rootScope.$on("gdc-cancel-request", () => {
        abort.resolve();
        eventCancel();
      });

      return prom;
    }

    getFiles(params: Object = {}): ng.IPromise<IFiles> {

      var params = this.prepParams(params);

      // Testing is expecting these values in URL, so this is needed.
      var paging = params.paging || {
          size: 20,
          from: 1
        };

      var defaults = {
        size: paging.size,
        from: paging.from,
        sort: paging.sort || "file_name:asc",
        filters: params.filters || this.LocationService.filters()
      };

      var abort = this.$q.defer();
      var prom: ng.IPromise<IFiles> = this.filesDataStore.withHttpConfig({
          timeout: abort.promise
        })
        .get("", angular.extend(defaults, params)).then((response): IFiles => {
          return response["data"];
        });

      var eventCancel = this.$rootScope.$on("gdc-cancel-request", () => {
        abort.resolve();
        eventCancel();
      });

      return prom;
    }

    getReports(params: Object = {}): ng.IPromise<IReports> {

      var defaultOptions = {
        expand: [
        "data_access",
        "data_types",
        "tags",
        "countries",
        "data_formats",
        "experimental_strategies",
        "platforms",
        "user_access_types",
        "data_categories",
        "centers"
      ]},
      options = {};

      _.assign(options, defaultOptions, params);

      return this.ReportsService.getReports(options);
    }

    getSummary() {
      return this.SearchService.getSummary();
    }


  }

  angular
    .module("home.services", ["reports.services"])
    .service("HomeService", HomeService);
}
