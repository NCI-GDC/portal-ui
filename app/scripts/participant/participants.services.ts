module ngApp.participants.services {
  import IParticipants = ngApp.participants.models.IParticipants;
  import IParticipant = ngApp.participants.models.IParticipant;

  export interface IParticipantsService {
    getParticipant(id: string): ng.IPromise<IParticipant>;
    getParticipants(params?: Object): ng.IPromise<IParticipants>;
  }

  class ParticipantsService implements IParticipantsService {
    private ds: restangular.IElement;

    /* @ngInject */
    constructor(Restangular: restangular.IService) {
      this.ds = Restangular.all("participants");
    }

    getParticipant(id: string, params: Object = {}): ng.IPromise<IParticipant> {
      return this.ds.get(id, params).then((response): IParticipant => {
        return response["data"];
      });
    }

    getParticipants(params: Object = {}): ng.IPromise<IParticipants> {
      return this.ds.get("", params).then((response): IParticipants => {
        return response["data"];
      });
    }
  }

  angular
      .module("participants.services", ["restangular"])
      .service("ParticipantsService", ParticipantsService);
}
