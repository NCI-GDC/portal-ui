module ngApp.projects {
  "use strict";

  import IProjectsService = ngApp.projects.services.IProjectsService;
  import IProject = ngApp.projects.models.IProject;

  /* ngInject */
  function projectsConfig($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
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
        project: ($stateParams: ng.ui.IStateParamsService, ProjectsService: IProjectsService): ng.IPromise<IProject> => {
          return ProjectsService.getProject($stateParams["projectId"], {
            fields: [
              "name",
              "summary.data_types.file_count",
              "summary.data_types.data_type",
              "summary.data_types.participant_count",
              "summary.experimental_strategies.file_count",
              "summary.experimental_strategies.participant_count",
              "summary.experimental_strategies.experimental_strategy",
              "summary.participant_count",
              "summary.file_size",
              "summary.file_count",
              "program.name",
              "primary_site",
              "project_id"
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
