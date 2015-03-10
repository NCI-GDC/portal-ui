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
    constructor(Restangular: restangular.IService, private $q,private CartService, private dummyReports) {
      this.ds = Restangular.all("reports");
      this.dr = dummyReports;
    }

    getReport(id: string, params: Object = {}): ng.IPromise<IReport> {


    }

    getReports(params: Object = {}): ng.IPromise<IReports> {

      var deferred = this.$q.defer();
      _.defer(()=>{
        deferred.resolve(this.dr);
      });

      return deferred.promise;

    }
  }

  angular
      .module("reports.services", ["restangular"])
      .value('dummyReports', {hits:[{
   "date_time":"2015-02-07T01:00:00-05:00",
   "project_id":"TCGA-OV",
   "project_name":"Ovarian Serous Cystadenocarcinoma",
   "program":"TCGA",
   "primary_site":"Ovary",
   "disease_type":"Ovary cancer",
   "size":287542354543,
   "count":145332,
   "data_types":[
      {
         "data_type":"Raw sequencing data",
         "size":4632,
         "count":533
      },
      {
         "data_type":"Clinical",
         "size":23454544,
         "count":45332
      }
   ],
   "data_subtypes":[
      {
         "data_subtype":"Genotypes",
         "size":4632,
         "count":533
      },
      {
         "data_subtype":"Unaligned sequencing reads",
         "size":23454544,
         "count":45332
      }
   ],
   "experimental_strategies":[
      {
         "experimental_strategy":"WGS",
         "size":2515151,
         "count":3242
      },
      {
         "experimental_strategy":"N/A",
         "size":3424232,
         "count":232
      }
   ],
   "data_formats":[
      {
         "data_format":"FASTQ",
         "size":4632,
         "count":533
      },
      {
         "data_format":"BAM",
         "size":23454544,
         "count":45332
      }
   ],
   "data_access":[
      {
         "access":"open",
         "size":23454544,
         "count":45332
      },
      {
         "access":"protected",
         "size":23454544,
         "count":45332
      }
   ],
   "tags":[
      {
         "tag":"somatic",
         "size":23454544,
         "count":45332
      },
      {
         "tag":"germline",
         "size":23454544,
         "count":45332
      }
   ],
   "platforms":[
      {
         "platform":"Illumina GA",
         "size":23454544,
         "count":45332
      },
      {
         "platform":"Affymetrix SNP Array 6.0",
         "size":23454544,
         "count":45332
      }
   ],
   "centers":[
      {
         "center":"BCGSC",
         "size":23454544,
         "count":45332
      },
      {
         "center":"BCGSC",
         "size":23454544,
         "count":45332
      }
   ],
   "user_access_types":[ // this is derived from user_id information from the data download log file, it's anonymous user when there is no user_id, otherwise, it's authenticated user which is further divided into open file or protected file. See examples below
      {
         "user_access_type":"authenticated user / open file",
         "size":7424232,
         "count":52
      },
      {
         "user_access_type":"authenticated user / protected file",
         "size":3424232,
         "count":232
      },
      {
         "user_access_type":"anonymous user",
         "size":3424232,
         "count":232
      }
   ],
   "client_agents":[
      {
         "client_agent":"Chrome",
         "size":3424232,
         "count":232
      },
      {
         "client_agent":"Firefox",
         "size":3424232,
         "count":232
      }
   ],
   "is_data_file":[
      {
         "is_data_file":true,
         "size":423424232,
         "count":2132
      },
      {
         "is_data_file":false,
         "size":342232,
         "count":23
      }
   ],
   "countries":[  // this is derived from user's IP address in the download log file
      {
         "country":"United States of America",
         "size":3424232,
         "count":232
      },
      {
         "country":"United Kingdom",
         "size":3424232,
         "count":232
      },
      {
         "country":"Canada",
         "size":3424232,
         "count":232
      }
   ],
   "continents":[  // this is derived from user's IP address in the download log file
      {
         "continent":"North America",
         "size":3424232,
         "count":232
      },
      {
         "continent":"Europe",
         "size":3424232,
         "count":232
      }
   ]
}]})
      .service("ReportsService", ReportsService);
}