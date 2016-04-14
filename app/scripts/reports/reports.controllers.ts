module ngApp.reports.controllers {
  import ICoreService = ngApp.core.services.ICoreService;
  import IReports = ngApp.reports.models.IReports;
  import IReport = ngApp.reports.models.IReport;
  import IProjectsService = ngApp.projects.services.IProjectsService;
  import ILocationService = ngApp.components.location.services.ILocationService;

  export interface ID3Entry {
    key: string;
    values: {
      file_count: number;
      file_size: number;
      project_name: string;
    };
  }

  export interface IReportsController {
    reports: IReports;
    byProject: any;
    byDisease: any;
    byProgram: any;
    byDataType: any;
    byDataCategory: any;
    byStrat: any;
    byDataAccess: any;
    byUserType: any;
    byLocation: any;
    dataNest(key: string): any;
  }

  class ReportsController implements IReportsController {
    byProject: [ID3Entry];
    byDisease: [ID3Entry];
    byProgram: [ID3Entry];
    byDataType: [ID3Entry];
    byDataCategory: [ID3Entry];
    byStrat: [ID3Entry];
    byDataAccess: [ID3Entry];
    byUserType: [ID3Entry];
    byLocation: [ID3Entry];

    /* @ngInject */
    constructor(public reports: IReports, private CoreService: ICoreService,
                public $scope: ng.IScope, private $timeout: ng.ITimeoutService,
                private ReportsGithutColumns, private ReportsGithut, public reportServiceExpand: string[]) {

        CoreService.setPageTitle("Reports");

        if (reports.hits.length) {
          var dataNoZeros = reports.hits.filter(hit => hit.count && hit.size)
          this.byProject = this.dataNest("project_id").entries(dataNoZeros);
          this.byDisease = this.dataNest("disease_type").entries(dataNoZeros);
          this.byProgram = this.dataNest("program").entries(dataNoZeros);
          this.byDataCategory = this.dataNest("data_category").entries(this.reduceBy(dataNoZeros, "data_categories"));
          this.byDataType = this.dataNest("data_type").entries(this.reduceBy(dataNoZeros, "data_types"));
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
    }

    dataNest(key: string): any {
      return d3.nest()
        .key(d => d[key])
        .rollup(d => {
          return {
            file_count: d3.sum(d.map(x => x.count)),
            file_size: d3.sum(d.map(x => x.size)),
            project_name: d[0].disease_type
          }
        })
        .sortValues((a,b) => a.file_count - b.file_count);
    }

    reduceBy(data: any, key: string): any {
      return _.reduce(data, (result, datum) => {
        return datum[key] ? result.concat(datum[key]) : result;
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
