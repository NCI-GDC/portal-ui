module ngApp.participants.services {
  import IParticipant = ngApp.participants.models.IParticipant;
  import Participant = ngApp.participants.models.Participant;
  import IParticipants = ngApp.participants.models.IParticipants;
  import Participants = ngApp.participants.models.Participants;

  export interface IParticipantsService {
    getParticipant(id: string): ng.IPromise<Participant>;
    getParticipants(params?: Object): ng.IPromise<Participants>;
  }

  class ParticipantsService implements IParticipantsService {
    private static logParticipant(id: string, params: Object) {
      console.log("Received participant ", id, " request with params: ", params);
    }

    private static logParticipants(params: Object) {
      console.log("Received participants request with params: ", params);
    }

    private ds: restangular.IElement;

    /* @ngInject */
    constructor(Restangular: restangular.IService) {
      this.ds = Restangular.all("participants");
    }

    getParticipant(id: string, params: Object = {}): ng.IPromise<Participant> {
      ParticipantsService.logParticipant(id, params);
      return this.ds.get(id, params).then(function (response) {
        return new Participant(response);
      });
    }

    getParticipants(params: Object = {}): ng.IPromise<Participants> {
      ParticipantsService.logParticipants(params);
      return this.ds.get("", params).then(function (response) {
        return new Participants(response);
      });
    }
  }

  angular
      .module("participants.services", ["participants.models"])
      .service("ParticipantsService", ParticipantsService);
}
