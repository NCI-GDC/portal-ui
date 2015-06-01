module ngApp.participants.controllers {
  import IParticipant = ngApp.participants.models.IParticipant;
  import IParticipants = ngApp.participants.models.IParticipants;
  import ICoreService = ngApp.core.services.ICoreService;
  import ILocationService = ngApp.components.location.services.ILocationService;
  import IGDCConfig = ngApp.IGDCConfig;

  export interface IParticipantController {
    participant: IParticipant;
    annotationIds: string[];
    clinicalFileId: string;
    DownloadClinicalXML(): void;
  }

  class ParticipantController implements IParticipantController {
    annotationIds: string[];
    clinicalFileId: string;
    /* @ngInject */
    constructor(public participant: IParticipant,
                private CoreService: ICoreService,
                private LocationService: ILocationService,
                private config: IGDCConfig) {
      CoreService.setPageTitle("Case " + participant.participant_id);

      var annotationIds = _.map(this.participant.annotations, (annotation) => {
        return annotation.annotation_id;
      });

      function checkAnnotations(item) {
        _.forEach(item, function (obj) {
          _.forEach(obj, function (val, key) {
            if (key === "annotations") {
              annotationIds = annotationIds.concat(_.pluck(val, "annotation_id"));
            } else if (_.isArray(val)) {
              checkAnnotations(val);
            }
          });
        });
      }

      if (this.participant.samples) {
        checkAnnotations(this.participant.samples);
      }

      this.annotationIds = annotationIds;

      var clinicalFile = _.find(this.participant.files, (file) => {
        return file.data_subtype.toLowerCase() === "clinical data";
      });

      if (clinicalFile) {
        this.clinicalFileId = clinicalFile.file_id;
      }

    }

  }

  angular
      .module("participants.controller", [
        "participants.services",
        "core.services"
      ])
      .controller("ParticipantController", ParticipantController);
}
