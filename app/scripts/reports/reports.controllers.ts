module ngApp.reports.controllers {
  import ICoreService = ngApp.core.services.ICoreService;
  import IReports = ngApp.reports.models.IReports;
  import IReport = ngApp.reports.models.IReport;
        import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;
    import TableiciousEntryDefinition = ngApp.components.tables.directives.tableicious.TableiciousEntryDefinition;

  export interface IReportsController {
    reports: IReports;
  }
  export interface IReportController {
    report: IReport;
  }

  class ReportsController implements IReportsController {

    /* @ngInject */
    constructor(private CoreService: ICoreService, $scope,ReportsService, $q) {
        

      CoreService.setPageTitle("Reports");
      CoreService.setSearchModelState(true);
        
        ReportsService.getReports().then(function(a){
          console.log("Got data.",a);
          $scope.filesByProject = a.reduce(function(a,b){
             var project = b.archive.disease_code;
             var k = {
               project:project,
               count: 1
             }
             var g = _.find(a,function(c){return c.project === project});
             if (g) {
               g.count ++;
             } else {
               a.push(k);
             }
              
             return a;
          },[])
        });
      
    }  
  
  }

  class ReportController implements IReportController {

    /* @ngInject */
    constructor(public report: IReport, private CoreService: ICoreService, $timeout) {
      CoreService.setPageTitle("Report", report.id);
//      $timeout(function(){
//          console.log("Clear.");
//   
//      },1000);
    }
  }

  angular
      .module("reports.controller", [
        "reports.services",
        "core.services"
      ])
      .controller("ReportController", ReportController)
      .controller("ReportsController", ReportsController);
}
