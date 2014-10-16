module ngApp.projects.controllers {
  import IProject = ngApp.projects.models.IProject;
  import IProjects = ngApp.projects.models.IProjects;

  export interface IProjectsController {
    projects: IProjects;
  }

  class ProjectsController implements IProjectsController {
    /* @ngInject */
    constructor(public projects: IProjects) {}
  }

  export interface IProjectController {
    project: IProject;
  }

  class ProjectController implements IProjectController {
    /* @ngInject */
    constructor(public project: IProject) {}
  }

  angular
      .module("projects.controller", [
        "projects.services"
      ])
      .controller("ProjectsController", ProjectsController)
      .controller("ProjectController", ProjectController);
}
