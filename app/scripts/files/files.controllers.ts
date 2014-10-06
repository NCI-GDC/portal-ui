module ngApp.files.controllers {
  import IFile = ngApp.files.models.IFile;
  import IFiles = ngApp.files.models.IFiles;

  export interface IFilesController {
    files: IFiles;
  }

  class FilesController implements IFilesController {
    /* @ngInject */
    constructor(public files: IFiles) {}
  }

  export interface IFileController {
    file: IFile;
  }

  class FileController implements IFileController {
    /* @ngInject */
    constructor(public file: IFile) {}
  }

  angular
      .module("files.controller", [
        "files.services"
      ])
      .controller("FilesController", FilesController)
      .controller("FileController", FileController);
}
