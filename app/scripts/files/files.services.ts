module ngApp.files.services {
  import IFiles = ngApp.files.models.IFiles;
  import IFile = ngApp.files.models.IFile;

  export interface IFilesService {
    getFile(id: string): ng.IPromise<IFile>;
    getFiles(params?: Object): ng.IPromise<IFiles>;
    getFilesWithFilters(params?: Object): ng.IPromise<IFiles>;
  }

  class FilesService implements IFilesService {
    private ds: restangular.IElement;

    /* @ngInject */
    constructor(Restangular: restangular.IService) {
      this.ds = Restangular.all("files");
    }

    getFile(id: string, params: Object = {}): ng.IPromise<IFile> {
      return this.ds.get(id, params).then((response): IFile => {
        return response["data"];
      });
    }

    getFiles(params: Object = {}): ng.IPromise<IFiles> {
      return this.ds.get("", params).then((response): IFiles => {
        return response["data"];
      });
    }

    getFilesWithFilters(params: Object = {}): ng.IPromise<IFiles> {
      return this.ds.post(params).then((response): IFiles => {
        return response;
      });
    }
  }

  angular
      .module("files.services", ["restangular"])
      .service("FilesService", FilesService);
}
