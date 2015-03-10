module ngApp.components.ui.biospecimen.controllers {
  import IParticipant = ngApp.participants.models.IParticipant;
  import ILocationService = ngApp.components.location.services.ILocationService;
  import IGDCConfig = ngApp.IGDCConfig;

  export interface IBiospecimenController {
    activeBioSpecimenDocument: any;
    activeBioSpecimenDocumentType: string;
    displayBioSpecimenDocument(event: any, doc: any, type: string): void;
    downloadBiospecimenXML(participant_id: string): void;
  }

  class BiospecimenController implements IBiospecimenController {
    activeBioSpecimenDocument: any;
    activeBioSpecimenDocumentType: string;

    /* @ngInject */
    constructor(private LocationService: ILocationService,
                private config: IGDCConfig, $scope) {
      $scope.participant.samples[0].expanded = true;
      this.activeBioSpecimenDocument = $scope.participant.samples[0];

      this.bioSpecimenFileId = _.find($scope.participant.files, (file) => {
        return file.data_subtype.toLowerCase() === "biospecimen data";
      }).file_id;
    }

    displayBioSpecimenDocument(event: any, doc: any): void {
      if (event.which === 1 || event.which === 13) {
        this.activeBioSpecimenDocument = doc;
      }
    }

    displayBioSpecimenDocumentRow(key, value): boolean {
      if (key.toLowerCase() === "expanded") {
        return false;
      }

      if (key.toLowerCase() === "submitter_id") {
        return false;
      }

      return true;
    }

    displayBioSpecimenDocumentRowValue(key, value) {
      if (_.isArray(value)) {
        return value.length;
      }

      if (_.isObject(value)) {
        return value.name;
      }

      return value;
    }

  }

  angular.module("biospecimen.controllers", [])
      .controller("BiospecimenController", BiospecimenController);
}
