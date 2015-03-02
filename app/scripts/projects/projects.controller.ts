module ngApp.projects.controllers {
  import IProject = ngApp.projects.models.IProject;
  import IProjects = ngApp.projects.models.IProjects;
  import IProjectsService = ngApp.projects.services.IProjectsService;
  import IProjectsPcService = ngApp.projects.pc.models.IProjectsPcService;
  import ICoreService = ngApp.core.services.ICoreService;
  import ITableService = ngApp.components.tables.services.ITableService;
  import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;

  export interface IProjectsController {
    projects: IProjects;
  }

  export interface IProjectScope extends ng.IScope {
    tableConfig:TableiciousConfig ;
    githutConfig: any;
    githutData: any;
  }

  class ProjectsController implements IProjectsController {
    projects: IProjects;

    /* @ngInject */
    constructor(private $scope: IProjectScope,
                private ProjectsService: IProjectsService,
                private ProjectsPcService: IProjectsPcService,
                private ProjectsPcColumns,
                private CoreService: ICoreService,
                ProjectTableModel) {

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
          "primary_site",
          "summary.file_size",
          "summary.participant_count",
          "summary.data_file_count",
          "summary.data_types.data_type",
          "summary.data_types.participant_count",
          "summary.data_types.file_count",
          "summary.experimental_strategies.participant_count",
          "summary.experimental_strategies.file_count",
          "summary.experimental_strategies.experimental_strategy"
        ],
        facets: [
          "program",
          "disease_type",
          "primary_site",
          "summary.experimental_strategies.experimental_strategy",
          "summary.data_types.data_type"
        ],
        size: 100
      }).then((data) => {
        this.projects = data;

        this.$scope.githutConfig = this.ProjectsPcService.getConfig(this.ProjectsPcColumns);
        this.$scope.githutData = d3.values(this.ProjectsPcService.getAggs(data.hits));
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
          "projects.directives",
    "core.services",
    "projects.table.model",
        "projects.pc.model"
  ])
  .controller("ProjectsController", ProjectsController)
  .controller("ProjectController", ProjectController);
}