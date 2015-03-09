module ngApp.participants.controllers {
  import IParticipant = ngApp.participants.models.IParticipant;
  import IParticipants = ngApp.participants.models.IParticipants;
  import ICoreService = ngApp.core.services.ICoreService;
  import ILocationService = ngApp.components.location.services.ILocationService;
  import IGDCConfig = ngApp.IGDCConfig;

  export interface IParticipantController {
    participant: IParticipant;
    annotationIds: string[];
    DownloadClinicalXML(): void;
  }

  class ParticipantController implements IParticipantController {
    annotationIds: string[];
    /* @ngInject */
    constructor(public participant: IParticipant,
                private CoreService: ICoreService,
                private LocationService: ILocationService,
                private config: IGDCConfig) {
      CoreService.setPageTitle("Participant " + participant.participant_id);

      this.annotationIds = _.map(this.participant.annotations, (annotation) => {
                                  return annotation.annotation_id;
                                });
      }

    DownloadClinicalXML(): void {
      this.LocationService.setHref(this.config.api + "/participants/" +
                                     this.participant.participant_id +
                                     "?attachment=true&format=xml" +
                                     "&fields=clinical.gender,clinical.vital_status,clinical.icd_10,clinical.ethnicity,clinical.race"
                                  )
    }

  }

  angular
      .module("participants.controller", [
        "participants.services",
        "core.services"
      ])
      .controller("ParticipantController", ParticipantController);
}
