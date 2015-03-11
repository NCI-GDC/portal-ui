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
              "file_name",
              "file_size",
              "file_id",
              "platform",
              "experimental_strategy",
              "archive.archive_id",
              "archive.revision",
              "center.short_name",
              "creation_datetime",
              "participants.participant_id",
              "participants.project.project_id",
              "related_files.file_id",
              "related_files.type",
              "related_files.file_name",
              "related_files.md5sum",
              "annotations.annotation_id",
              "tags",
              "origin"
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
