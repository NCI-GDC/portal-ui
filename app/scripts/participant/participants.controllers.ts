module ngApp.participants.controllers {
  import IParticipant = ngApp.participants.models.IParticipant;
  import IParticipants = ngApp.participants.models.IParticipants;
  import ICoreService = ngApp.core.services.ICoreService;
  import ILocationService = ngApp.components.location.services.ILocationService;
  import IGDCConfig = ngApp.IGDCConfig;

  export interface IParticipantController {
    participant: IParticipant;
    annotationIds: string[];
    clinicalFileId: string;
    DownloadClinicalXML(): void;
  }

  class ParticipantController implements IParticipantController {
    annotationIds: string[];
    clinicalFileId: string;
    /* @ngInject */
    constructor(public participant: IParticipant,
                private CoreService: ICoreService,
                private LocationService: ILocationService,
                private $filter: ng.IFilterService,
                private ExperimentalStrategyNames,
                private DataTypeNames,
                private config: IGDCConfig) {
      CoreService.setPageTitle("Case", participant.case_id);

      this.annotationIds = _.map(this.participant.annotations, (annotation) => {
        return annotation.annotation_id;
      });

      var clinicalFile = _.find(this.participant.files, (file) => {
        return file.data_subtype.toLowerCase() === "clinical data";
      });

      if (clinicalFile) {
        this.clinicalFileId = clinicalFile.file_id;
      }

      this.experimentalStrategies = _.reduce(ExperimentalStrategyNames.slice(), function(result, name) {
        var strat = _.find(participant.summary.experimental_strategies, (item) => {
          return item.experimental_strategy.toLowerCase() === name.toLowerCase();
        });

        if (strat) {
          result.push(strat);
        }

        return result;
      }, []);

      this.dataTypes = _.reduce(DataTypeNames.slice(), function(result, name) {
        var type = _.find(participant.summary.data_types, (item) => {
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
                    field: "cases.case_id",
                    value: [
                      participant.case_id
                    ]
                  },
                  {
                    field: "files.experimental_strategy",
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
                    field: "cases.case_id",
                    value: [
                      participant.case_id
                    ]
                  },
                  {
                    field: "files.data_type",
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
      .module("participants.controller", [
        "participants.services",
        "core.services"
      ])
      .controller("ParticipantController", ParticipantController);
}
