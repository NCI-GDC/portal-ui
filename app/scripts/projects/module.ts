module ngApp.projects {
  "use strict";

  import IProjectsService = ngApp.projects.services.IProjectsService;
  import IProject = ngApp.projects.models.IProject;
  import IGDCConfig = ngApp.IGDCConfig;

  /* ngInject */
  function projectsConfig(
    $stateProvider: ng.ui.IStateProvider,
    $urlRouterProvider: ng.ui.IUrlRouterProvider
  ) {
    $urlRouterProvider.when("/projects", "/projects/t");

    $stateProvider.state("projects", {
      url: "/projects?filters",
      controller: "ProjectsController as prsc",
      templateUrl: "projects/templates/projects.html",
      reloadOnSearch: false
    });

    $stateProvider.state("projects.table", {
      url: "/t",
      data: {
        tab: "table"
      },
      reloadOnSearch: false
    });

    $stateProvider.state("projects.graph", {
      url: "/g",
      data: {
        tab: "graph"
      },
      reloadOnSearch: false
    });

    $stateProvider.state("project", {
      url: "/projects/:projectId",
      controller: "ProjectController as prc",
      templateUrl: "projects/templates/project.html",
      resolve: {
        mutatedGenesProject: (
          $stateParams: ng.ui.IStateParamsService,
          $http: ng.IHttpService,
          config: IGDCConfig
        ): ng.IPromise<IProject> => {
          return $http({
            method: 'POST',
            url: `${config.es_host}/${config.es_index_version}-gene-centric/gene-centric/_search`,
            headers: {'Content-Type' : 'application/json'},
            data: {
              "query": {
                "nested": {
                  "path": "case",
                  "score_mode": "sum",
                  "query": {
                    "function_score": {
                      "query": {
                        "terms": {
                          "case.project.project_id": [
                            $stateParams["projectId"]
                          ]
                        }
                      },
                      "boost_mode": "replace",
                      "script_score": {
                        "script": "doc['case.project.project_id'].empty ? 0 : 1"
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
        mostAffectedCases: (
          $stateParams: ng.ui.IStateParamsService,
          $http: ng.IHttpService,
          config: IGDCConfig
        ): ng.IPromise => {
          return $http({
            method: 'POST',
            url: `${config.es_host}/${config.es_index_version}-case-centric/case-centric/_search`,
            headers: {'Content-Type' : 'application/json'},
            data: {
              "post_filter": {
                "terms": {
                  "project.project_id": [$stateParams["projectId"]]
                }
              },
              "query": {
                "nested": {
                  "path": "gene",
                  "score_mode": "sum",
                  "query": {
                    "function_score": {
                      "query": {
                        "match_all": {}
                      },
                      "boost_mode": "replace",
                      "script_score": {
                        "script": "doc['gene.ssm.ssm_id'].empty ? 0 : 1"
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
                            $stateParams["projectId"]
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
        survivalData: (
          $stateParams: ng.ui.IStateParamsService,
          $http: ng.IHttpService,
          config: IGDCConfig
        ): ng.IPromise => {
          return $http({
            method: 'GET',
            url: `${config.api}/analysis/survival?filters={"op":"=","content":{"field":"cases.project.project_id","value":"${$stateParams["projectId"]}"}}`,
            headers: {'Content-Type' : 'application/json'},
          }).then(data => {
            return data.data;
            }, (err) => []);
        },
        project: ($stateParams: ng.ui.IStateParamsService, ProjectsService: IProjectsService): ng.IPromise<IProject> => {
          if (! $stateParams.projectId) {
            throw Error('Missing route parameter: projectId. Redirecting to 404 page.');
          }
          return ProjectsService.getProject($stateParams["projectId"], {
            fields: [
              "name",
              "program.name",
              "primary_site",
              "project_id",
              "disease_type",
              "summary.case_count",
              "summary.file_count"
            ],
            expand: [
              "summary.data_categories",
              "summary.experimental_strategies"
            ]
          });
        }
      }
    });
  }

  angular
      .module("ngApp.projects", [
        "projects.controller",
        "tables.services",
        "ui.router.state"
      ])
      .config(projectsConfig);
}
