module ngApp.participants.services {
  import IParticipants = ngApp.participants.models.IParticipants;
  import ICoreService = ngApp.core.services.ICoreService;
  import IParticipant = ngApp.participants.models.IParticipant;
  import ILocationService = ngApp.components.location.services.ILocationService;
  import IUserService = ngApp.components.user.services.IUserService;
  import IRootScope = ngApp.IRootScope;

  export interface IParticipantsService {
    getParticipant(id: string, params: Object): ng.IPromise<IParticipant>;
    getParticipants(params?: Object, method?: string): ng.IPromise<IParticipants>;
  }

  class ParticipantsService implements IParticipantsService {
    private ds: restangular.IElement;

    /* @ngInject */
    constructor(Restangular: restangular.IService, private LocationService: ILocationService,
                private UserService: IUserService, private CoreService: ICoreService,
                private $rootScope: IRootScope, private $q: ng.IQService) {
      this.ds = Restangular.all("cases");
    }

    getParticipant(id: string, params: Object = {}): ng.IPromise<IParticipant> {
      if (params.hasOwnProperty("fields")) {
        params["fields"] = params["fields"].join();
      }

      if (params.hasOwnProperty("expand")) {
        params["expand"] = params["expand"].join();
      }

      return this.ds.get(id, params).then((response): IParticipant => {
        return response["data"];
      });
    }

    getParticipants(params: Object = {}, method: string = 'GET'): ng.IPromise<IParticipants> {
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
      if (method === 'POST') {
        var prom: ng.IPromise<IParticipants> = this.ds.withHttpConfig({
          timeout: abort.promise
        })
        .post(angular.extend(defaults, params), undefined, {'Content-Type': 'application/json'}).then((response): IParticipants => {
          this.CoreService.setSearchModelState(true);
          return response["data"];
        });
      } else {
        var prom: ng.IPromise<IParticipants> = this.ds.withHttpConfig({
          timeout: abort.promise
        })
        .get("", angular.extend(defaults, params)).then((response): IParticipants => {
          this.CoreService.setSearchModelState(true);
          return response["data"];
        });
      }

      var eventCancel = this.$rootScope.$on("gdc-cancel-request", () => {
        abort.resolve();
        eventCancel();
        this.CoreService.setSearchModelState(true);
      });

      return prom;
    }
  }

  angular
      .module("participants.services", ["restangular", "components.location", "user.services", "core.services"])
      .service("ParticipantsService", ParticipantsService);
}
