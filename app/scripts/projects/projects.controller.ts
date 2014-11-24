module ngApp.projects.controllers {
  import IProject = ngApp.projects.models.IProject;
  import IProjects = ngApp.projects.models.IProjects;
  import IProjectsService = ngApp.projects.services.IProjectsService;
  import ICoreService = ngApp.core.services.ICoreService;

  export interface IProjectsController {
    projects: IProjects;
  }

  class ProjectsController implements IProjectsController {
    /* @ngInject */
    constructor(private $scope, public projects: IProjects, private ProjectsService: IProjectsService, private CoreService: ICoreService) {
      CoreService.setPageTitle("Projects");
      this.setup();

    }

    setup() {
      this.$scope.$on('$locationChangeSuccess', (event, next) => {
        if (next.indexOf('projects') !== -1) {
          this.ProjectsService.getProjects().then((data) => this.projects = data);
        }
      });
    }
  }

  export interface IProjectController {
    project: IProject;
  }

  class ProjectController implements IProjectController {
    /* @ngInject */
    constructor(public project: IProject, private CoreService: ICoreService) {
      CoreService.setPageTitle("Project " + project.project_code);
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
