module ngApp.files.services {
  import IFiles = ngApp.files.models.IFiles;
  import ICoreService = ngApp.core.services.ICoreService;
  import IFile = ngApp.files.models.IFile;
  import ILocationService = ngApp.components.location.services.ILocationService;
  import IUserService = ngApp.components.user.services.IUserService;
  import IRootScope = ngApp.IRootScope;

  export interface IFilesService {
    getFile(id: string, params: Object): ng.IPromise<IFile>;
    getFiles(params?: Object): ng.IPromise<IFiles>;
  }

  class FilesService implements IFilesService {
    private ds: restangular.IElement;

    /* @ngInject */
    constructor(private Restangular: restangular.IService, private LocationService: ILocationService,
                private UserService: IUserService, private CoreService: ICoreService,
                private $rootScope: IRootScope, private $q: ng.IQService, private $filter, private $window, private RestFullResponse: any) {
      this.ds = Restangular.all("files");
    }

    getFile(id: string, params: Object = {}): ng.IPromise<IFile> {
      if (params.hasOwnProperty("fields")) {
        params["fields"] = params["fields"].join();
      }

      if (params.hasOwnProperty("expand")) {
        params["expand"] = params["expand"].join();
      }

      return this.ds.get(id, params).then((response): IFile => {
        return response["data"];
      });
    }

    downloadManifest(_ids) {
      this.download("/manifest", _ids);
    }

    downloadFiles(_ids) {
      if(_ids.length == 1) {
        this.$window.location = this.$filter('makeDownloadLink')(_ids);
      } else {
        this.download("/data", _ids);
      }
    }

    download(endpoint: string, ids: Array<string>) {
      var abort = this.$q.defer();
      var params = { "ids": ids };
      this.RestFullResponse.all(endpoint + "?annotations=true&related_files=true")
        .withHttpConfig({
          timeout: abort.promise,
          responseType: "blob",
          withCredentials: true
        })
        .post(params, undefined, { 'Content-Type': 'application/json' })
        .then((response) => {
          var filename: string = response.headers['content-disposition'].match(/filename=(.*)/i)[1];
          this.$window.saveAs(response.data, filename);
        });
    }

    getFiles(params: Object = {}): ng.IPromise<IFiles> {
      if (params.hasOwnProperty("fields")) {
        params["fields"] = params["fields"].join();
      }

      if (params.hasOwnProperty("expand")) {
        params["expand"] = params["expand"].join();
      }

      if (params.hasOwnProperty("facets")) {
        params["facets"] = params["facets"].join();
      }

      var paging = angular.fromJson(this.LocationService.pagination()["files"]);

      // Testing is expecting these values in URL, so this is needed.
      paging = paging || {
        size: 20,
        from: 1
      };

      var defaults = {
        size: paging.size,
        from: paging.from,
        sort: paging.sort || "file_name:asc",
        filters: this.LocationService.filters()
      };

      if (!params.hasOwnProperty("raw")) {
        defaults.filters = this.UserService.addMyProjectsFilter(defaults.filters, "cases.project.project_id");
      }

      this.CoreService.setSearchModelState(false);

      var abort = this.$q.defer();
      var prom: ng.IPromise<IFiles> = this.ds.withHttpConfig({
        timeout: abort.promise
      })
      .get("", angular.extend(defaults, params)).then((response): IFiles => {
        this.CoreService.setSearchModelState(true);
        return response["data"];
      });

      var eventCancel = this.$rootScope.$on("gdc-cancel-request", () => {
        abort.resolve();
        eventCancel();
        this.CoreService.setSearchModelState(true);
      });

      return prom;
    }
  }

  angular
    .module("files.services", ["restangular", "components.location", "user.services", "core.services"])
    .service("FilesService", FilesService);

}

