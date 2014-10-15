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
          return FilesService.getFile($stateParams["fileId"]);
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
