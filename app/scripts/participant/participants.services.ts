module ngApp.participants.services {
  import IParticipants = ngApp.participants.models.IParticipants;
  import IParticipant = ngApp.participants.models.IParticipant;
  import ILocationService = ngApp.components.location.services.ILocationService;

  export interface IParticipantsService {
    getParticipant(id: string, params: Object): ng.IPromise<IParticipant>;
    getParticipants(params?: Object): ng.IPromise<IParticipants>;
  }

  class ParticipantsService implements IParticipantsService {
    private ds: restangular.IElement;

    /* @ngInject */
    constructor(Restangular: restangular.IService, private LocationService: ILocationService) {
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
      var defaults = {
        size: 10,
        from: 1,
        filters: this.LocationService.filters()
      };

      return this.ds.get("", angular.extend(defaults, params)).then((response): IParticipants => {
        return response["data"];
      });
    }
  }

  angular
      .module("participants.services", ["restangular", "components.location"])
      .service("ParticipantsService", ParticipantsService);
}
