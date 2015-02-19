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
               count: 1,
               file_size: b.file_size
             }
             var g = _.find(a,function(c){return c.project === project});
             if (g) {
               g.count ++;
               g.file_size += b.file_size;
             } else {
               a.push(k);
             }
              
             return a;
          },[]);
            
          $scope.filesByType = a.reduce(function(a,b){
             var data_type = b.data_type;
             var k = {
               data_type:data_type,
               count: 1,
               file_size: b.file_size
             }
             var g = _.find(a,function(c){return c.data_type === data_type});
             if (g) {
               g.count ++;
               g.file_size += b.file_size;
             } else {
               a.push(k);
             }
              
             return a;
          },[]);
            
          $scope.filesByProgram = [{
              program:'TCGA',
              count:395,
              file_size:129034893
          }]
          
          $scope.filesByPrimarySite = [{
              primary_site:'Lung',
              count:212,
              file_size:12903323
          },{
              primary_site:'Heart',
              count:19,
              file_size:3266746
          },{
              primary_site:'Skin',
              count:84,
              file_size:6293859
          }]
            
          
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
