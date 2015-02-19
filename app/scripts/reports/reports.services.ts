module ngApp.reports.services {
  import IReports = ngApp.reports.models.IReports;
  import IReport = ngApp.reports.models.IReport;

  export interface IReportsService {
    getReport(id: string): ng.IPromise<IReport>;
    getReports(params?: Object): ng.IPromise<IReports>;
  }

  class ReportsService implements IReportsService {
    private ds: restangular.IElement;

    /* @ngInject */
    constructor(Restangular: restangular.IService, $q) {
      this.ds = Restangular.all("reports");
    }

    getReport(id: string, params: Object = {}): ng.IPromise<IReport> {
        
      return this.ds.get(id, params).then((response): IReport => {
        return response;
      });
    }

    getReports(params: Object = {}): ng.IPromise<IReports> {
//        console.log("getting reports.");
//        var deferred = $q.defer();
//        _.defer(function(){
//            deferred.resolve({
//                isGood:true
//            })
//        });
//    
//        return deferred.promise;
//        return this.ds.get("", params).then((response): IReports => {
//            return response;
//        });
    }
  }

  angular
      .module("reports.services", ["restangular"])
      .service("ReportsService", ReportsService);
}
