module ngApp.files.services {
  import IFiles = ngApp.files.models.IFiles;
  import ICoreService = ngApp.core.services.ICoreService;
  import IFile = ngApp.files.models.IFile;
  import ILocationService = ngApp.components.location.services.ILocationService;
  import IUserService = ngApp.components.user.services.IUserService;
  import IRootScope = ngApp.IRootScope;

  export interface IFilesService {
    getFile(id: string, params: Object): ng.IPromise<IFile>;
    getFiles(params?: Object, method?: string): ng.IPromise<IFiles>;
    downloadManifest(ids: Array<string>, callback: any)
  }

  class FilesService implements IFilesService {
    private ds: restangular.IElement;

    /* @ngInject */
    constructor(
      private Restangular: restangular.IService,
      private LocationService: ILocationService,
      private UserService: IUserService,
      private CoreService: ICoreService,
      private $uibModal: any,
      private $rootScope: IRootScope,
      private $q: ng.IQService,
      private $filter,
      private $window,
      private RestFullResponse: any,
      private AuthRestangular
    ) {
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

    downloadManifest(_ids, callback: any) {
      this.download("/manifest", _ids, (status)=>{
        if(callback) callback(status);
      });
    }

    downloadFiles(_ids, callback: any) {
      this.download("/data", _ids, (status)=>{
        if(callback) callback(status);
      });
    }

    download(endpoint: string, ids: Array<string>, callback: any) {
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
          if(callback) callback(true);
        }, (response)=>{
          //Download Failed

          this.$uibModal.open({
            templateUrl: 'core/templates/download-failed.html',
            controller: "LoginToDownloadController",
            controllerAs: "wc",
            backdrop: true,
            keyboard: true,
            animation: false,
            size: "lg"
          });
          if(callback) callback(false);
        });
    }

    processBED(bedTSV: string): Object {
      if (bedTSV) {
        var lines = bedTSV.split("\n");
        return {"regions": _.map(lines, (line) => {
          var region = line.split("\t");
          var regionString = region[0];
          if (region.length > 1) {
            regionString += ":" + region[1];
            if (region.length > 2) {
              regionString += "-" + region[2];
            }
          }
          return regionString;
        })};
      }
      return {};
    }

    sliceBAM(fileID: string, bedTSV: string, completeCallback: () => void) {
      var abort = this.$q.defer();
      var params = this.processBED(bedTSV);

      this.AuthRestangular.all("/api/v0/slicing/view/" + fileID)
        .withHttpConfig({
          timeout: abort.promise,
          responseType: "blob",
          withCredentials: true,
        })
        .post(params, undefined, { 'Content-Type': 'application/json' })
        .then((response) => {
          this.$window.saveAs(response, fileID + '-sliced.bam');
        }, (response) => {
          //Slicing Failed
          if (response.status === 500) {
            // 500s show default app 500 error only
            return;
          }
          this.$uibModal.open({
            templateUrl: 'files/templates/bam-slicing-failed.html',
            controller: "BAMFailedModalController",
            controllerAs: "bamfc",
            backdrop: true,
            keyboard: true,
            animation: false,
            size: "lg",
            resolve: {
              errorStatus: () => { return response.status; },
              errorStatusText: () => { return response.statusText || 'Error'; },
              errorBlob: () => { return response.data || new Blob([JSON.stringify({error: 'Unexpected Error'})]); }
            }
          });
        })
        .finally(() => {
          if (completeCallback) {
            completeCallback();
          }
        });
    }

    getFiles(
      params: { fields?: any; expand?: any; facets?: any; raw?: any } = {},
      method: string = 'GET'
    ): ng.IPromise<IFiles> {

      var modifiedParams = _.extend({}, params, {
        fields: params.fields && params.fields.join(),
        expand: params.expand && params.expand.join(),
        facets: params.facets && params.facets.join()
      });

      var paging = angular.fromJson(this.LocationService.pagination().files);

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

      if (!params.raw) {
        defaults.filters = this.UserService.addMyProjectsFilter(defaults.filters, "cases.project.project_id");
      }

      this.CoreService.setSearchModelState(false);

      var abort = this.$q.defer();

      if (method === 'POST') {
        var prom: ng.IPromise<IFiles> = this.ds.withHttpConfig({
          timeout: abort.promise
        }).post(angular.extend(defaults, modifiedParams), undefined, {'Content-Type': 'application/json'}).then((response): IFiles => {
          this.CoreService.setSearchModelState(true);
          return response.data;
        });
      } else {
        var prom: ng.IPromise<IFiles> = this.ds.withHttpConfig({
          timeout: abort.promise
        }).get("", angular.extend(defaults, modifiedParams)).then((response): IFiles => {
          this.CoreService.setSearchModelState(true);
          return response.data;
        });
      }

      var eventCancel = this.$rootScope.$on("gdc-cancel-request", () => {
        console.log('aborted')
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
