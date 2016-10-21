module ngApp.participants {
  "use strict";

  import IParticipantsService = ngApp.participants.services.IParticipantsService;
  import IParticipant = ngApp.participants.models.IParticipant;

  /* @ngInject */
  function participantsConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("case", {
      url: "/cases/:caseId?{bioId:any}",
      controller: "ParticipantController as pc",
      templateUrl: "participant/templates/participant.html",
      resolve: {
        numCasesAggByProject: (
          $stateParams: ng.ui.IStateParamsService,
          $http: ng.IHttpService,
          config: IGDCConfig
        ): ng.IPromise => {
          return $http({
            method: 'POST',
            url: `${config.es_host}/${config.es_index_version}-case-centric/case-centric/_search`,
            headers: {'Content-Type' : 'application/json'},
            data: {
              "aggs": {
                "project_ids": {
                  "terms": {
                    "field": "project.project_id"
                  }
                }
              }
            }
          }).then(data => {
            return data.data.aggregations.project_ids.buckets;
          });

        },
        frequentMutations: (
          $stateParams: ng.ui.IStateParamsService,
          $http: ng.IHttpService,
          config: IGDCConfig
        ): ng.IPromise => {
          return $http({
            method: 'POST',
            url: `${config.es_host}/${config.es_index_version}-ssm-centric/ssm-centric/_search`,
            headers: {'Content-Type' : 'application/json'},
            data: {
              "query": {
                "nested": {
                  "path": "occurrence",
                  "score_mode": "sum",
                  "query": {
                    "function_score": {
                      "query": {
                        "terms": {
                          "occurrence.case.project.project_id": [
                            $stateParams.caseId // TODO GET PROJECT FROM THIS CASE
                          ]
                        }
                      },
                      "boost_mode": "replace",
                      "script_score": {
                        "script": "doc['occurrence.case.project.project_id'].empty ? 0 : 1"
                      }
                    }
                  }
                }
              }
            }
          }).then(data => {
            return data.data.hits.hits;
          });
        },
        participant: ($stateParams: ng.ui.IStateParamsService, ParticipantsService: IParticipantsService): ng.IPromise<IParticipant> => {
          if (! $stateParams.caseId) {
            throw Error('Missing route parameter: caseId. Redirecting to 404 page.');
          }
          return ParticipantsService.getParticipant($stateParams["caseId"], {
            fields: [
              "case_id",
              "submitter_id",
              "annotations.annotation_id"
           ],
           expand: [
            "demographic",
            "diagnoses",
            "diagnoses.treatments",
            "exposures",
            "family_histories",
            "files",
            "project",
            "project.program",
            "summary",
            "summary.experimental_strategies",
            "summary.data_categories",
            "samples",
            "samples.portions",
            "samples.portions.analytes",
            "samples.portions.analytes.aliquots",
            "samples.portions.analytes.aliquots.annotations",
            "samples.portions.analytes.annotations",
            "samples.portions.submitter_id",
            "samples.portions.slides",
            "samples.portions.annotations",
            "samples.portions.center",
           ]
          });
        }
      }
    });
  }

  angular
      .module("ngApp.participants", [
        "participants.controller",
        "ui.router.state"
      ])
      .config(participantsConfig);
}
