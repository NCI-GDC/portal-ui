module ngApp.participants {
  "use strict";

  import IParticipantsService = ngApp.participants.services.IParticipantsService;
  import IParticipant = ngApp.participants.models.IParticipant;

  /* @ngInject */
  function participantsConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("participant", {
      url: "/participants/:participantId",
      controller: "ParticipantController as pc",
      templateUrl: "participant/templates/participant.html",
      resolve: {
        participant: ($stateParams: ng.ui.IStateParamsService, ParticipantsService: IParticipantsService): ng.IPromise<IParticipant> => {
          return ParticipantsService.getParticipant($stateParams["participantId"], {
            fields: [
              "bcr_patient_uuid",
              "vital_status",
              "patient_id",
              "tumor_tissue_site",
              "ethnicity",
              "gender",
              "race",
              "bcr_patient_barcode",
              "admin.disease_code",
              "admin.project_code",
                "clinical_cqcf.consent_or_death_status",
                "files.file_uuid",
                "participant_annotations.id"
            ]
          });
        }
      }
    });
  }

  angular
      .module("ngApp.participants", [
        "participants.controller",
        "ui.router.state"
      ])
      .config(participantsConfig);
}
