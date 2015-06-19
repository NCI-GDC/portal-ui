module ngApp.reports.services {
  import IReports = ngApp.reports.models.IReports;
  import IProjectsService = ngApp.projects.services.IProjectsService;

  export interface IReportsService {
    getReports(params?: Object): ng.IPromise<IReports>;
  }

  class ReportsService implements IReportsService {
    private ds: restangular.IElement;

    /* @ngInject */
    constructor(Restangular: restangular.IService, private $q,
                private ProjectsService: IProjectsService) {
      this.ds = Restangular.all("reports/data-download-statistics");
    }

    getReports(params: Object = {}): ng.IPromise<IReports> {
      if (params.hasOwnProperty("fields")) {
        params["fields"] = params["fields"].join();
      }

      if (params.hasOwnProperty("expand")) {
        params["expand"] = params["expand"].join();
      }

      if (params.hasOwnProperty("facets")) {
        params["facets"] = params["facets"].join();
      }

      var size = 999999;
      if (this.ProjectsService.projectIdMapping) {
        size = _.size(this.ProjectsService.projectIdMapping);
      }
      var defaults = {
        size: size,
        from: 0
      };

      var abort = this.$q.defer();
        var prom: ng.IPromise<IFiles> = this.ds.withHttpConfig({
          timeout: abort.promise
        })
        .get("", angular.extend(defaults, params)).then((response): IReports => {
          return response["data"];
        });
        return prom;
    }
  }

  angular
      .module("reports.services", ["restangular"])
      .service("ReportsService", ReportsService);
}
