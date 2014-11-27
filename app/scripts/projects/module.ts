module ngApp.projects {
  "use strict";

  import IProjectsService = ngApp.projects.services.IProjectsService;
  import IProject = ngApp.projects.models.IProject;

  /* ngInject */
  function projectsConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("projects", {
      url: "/projects",
      controller: "ProjectsController as prsc",
      templateUrl: "projects/templates/projects.html",
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
              "project_uuid",
              "project_name",
              "status",
              "program",
              "project_code",
              "_summary._participant_count",
              "_summary._analyzed_data.data_type",
              "_summary._analyzed_data._participant_count",
              "_summary._analyzed_data._file_count",
              "_summary._experimental_data._participant_count",
              "_summary._experimental_data._file_count",
              "_summary._experimental_data.experimental_type"
            ]
          });
        }
      }
    });
  }

  angular
      .module("ngApp.projects", [
        "projects.controller",
        "ui.router.state"
      ])
      .config(projectsConfig);
}
