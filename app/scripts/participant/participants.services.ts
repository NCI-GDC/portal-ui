module ngApp.participants.services {
  import IParticipants = ngApp.participants.models.IParticipants;
  import ICoreService = ngApp.core.services.ICoreService;
  import IParticipant = ngApp.participants.models.IParticipant;
  import ILocationService = ngApp.components.location.services.ILocationService;
  import IUserService = ngApp.components.user.services.IUserService;
  import IRootScope = ngApp.IRootScope;

  export interface IParticipantsService {
    getParticipant(id: string, params: Object): ng.IPromise<IParticipant>;
    getParticipants(params?: Object, paginationKey?: string): ng.IPromise<IParticipants>;
  }

  class ParticipantsService implements IParticipantsService {
    private ds: restangular.IElement;

    /* @ngInject */
    constructor(Restangular: restangular.IService, private LocationService: ILocationService,
                private UserService: IUserService, private CoreService: ICoreService,
                private $rootScope: IRootScope, private $q: ng.IQService) {
      this.ds = Restangular.all("participants");
    }

    getParticipant(id: string, params: Object = {}): ng.IPromise<IParticipant> {
      if (params.hasOwnProperty("fields")) {
        params["fields"] = params["fields"].join();
      }

      return this.ds.get(id, params).then((response): IParticipant => {
        return response["data"];
      });
    }

    getParticipants(params: Object = {}): ng.IPromise<IParticipants> {
      if (params.hasOwnProperty("fields")) {
        params["fields"] = params["fields"].join();
      }

      if (params.hasOwnProperty("facets")) {
        params["facets"] = params["facets"].join();
      }

      var paging = angular.fromJson(this.LocationService.pagination()["participants"]);

      // Testing is expecting these values in URL, so this is needed.
      paging = paging || {
        size: 10,
        from: 1
      };

      var defaults = {
        size: paging.size,
        from: paging.from,
        sort: paging.sort || 'bcr_patient_barcode:asc',
        filters: this.LocationService.filters()
      };

      defaults.filters = this.UserService.addMyProjectsFilter(defaults.filters, "participants.admin.disease_code");
      this.CoreService.setSearchModelState(false);

      var abort = this.$q.defer();
      var prom: ng.IPromise<IParticipants> = this.ds.withHttpConfig({
        timeout: abort.promise
      })
      .get("", angular.extend(defaults, params)).then((response): IParticipants => {
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
      .module("participants.services", ["restangular", "components.location", "user.services", "core.services"])
      .service("ParticipantsService", ParticipantsService);
}
