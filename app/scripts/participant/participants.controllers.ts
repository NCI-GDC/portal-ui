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
    constructor(
      public participant: IParticipant,
      private CoreService: ICoreService,
      public numCasesAggByProject: Array<Object>,
      private LocationService: ILocationService,
      private $filter: ng.IFilterService,
      private ExperimentalStrategyNames: string[],
      private DATA_CATEGORIES,
      private config: IGDCConfig
    ) {
      CoreService.setPageTitle("Case", participant.case_id);

      this.participant = participant;
      this.pluck = (array, property) => array.map(x => x[property]);

      this.activeClinicalTab = 'demographic';
      this.setClinicalTab = (tab) => {
        this.activeClinicalTab = tab;
      };

      this.annotationIds = _.map(this.participant.annotations, (annotation) => {
        return annotation.annotation_id;
      });

      this.clinicalFile = _.find(this.participant.files, (file) => {
        return (file.data_subtype || '').toLowerCase() === "clinical data";
      });

      this.experimentalStrategies = _.reduce(ExperimentalStrategyNames.slice(), function(result, name) {
        var strat = _.find(participant.summary.experimental_strategies, (item) => {
          return item.experimental_strategy.toLowerCase() === name.toLowerCase();
        });

        if (strat) {
          result.push(strat);
        }

        return result;
      }, []);

      this.clinicalDataExportFilters = {
        'cases.case_id': participant.case_id
      };
      this.clinicalDataExportExpands = ['demographic', 'diagnoses', 'diagnoses.treatments', 'family_histories', 'exposures'];
      this.hasNoClinical = ! this.clinicalDataExportExpands.some((field) => (participant[field] || []).length > 0);
      this.clinicalDataExportFileName = 'clinical.case-' + participant.case_id;

      this.dataCategories = Object.keys(this.DATA_CATEGORIES).reduce((acc, key) => {
        var type = _.find(participant.summary.data_categories, (item) =>
          item.data_category === this.DATA_CATEGORIES[key].full
        );

        return acc.concat(type || {
          data_category: this.DATA_CATEGORIES[key].full,
          file_count: 0
        });
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

      this.dataCategoriesConfig = {
        sortKey: "file_count",
        displayKey: "data_category",
        defaultText: "data category",
        hideFileSize: true,
        pluralDefaultText: "data categories",
        state: {
          name: "search.files"
        },
        blacklist: ["structural rearrangement", "dna methylation"],
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
                    field: "files.data_category",
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

      // add project information to files for checking cart access
      this.participant.files = this.participant.files.map(x =>
        _.extend(x, { cases: [{ project: this.participant.project }] })
      );

      this.renderReact();
    }

    jumpToAnchor(id) {
      let getOffset = elem => {
        let box = elem.getBoundingClientRect();

        let body = document.body;
        let docEl = document.documentElement;

        let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        let clientTop = docEl.clientTop || body.clientTop || 0;

        let top = box.top + scrollTop - clientTop;

        return Math.round(top);
      };

      window.location.hash = id;
      setTimeout(() => {
        window.scrollTo(
          0,
          getOffset(document.getElementById(id)) - 160
        );
      }, 10);
    }

    renderReact () {
      let numCasesAggByProject = this.numCasesAggByProject.reduce((acc, b) => Object.assign(acc, {[b.key]: b.doc_count}), {});
      let totalNumCases = Object.keys(numCasesAggByProject).reduce((sum, b) => sum + numCasesAggByProject[b], 0);

      let el = document.getElementById('frequent-mutations');

      if (el) {
        ReactDOM.render(
          React.createElement(ReactComponents.FrequentMutationsContainer, {
            $scope: this,
            numCasesAggByProject,
            totalNumCases,
            projectId: this.participant.project.project_id,
            showSurvivalPlot: false,
          }),
          document.getElementById('frequent-mutations')
        );
      }
    }

  }

  angular
      .module("participants.controller", [
        "participants.services",
        "core.services"
      ])
      .controller("ParticipantController", ParticipantController);
}
