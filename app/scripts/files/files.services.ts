module ngApp.files.services {
  import IFiles = ngApp.files.models.IFiles;
  import IFile = ngApp.files.models.IFile;
  import ILocationService = ngApp.components.location.services.ILocationService;

  export interface IFilesService {
    getFile(id: string, params: Object): ng.IPromise<IFile>;
    getFiles(params?: Object): ng.IPromise<IFiles>;
  }

  class FilesService implements IFilesService {
    private ds: restangular.IElement;

    /* @ngInject */
    constructor(Restangular: restangular.IService, private LocationService: ILocationService) {
      this.ds = Restangular.all("files");
    }

    getFile(id: string, params: Object = {}): ng.IPromise<IFile> {
      if (params.hasOwnProperty("fields")) {
        params["fields"] = params["fields"].join();
      }

      return this.ds.get(id, params).then((response): IFile => {
        return response["data"];
      });
    }

    getFiles(params: Object = {}): ng.IPromise<IFiles> {
      if (params.hasOwnProperty("fields")) {
        params["fields"] = params["fields"].join();
      }
      if (params.hasOwnProperty("facets")) {
        params["facets"] = params["facets"].join();
      }
      var defaults = {
        size: 10,
        from: 1,
        filters: this.LocationService.filters()
      };

      return this.ds.get("", angular.extend(defaults, params)).then((response): IFiles => {
        return response["data"];
      });
    }
  }

  angular
      .module("files.services", ["restangular", "components.location"])
      .service("FilesService", FilesService);
}
