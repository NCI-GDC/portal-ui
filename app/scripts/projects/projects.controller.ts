module ngApp.projects.controllers {
  import IProject = ngApp.projects.models.IProject;
  import IProjects = ngApp.projects.models.IProjects;
  import IProjectsService = ngApp.projects.services.IProjectsService;
  import ICoreService = ngApp.core.services.ICoreService;
  import ITableService = ngApp.components.tables.services.ITableService;
  import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;

  export interface IProjectsController {
    projects: IProjects;
  }

  export interface IProjectScope extends ng.IScope {
    tableConfig:TableiciousConfig ;
  }


  class ProjectsController implements IProjectsController {
    projects: IProjects;
    projectColumns: any[];

    /* @ngInject */
    constructor(private $scope: IProjectScope, private ProjectsService: IProjectsService, private CoreService: ICoreService, ProjectTableModel) {
      CoreService.setPageTitle("Projects");
      $scope.$on("$locationChangeSuccess", (event, next) => {
        if (next.indexOf("projects") !== -1) {
          this.refresh();
        }
      });
      $scope.$on("gdc-user-reset", () => {
        this.refresh();
      });


      $scope.tableConfig = ProjectTableModel;

      this.refresh();
    }

    refresh() {
      this.ProjectsService.getProjects({
        fields: [
          "disease_type",
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
        ],
        facets: [
          "status",
          "program",
          "disease_type",
          "_summary._experimental_data.experimental_type",
          "_summary._analyzed_data.data_type"
        ],
        size: 100
      }).then((data) => this.projects = data);
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
        "core.services",
        "projects.table.model"
      ])
      .controller("ProjectsController", ProjectsController)
      .controller("ProjectController", ProjectController);
}
