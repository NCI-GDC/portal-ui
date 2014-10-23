module ngApp.projects.controllers {
  import IProject = ngApp.projects.models.IProject;
  import IProjects = ngApp.projects.models.IProjects;
  import ICoreService = ngApp.core.services.ICoreService;

  export interface IProjectsController {
    projects: IProjects;
  }

  class ProjectsController implements IProjectsController {
    /* @ngInject */
    constructor(public projects: IProjects, private CoreService: ICoreService) {
      CoreService.setPageTitle("Projects");
    }
  }

  export interface IProjectController {
    project: IProject;
  }

  class ProjectController implements IProjectController {
    /* @ngInject */
    constructor(public project: IProject, private CoreService: ICoreService) {
      CoreService.setPageTitle("Project " + project.code);
    }
  }

  angular
      .module("projects.controller", [
        "projects.services",
        "core.services"
      ])
      .controller("ProjectsController", ProjectsController)
      .controller("ProjectController", ProjectController);
}
