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
        numCasesAggByProject: (
          $stateParams: ng.ui.IStateParamsService,
          $http: ng.IHttpService,
          config: IGDCConfig
        ): ng.IPromise => {
          return $http({
            method: 'GET',
            url: `${config.api}/analysis/mutated_cases_count_by_project`,
            headers: {'Content-Type' : 'application/json'},
          }).then(data => {
            return data.data.aggregations.projects.buckets.reduce((acc, b) => {
              acc[b.key] = b.case_summary.case_with_ssm.doc_count;
              return acc;
            }, {});
          });
        },
        mostAffectedCases: (
          $stateParams: ng.ui.IStateParamsService,
          $http: ng.IHttpService,
          config: IGDCConfig
        ): ng.IPromise => {
          return $http({
            method: 'POST',
            url: `${config.api}/analysis/top_mutated_cases_by_project`,
            headers: {'Content-Type' : 'application/json'},
            data: {
              project_id: $stateParams["projectId"],
              fields: [
                'case_id',
                'gene.ssm.ssm_id',
                'summary.data_categories.data_category',
                'summary.data_categories.file_count',
                'project.primary_site',
                'demographic.gender',
                'diagnoses.days_to_last_follow_up',
              ].join()
            }
          }).then(({data}) => {
            return data.data.hits;
          });
        },
        survivalData: (
          $stateParams: ng.ui.IStateParamsService,
          $http: ng.IHttpService,
          config: IGDCConfig
        ): ng.IPromise => {
          return $http({
            method: 'GET',
            url: `${config.api}/analysis/survival?filters=[{"op":"=","content":{"field":"project.project_id.raw","value":"${$stateParams["projectId"]}"}}]`,
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
