module ngApp.participants.controllers {
  import IParticipant = ngApp.participants.models.IParticipant;
  import IParticipants = ngApp.participants.models.IParticipants;
  import ICoreService = ngApp.core.services.ICoreService;

  export interface IParticipantsController {
    participants: IParticipants;
  }

  class ParticipantsController implements IParticipantsController {
    /* @ngInject */
    constructor(public participants: IParticipants, private CoreService: ICoreService) {
      CoreService.setPageTitle("Participants");
    }
  }

  export interface IParticipantController {
    participant: IParticipant;
  }

  class ParticipantController implements IParticipantController {
    /* @ngInject */
    constructor(public participant: IParticipant, private CoreService: ICoreService) {
      CoreService.setPageTitle("Participant " + participant.id);
    }
  }

  angular
      .module("participants.controller", [
        "participants.services",
        "core.services"
      ])
      .controller("ParticipantsController", ParticipantsController)
      .controller("ParticipantController", ParticipantController);
}
