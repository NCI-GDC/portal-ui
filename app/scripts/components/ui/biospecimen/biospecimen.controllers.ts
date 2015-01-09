module ngApp.components.ui.biospecimen.controllers {
  import IParticipant = ngApp.participants.models.IParticipant;

  export interface IBiospecimenController {
    displayBioSpecimenDocument(event: any, doc: any, type: string): void;
    activeBioSpecimenDocument: any;
    activeBioSpecimenDocumentType: string;
  }

  class BiospecimenController implements IBiospecimenController {
    activeBioSpecimenDocument: any;
    activeBioSpecimenDocumentType: string;

    /* @ngInject */
    constructor() {}

    displayBioSpecimenDocument(event: any, doc: any, type: string): void {
      if (event.which === 1 || event.which === 13) {
        this.activeBioSpecimenDocumentType = type;
        this.activeBioSpecimenDocument = doc;
      }
    }
  }

  angular.module("biospecimen.controllers", [])
      .controller("BiospecimenController", BiospecimenController);
}
