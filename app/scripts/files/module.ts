module ngApp.files {
  "use strict";

  import IFilesService = ngApp.files.services.IFilesService;
  import IFiles = ngApp.files.models.IFiles;
  import IFile = ngApp.files.models.IFile;

  /* @ngInject */
  function filesConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("files", {
      url: "/files",
      controller: "FilesController as fsc",
      templateUrl: "files/templates/files.html",
      resolve: {
        files: (FilesService: IFilesService): ng.IPromise<IFiles> => {
          return FilesService.getFiles();
        }
      }
    });

    $stateProvider.state("file", {
      url: "/files/:fileId",
      controller: "FileController as fc",
      templateUrl: "files/templates/file.html",
      resolve: {
        file: ($stateParams: ng.ui.IStateParamsService, FilesService: IFilesService): ng.IPromise<IFile> => {
          return FilesService.getFile($stateParams["fileId"], {
            fields: [
              "_aliquot_barcode",
              "data_access",
              "data_format",
              "data_level",
              "data_subtype",
              "data_type",
              "file_extension",
              "file_name",
              "file_size",
              "file_uuid",
              "platform",
              "updated",
              "experimental_strategy",
              "participants.bcr_patient_uuid",
              "participants.bcr_patient_barcode",
              "participants.samples.bcr_sample_uuid",
              "participants.samples.portions.bcr_portion_uuid",
              "participants.samples.portions.analytes.bcr_analyte_uuid",
              "participants.samples.portions.analytes.aliquots.bcr_aliquot_uuid"
            ]
          });
        }
      }
    });
  }

  angular
      .module("ngApp.files", [
        "files.controller",
        "ui.router.state"
      ])
      .config(filesConfig);
}
