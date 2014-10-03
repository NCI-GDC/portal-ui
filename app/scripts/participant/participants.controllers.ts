module ngApp.participants.controllers {
  import IParticipant = ngApp.participants.models.IParticipant;
  import IParticipants = ngApp.participants.models.IParticipants;

  export interface IParticipantsController {
    participants: IParticipants;
  }

  class ParticipantsController implements IParticipantsController {
    /* @ngInject */
    constructor(public participants: IParticipants) {}
  }

  export interface IParticipantController {
    participant: IParticipant;
  }

  class ParticipantController implements IParticipantController {
    /* @ngInject */
    constructor(public participant: IParticipant) {}
  }

  angular
      .module("participants.controller", [
        "participants.services"
      ])
      .controller("ParticipantsController", ParticipantsController)
      .controller("ParticipantController", ParticipantController);
}
