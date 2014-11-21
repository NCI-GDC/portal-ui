module ngApp.files.controllers {
  import IFile = ngApp.files.models.IFile;
  import IFiles = ngApp.files.models.IFiles;
  import ICoreService = ngApp.core.services.ICoreService;
  import ICartService = ngApp.cart.services.ICartService;

  export interface IFilesController {
    files: IFiles;
  }

  class FilesController implements IFilesController {
    /* @ngInject */
    constructor(public files: IFiles) {
    }
  }

  export interface IFileController {
    file: IFile;
  }

  class FileController implements IFileController {
    /* @ngInject */
    constructor(public file: IFile, private CoreService: ICoreService, private CartService: ICartService) {
      CoreService.setPageTitle("File " + file.file_name);
    }

    handleAddClick(file: IFile) {
      this.CartService.add(file);
    }

  }

  angular
      .module("files.controller", [
        "files.services"
      ])
      .controller("FilesController", FilesController)
      .controller("FileController", FileController);
}
