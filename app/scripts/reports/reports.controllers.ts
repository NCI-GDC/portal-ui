module ngApp.reports.controllers {
  import ICoreService = ngApp.core.services.ICoreService;
  import IReports = ngApp.reports.models.IReports;
  import IReport = ngApp.reports.models.IReport;
  import IProjectsService = ngApp.projects.services.IProjectsService;
  import ILocationService = ngApp.components.location.services.ILocationService;

  export interface IReportsController {
    reports: IReports;
    byProject: any;
    byDisease: any;
    byProgram: any;
    byDataType: any;
    bySubtype: any;
    byStrat: any;
    byDataAccess: any;
    byUserType: any;
    byLocation: any;
  }

  class ReportsController implements IReportsController {
    reports: IReports;
    byProject: any;
    byDisease: any;
    byProgram: any;
    byDataType: any;
    bySubtype: any;
    byStrat: any;
    byDataAccess: any;
    byUserType: any;
    byLocation: any;

    /* @ngInject */
    constructor(public reports: IReports, private CoreService: ICoreService,
                public $scope: ng.IScope, private $timeout: ng.ITimeoutService,
                private ReportsGithutColumns, private ReportsGithut, public reportServiceExpand: string[]) {

        CoreService.setPageTitle("Reports");

        var dataNoZeros = _.reject(reports.hits, (hit) => { return hit.count === 0 && hit.size ===0; });
        this.byProject = this.dataNest("project_id").entries(dataNoZeros);
        this.byDisease = this.dataNest("disease_type").entries(dataNoZeros);
        this.byProgram = this.dataNest("program").entries(dataNoZeros);
        this.byDataType = this.dataNest("data_type").entries(this.reduceBy(dataNoZeros, "data_types"));
        this.bySubtype = this.dataNest("data_subtype").entries(this.reduceBy(dataNoZeros, "data_subtypes"));
        this.byStrat = this.dataNest("experimental_strategy").entries(this.reduceBy(dataNoZeros, "experimental_strategies"));
        this.byDataAccess = this.dataNest("access").entries(this.reduceBy(dataNoZeros, "data_access"));
        this.byUserType = this.dataNest("user_access_type").entries(this.reduceBy(dataNoZeros, "user_access_types"));
        this.byLocation = this.dataNest("country").entries(this.reduceBy(dataNoZeros, "countries"));

        $timeout(() => {
          var githut = ReportsGithut(dataNoZeros);
          $scope.githutData = githut.data;
          $scope.githutConfig = githut.config;
        }, 500);
    }

    dataNest(key: string): any {
      return d3.nest()
          .key(function(d){return d[key]})
          .rollup(function(d){
            return {
              file_count: d3.sum(d.map(function(x){return x.count})),
              file_size: d3.sum(d.map(function(x){return x.size})),
              project_name:d[0].disease_type
            }
          })
          .sortValues(function(a,b){return a.file_count - b.file_count});
    }

    reduceBy(data: any, key: string): any {
      return _.reduce(data, (result, datum) => {
                      if (datum[key]) {
                        result = result.concat(datum[key]);
                      }
                      return result;
            }, []);
    }

  }

  angular
      .module("reports.controller", [
        "reports.services",
        "core.services",
        "reports.githut.config"
      ])
      .controller("ReportsController", ReportsController);
}

