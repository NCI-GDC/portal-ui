module ngApp.files.services {
  import IFile = ngApp.files.models.IFile;
  import File = ngApp.files.models.File;
  import IFiles = ngApp.files.models.IFiles;
  import Files = ngApp.files.models.Files;

  export interface IFilesService {
    getFile(id: string): ng.IPromise<File>;
    getFiles(params?: Object): ng.IPromise<Files>;
  }

  class FilesService implements IFilesService {
    private ds: restangular.IElement;

    /* @ngInject */
    constructor(Restangular: restangular.IService) {
      this.ds = Restangular.all("files");
    }

    getFile(id: string, params: Object = {}): ng.IPromise<File> {
      return this.ds.get(id, params).then(function (response) {
        return new File(response);
      });
    }

    getFiles(params: Object = {}): ng.IPromise<Files> {
      return this.ds.get("", params).then(function (response) {
        return new Files(response);
      });
    }
  }

  angular
      .module("files.services", ["files.models", "restangular"])
      .service("FilesService", FilesService);
}
