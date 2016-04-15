module ngApp.files {
  "use strict";

  import IFilesService = ngApp.files.services.IFilesService;
  import IFile = ngApp.files.models.IFile;

  /* @ngInject */
  function filesConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("file", {
      url: "/files/:fileId",
      controller: "FileController as fc",
      templateUrl: "files/templates/file.html",
      resolve: {
        file: ($stateParams: ng.ui.IStateParamsService, FilesService: IFilesService): ng.IPromise<IFile> => {
          return FilesService.getFile($stateParams["fileId"], {
            fields: [
              "state",
              "md5sum",
              "access",
              "data_format",
              "data_type",
              "data_subtype",
              "data_format",
              "data_category",
              "file_name",
              "file_size",
              "file_id",
              "platform",
              "experimental_strategy",
              "center.short_name",
              "created_datetime",
              "uploaded_datetime",
              "cases.case_id",
              "cases.project.project_id",
              "annotations.annotation_id",
              "annotations.entity_id",
              "tags",
              "submitter_id",
              "archive.archive_id",
              "metadata_files.data_category",
              "metadata_files.data_type",
              "metadata_files.data_format",
              "metadata_files.file_size",
              "associated_entities.entity_id",
              "associated_entities.entity_type",
              "associated_entities.case_id",
            ]
          });
        }
      }
    });
  }

  angular
      .module("ngApp.files", [
        "files.controller",
        "files.directives",
        "ui.router.state"
      ])
      .config(filesConfig);
}
