module ngApp.cases.controllers {
  import ICase = ngApp.cases.models.ICase;
  import ICases = ngApp.cases.models.ICases;
  import ICoreService = ngApp.core.services.ICoreService;
  import ILocationService = ngApp.components.location.services.ILocationService;
  import IGDCConfig = ngApp.IGDCConfig;

  export interface ICaseController {
    kase: ICase;
    annotationIds: string[];
    clinicalFileId: string;
    DownloadClinicalXML(): void;
  }

  class CaseController implements ICaseController {
    annotationIds: string[];
    clinicalFileId: string;
    /* @ngInject */
    constructor(public kase: ICase,
                private CoreService: ICoreService,
                private LocationService: ILocationService,
                private $filter: ng.IFilterService,
                private ExperimentalStrategyNames,
                private DataTypeNames,
                private config: IGDCConfig) {
      CoreService.setPageTitle("Case " + kase.case_id);

      this.annotationIds = _.map(this.kase.annotations, (annotation) => {
        return annotation.annotation_id;
      });

      var clinicalFile = _.find(this.kase.files, (file) => {
        return file.data_subtype.toLowerCase() === "clinical data";
      });

      if (clinicalFile) {
        this.clinicalFileId = clinicalFile.file_id;
      }

      this.experimentalStrategies = _.reduce(ExperimentalStrategyNames.slice(), function(result, name) {
        var strat = _.find(kase.summary.experimental_strategies, (item) => {
          return item.experimental_strategy.toLowerCase() === name.toLowerCase();
        });

        if (strat) {
          result.push(strat);
        }

        return result;
      }, []);

      this.dataTypes = _.reduce(DataTypeNames.slice(), function(result, name) {
        var type = _.find(kase.summary.data_types, (item) => {
          return item.data_type.toLowerCase() === name.toLowerCase();
        });

        if (type) {
          result.push(type);
        } else {
          result.push({
            data_type: name,
            file_count: 0
          });
        }

        return result;
      }, []);

      this.expStratConfig = {
        sortKey: "file_count",
        displayKey: "experimental_strategy",
        defaultText: "experimental strategy",
        pluralDefaultText: "experimental strategies",
        hideFileSize: true,
        noResultsText: "No files with Experimental Strategies",
        state: {
          name: "search.files"
        },
        filters: {
          "default": {
            params: {
              filters: function(value) {
                return $filter("makeFilter")([
                  {
                    name: "cases.case_id",
                    value: [
                      kase.case_id
                    ]
                  },
                  {
                    name: "files.experimental_strategy",
                    value: [
                      value
                    ]
                  }
                ], true);
              }
            }
          }
        }
      };

      this.dataTypesConfig = {
        sortKey: "file_count",
        displayKey: "data_type",
        defaultText: "data type",
        hideFileSize: true,
        pluralDefaultText: "data types",
        state: {
          name: "search.files"
        },
        filters: {
          "default": {
            params: {
              filters: function(value) {
                return $filter("makeFilter")([
                  {
                    name: "cases.case_id",
                    value: [
                      kase.case_id
                    ]
                  },
                  {
                    name: "files.data_type",
                    value: [
                      value
                    ]
                  }
                ], true);
              }
            }
          }
        }
      };

    }

  }

  angular
      .module("cases.controller", [
        "cases.services",
        "core.services"
      ])
      .controller("CaseController", CaseController);
}
