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
      .value('dummyReports', {
        "took" : 1,
        "timed_out" : false,
        "_shards" : {
          "total" : 5,
          "successful" : 5,
          "failed" : 0
        },
        "hits" : {
          "total" : 4,
          "max_score" : 1.0,
          "hits" : [ {
            "_index" : "test",
            "_type" : "report",
            "_id" : "3",
            "_score" : 1.0,
            "_source":{        "date": "2015-02-07T01:00:00-05:00",		"project_id": "OV",	    "program": "TCGA",	    "primary_site": "Ovary",	    "disease_type": "",	    "size_in_mb": 2875423,	    "count": 145332,	    "data_types": [	        {	            "data_type": "raw_seq",	            "size_in_mb": 4632,	            "count": 533	        },	        {	        	"data_type": "ssm",	            "size_in_mb": 23454544,	            "count": 45332	        }	    ],	    "experimental_strategies": [	        {	        	"experimental_strategy": "WGS",	            "size_in_mb": 2515151,	            "count": 3242	        },	        {	            "experimental_strategy": "N/A",	            "size_in_mb": 3424232,	            "count": 232	        }	    ],	    "user_types": [	        {	            "user_type": "logged_in_user",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	            "user_type": "anonymous",	            "size_in_mb": 3424232,	            "count": 232	        }	    ],	    "countries": [	        {	        	"country": "US",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	            "country": "UK",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	        	"country": "CA",	            "size_in_mb": 3424232,	            "count": 232	        }	    ],	    "continents": [	        {	        	"continent": "North America",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	        	"continent": "Europe",	            "size_in_mb": 3424232,	            "count": 232	        }	    ]}
          }, {
            "_index" : "test",
            "_type" : "report",
            "_id" : "2",
            "_score" : 1.0,
            "_source":{        "date": "2015-02-06T01:00:00-05:00",		"project_id": "GBM",	    "program": "TCGA",	    "primary_site": "Brain",	    "disease_type": "",	    "size_in_mb": 3875423,	    "count": 145332,	    "data_types": [	        {	            "data_type": "raw_seq",	            "size_in_mb": 4632643,	            "count": 533	        },	        {	        	"data_type": "ssm",	            "size_in_mb": 23454544,	            "count": 45332	        }	    ],	    "experimental_strategies": [	        {	        	"experimental_strategy": "WGS",	            "size_in_mb": 2515151,	            "count": 3242	        },	        {	            "experimental_strategy": "N/A",	            "size_in_mb": 3424232,	            "count": 232	        }	    ],	    "user_types": [	        {	            "user_type": "logged_in_user",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	            "user_type": "anonymous",	            "size_in_mb": 3424232,	            "count": 232	        }	    ],	    "countries": [	        {	        	"country": "US",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	            "country": "UK",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	        	"country": "CA",	            "size_in_mb": 3424232,	            "count": 232	        }	    ],	    "continents": [	        {	        	"continent": "North America",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	        	"continent": "Europe",	            "size_in_mb": 3424232,	            "count": 232	        }	    ]}
          }, {
            "_index" : "test",
            "_type" : "report",
            "_id" : "1",
            "_score" : 1.0,
            "_source":{        "date": "2015-02-06T01:00:00-05:00",		"project_id": "OV",	    "program": "TCGA",	    "primary_site": "Ovary",	    "disease_type": "",	    "size_in_mb": 2875423,	    "count": 145332,	    "data_types": [	        {	            "data_type": "raw_seq",	            "size_in_mb": 4632643,	            "count": 533	        },	        {	        	"data_type": "ssm",	            "size_in_mb": 454544,	            "count": 45332	        }	    ],	    "experimental_strategies": [	        {	        	"experimental_strategy": "WGS",	            "size_in_mb": 2515151,	            "count": 3242	        },	        {	            "experimental_strategy": "N/A",	            "size_in_mb": 3424232,	            "count": 232	        }	    ],	    "user_types": [	        {	            "user_type": "logged_in_user",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	            "user_type": "anonymous",	            "size_in_mb": 3424232,	            "count": 232	        }	    ],	    "countries": [	        {	        	"country": "US",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	            "country": "UK",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	        	"country": "CA",	            "size_in_mb": 3424232,	            "count": 232	        }	    ],	    "continents": [	        {	        	"continent": "North America",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	        	"continent": "Europe",	            "size_in_mb": 3424232,	            "count": 232	        }	    ]}
          }, {
            "_index" : "test",
            "_type" : "report",
            "_id" : "4",
            "_score" : 1.0,
            "_source":{        "date": "2015-02-07T01:00:00-05:00",		"project_id": "GBM",	    "program": "TCGA",	    "primary_site": "Brain",	    "disease_type": "",	    "size_in_mb": 3875423,	    "count": 145332,	    "data_types": [	        {	            "data_type": "raw_seq",	            "size_in_mb": 4632643,	            "count": 533	        },	        {	        	"data_type": "ssm",	            "size_in_mb": 23454544,	            "count": 45332	        }	    ],	    "experimental_strategies": [	        {	        	"experimental_strategy": "WGS",	            "size_in_mb": 2515151,	            "count": 3242	        },	        {	            "experimental_strategy": "N/A",	            "size_in_mb": 3424232,	            "count": 232	        }	    ],	    "user_types": [	        {	            "user_type": "logged_in_user",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	            "user_type": "anonymous",	            "size_in_mb": 3424232,	            "count": 232	        }	    ],	    "countries": [	        {	        	"country": "US",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	            "country": "UK",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	        	"country": "CA",	            "size_in_mb": 3424232,	            "count": 232	        }	    ],	    "continents": [	        {	        	"continent": "North America",	            "size_in_mb": 3424232,	            "count": 232	        },	        {	        	"continent": "Europe",	            "size_in_mb": 3424232,	            "count": 232	        }	    ]}
          } ]
        }
      })
      .service("ReportsService", ReportsService);
}