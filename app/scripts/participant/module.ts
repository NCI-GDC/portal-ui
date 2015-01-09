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
              "participant_annotations.id",
              "samples.bcr_sample_barcode",
              "samples.bcr_sample_uuid",
              "samples.portions.bcr_portion_uuid",
              "samples.portions.bcr_portion_barcode",
              "samples.portions.slides.bcr_slide_uuid",
              "samples.portions.slides.bcr_slide_barcode",
              "samples.portions.analytes.bcr_analyte_uuid",
              "samples.portions.analytes.bcr_analyte_barcode",
              "samples.portions.analytes.amount",
              "samples.portions.analytes.analyte_type",
              "samples.portions.analytes.aliquots.bcr_aliquot_barcode",
              "samples.portions.analytes.aliquots.bcr_aliquot_uuid"
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
