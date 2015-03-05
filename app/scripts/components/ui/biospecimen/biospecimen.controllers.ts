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
                private config: IGDCConfig) {}

    displayBioSpecimenDocument(event: any, doc: any, type: string): void {
      if (event.which === 1 || event.which === 13) {
        this.activeBioSpecimenDocumentType = type;
        this.activeBioSpecimenDocument = doc;
      }
    }

    downloadBiospecimenXML(participant_id: string): void {
      this.LocationService.setHref(this.config.api + "/participants/" +
                                     participant_id +
                                     "?attachment=true&format=xml" +
                                      "&fields=" +
                                      "samples.sample_id",
                                      "samples.submitter_id",
                                      "samples.portions.portion_id",
                                      "samples.portions.submitter_id",
                                      "samples.portions.slides.slide_id",
                                      "samples.portions.slides.submitter_id",
                                      "samples.portions.analytes.analyte_id",
                                      "samples.portions.analytes.submitter_id",
                                      "samples.portions.analytes.amount",
                                      "samples.portions.analytes.analyte_type",
                                      "samples.portions.analytes.aliquots.aliquot_id",
                                      "samples.portions.analytes.aliquots.submitter_id",
                                      "samples.portions.annotations.annotation_id"
                                  );
    }

  }

  angular.module("biospecimen.controllers", [])
      .controller("BiospecimenController", BiospecimenController);
}
