module ngApp.components.ui.biospecimen.controllers {
  import IParticipant = ngApp.participants.models.IParticipant;
  import ILocationService = ngApp.components.location.services.ILocationService;
  import IGDCConfig = ngApp.IGDCConfig;

  export interface IBiospecimenController {
    activeBioSpecimenDoc: any;
    activeBioSpecimenDocType: string;
    displayBioSpecimenDocument(doc: any, type: string): void;
    downloadBiospecimenXML(participant_id: string): void;
    bioSpecimenFile: any;
  }

  class BiospecimenController implements IBiospecimenController {
    activeBioSpecimenDoc: any;
    activeBioSpecimenDocType: string;

    /* @ngInject */
    constructor(
      private LocationService: ILocationService,
      private config: IGDCConfig,
      $scope
    ) {

      if ($scope.participant.samples) {
        $scope.participant.samples.expanded = true;
        this.activeBioSpecimenDoc = $scope.participant.samples[0];
        this.activeBioSpecimenDocType = "sample";
      }

      this.bioSpecimenFile = _.find($scope.participant.files, (file) => {
        return (file.data_subtype || '').toLowerCase() === "biospecimen data";
      });

      const participant = $scope.participant;
      this.hasNoBiospecimen = _.size(participant.samples) < 1;

      this.biospecimenDataExportFilters = {
        'cases.case_id': participant.case_id
      };

      this.biospecimenDataExportExpands =
        ['samples','samples.portions','samples.portions.analytes','samples.portions.analytes.aliquots',
        'samples.portions.analytes.aliquots.annotations','samples.portions.analytes.annotations',
        'samples.portions.submitter_id','samples.portions.slides','samples.portions.annotations',
        'samples.portions.center'];

      this.biospecimenDataExportFileName = 'biospecimen.case-' + participant.case_id;

      $scope.$on('displayBioSpecimenDocument', (event, data) => {
        this.activeBioSpecimenDocType = data.type;
        this.activeBioSpecimenDoc = data.doc;
      })
    }

    displayBioSpecimenDocumentRow(key, value): boolean {
      if (key.toLowerCase() === "expanded") {
        return false;
      }

      if (key.toLowerCase() === "submitter_id") {
        return false;
      }

      if (key === this.activeBioSpecimenDocType + "_id") {
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

      if (!value && (!isNaN(value) && value !== 0)) {
        return "--";
      }

      return value;
    }

  }

  angular.module("biospecimen.controllers", [])
      .controller("BiospecimenController", BiospecimenController);
}
