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
              "program.name",
              "primary_site",
              "project_id",
              "disease_type"
            ],
            expand: [
              "summary",
              "summary.data_types",
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
