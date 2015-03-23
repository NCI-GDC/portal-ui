module ngApp.reports.controllers {
  import ICoreService = ngApp.core.services.ICoreService;
  import IReports = ngApp.reports.models.IReports;
  import IReport = ngApp.reports.models.IReport;

  export interface IReportsController {
    reports: IReports;
  }
  export interface IReportController {
    report: IReport;
  }

  class ReportsController implements IReportsController {

    /* @ngInject */
    constructor(private CoreService: ICoreService, $scope,ReportsService, $q,ProjectsService,$timeout,private LocationService: ILocationService, private config: IGDCConfig,  private $modal: any, private $q: ng.IQService, private Restangular: restangular.IProvider,
                private $window: ng.IWindowService, private UserService: IUserService,$timeout,$filter,ReportsGithutColumns,ReportsGithut) {

      CoreService.setPageTitle("Reports");
      
      /**
      * TODO: refactor with app/scripts/components/tables/tables.controllers.ts#L119
      */
      $scope.reportExport = function a(){  

        var url = LocationService.getHref();
        var abort = $q.defer();
        var modalInstance = $modal.open({
          templateUrl: "components/tables/templates/export-modal.html",
          controller: "ExportTableModalController as etmc",
          backdrop: 'static'
        });
        
        var fileType = 'JSON';
        var endpoint = 'reports/data-download-statistics';

        if ($window.URL && $window.URL.createObjectURL) {
          var params = {
            attachment: true,
            format: fileType,
            size: 20
          };

        Restangular.all(endpoint)
        .withHttpConfig({
          timeout: abort.promise,
          responseType: "blob"
        })
        .get('', params).then((file) => {
          var url = $window.URL.createObjectURL(file);
          var a = $window.document.createElement("a");
          a.setAttribute("href", url);
          a.setAttribute("download", endpoint + "." +
            $window.moment().format() + "." +
            fileType.toLowerCase());
            $window.document.body.appendChild(a);

            $timeout(() => {
              a.click();
              modalInstance.close({cancel: true});
              $window.document.body.removeChild(a);
            },777);
        });
      } else {
        this.LocationService.setHref(this.config.api + "/" +
             this.$scope.endpoint +
             "?attachment=true&format=" + fileType +
             "&fields=" + this.$scope.fields.join() +
             "&size=" + this.$scope.size +
             "&filters=" + JSON.stringify(filters));
      }
        
      modalInstance.result.then((data) => {
        if (data.cancel) {
          if (abort) {
            abort.resolve();
          } else {
            this.LocationService.setHref(url);
          }
        }
      });
      }

      ReportsService.getReports().then(function(reports){
        
       var data = reports.hits.map(function(a){
          a.file_size = a.size;
          a.file_count = a.count;
          return a;
        });

       
        
        $timeout(function(){
          var githut = ReportsGithut(data);
        
        
          $scope.githutData = githut.data;
          $scope.githutConfig = githut.config;
          
        },500);


        $scope.byProject = dataNest('project_id').entries(data);
        $scope.byDisease = dataNest('disease_type').entries(data);
        $scope.byProgram = dataNest('program').entries(data);

        $scope.byDataType = dataNest('data_type').entries(data.reduce(function(a,b){
          a = a.concat(b.data_types);
          return a;
        },[]));
        
        $scope.bySubtype = dataNest('data_subtype').entries(data.reduce(function(a,b){
          a = a.concat(b.data_subtypes);
          return a;
        },[]));

        $scope.byStrat = dataNest('experimental_strategy').entries(data.reduce(function(a,b){
          a = a.concat(b.experimental_strategies);
          return a;
        },[]));
        
        $scope.byDataAccess = dataNest('access').entries(data.reduce(function(a,b){
          a = a.concat(b.data_access);
          return a;
        },[]));

        $scope.byUserType = dataNest('user_access_type').entries(data.reduce(function(a,b){
          a = a.concat(b.user_access_types);
          return a;
        },[]));

        $scope.byLocation = dataNest('country').entries(data.reduce(function(a,b){
          a = a.concat(b.countries);
          return a;
        },[]));


        function dataNest(key){
          return d3.nest()
              .key(function(d){return d[key]})
              .rollup(function(d){
                return {
                  file_count:d3.sum(d.map(function(x){return x.count})),
                  file_size:d3.sum(d.map(function(x){return x.size})),
                  project_name:d[0].project_name
                }
              })
              .sortValues(function(a,b){return a.file_count - b.file_count});

        }
        




      });
    }


  }

  class ReportController implements IReportController {

    /* @ngInject */
    constructor(public report: IReport, private CoreService: ICoreService, $timeout) {
      CoreService.setPageTitle("Report", report.id);

    }
  }

  angular
      .module("reports.controller", [
        "reports.services",
        "core.services",
        'reports.githut.config'
      ])
      .controller("ReportController", ReportController)
      .controller("ReportsController", ReportsController);
}