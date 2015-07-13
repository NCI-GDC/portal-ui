module ngApp.participants {
  "use strict";

  import IParticipantsService = ngApp.participants.services.IParticipantsService;
  import IParticipant = ngApp.participants.models.IParticipant;

  /* @ngInject */
  function participantsConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("case", {
      url: "/cases/:caseId",
      controller: "ParticipantController as pc",
      templateUrl: "participant/templates/participant.html",
      resolve: {
        participant: ($stateParams: ng.ui.IStateParamsService, ParticipantsService: IParticipantsService): ng.IPromise<IParticipant> => {
          return ParticipantsService.getParticipant($stateParams["caseId"], {
            fields: [
              "case_id",
              "submitter_id",
              "annotations.annotation_id"
           ],
           expand: [
            "clinical",
            "files",
            "project",
            "project.program",
            "summary",
            "summary.experimental_strategies",
            "summary.data_types",
            "samples",
            "samples.portions",
            "samples.portions.analytes",
            "samples.portions.analytes.aliquots",
            "samples.portions.analytes.aliquots.annotations",
            "samples.portions.analytes.annotations",
            "samples.portions.submitter_id",
            "samples.portions.slides",
            "samples.portions.annotations",
            "samples.portions.center",
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
