module ngApp.cases.services {
  import ICases = ngApp.cases.models.ICases;
  import ICoreService = ngApp.core.services.ICoreService;
  import ICase = ngApp.cases.models.ICase;
  import ILocationService = ngApp.components.location.services.ILocationService;
  import IUserService = ngApp.components.user.services.IUserService;
  import IRootScope = ngApp.IRootScope;

  export interface ICasesService {
    getCase(id: string, params: Object): ng.IPromise<ICase>;
    getCases(params?: Object, paginationKey?: string): ng.IPromise<ICases>;
  }

  class CasesService implements ICasesService {
    private ds: restangular.IElement;

    /* @ngInject */
    constructor(Restangular: restangular.IService, private LocationService: ILocationService,
                private UserService: IUserService, private CoreService: ICoreService,
                private $rootScope: IRootScope, private $q: ng.IQService) {
      this.ds = Restangular.all("cases");
    }

    getCase(id: string, params: Object = {}): ng.IPromise<ICase> {
      if (params.hasOwnProperty("fields")) {
        params["fields"] = params["fields"].join();
      }

      if (params.hasOwnProperty("expand")) {
        params["expand"] = params["expand"].join();
      }

      return this.ds.get(id, params).then((response): ICase => {
        return response["data"];
      });
    }

    getCases(params: Object = {}): ng.IPromise<ICases> {
      if (params.hasOwnProperty("fields")) {
        params["fields"] = params["fields"].join();
      }

      if (params.hasOwnProperty("expand")) {
        params["expand"] = params["expand"].join();
      }

      if (params.hasOwnProperty("facets")) {
        params["facets"] = params["facets"].join();
      }

      var paging = angular.fromJson(this.LocationService.pagination()["cases"]);

      // Testing is expecting these values in URL, so this is needed.
      paging = paging || {
        size: 20,
        from: 1
      };

      var defaults = {
        size: paging.size,
        from: paging.from,
        sort: paging.sort || 'case_id:asc',
        filters: this.LocationService.filters()
      };

      if (!params.hasOwnProperty("raw")) {
        defaults.filters = this.UserService.addMyProjectsFilter(defaults.filters, "cases.project.project_id");
      }
      this.CoreService.setSearchModelState(false);

      var abort = this.$q.defer();
      var prom: ng.IPromise<ICases> = this.ds.withHttpConfig({
        timeout: abort.promise
      })
      .get("", angular.extend(defaults, params)).then((response): ICases => {
        this.CoreService.setSearchModelState(true);
        return response["data"];
      });

      var eventCancel = this.$rootScope.$on("gdc-cancel-request", () => {
        abort.resolve();
        eventCancel();
        this.CoreService.setSearchModelState(true);
      });

      return prom;
    }
  }

  angular
      .module("cases.services", ["restangular", "components.location", "user.services", "core.services"])
      .service("CasesService", CasesService);
}
