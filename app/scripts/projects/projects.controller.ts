module ngApp.projects.controllers {
  import IProject = ngApp.projects.models.IProject;
  import IProjects = ngApp.projects.models.IProjects;
  import IProjectsService = ngApp.projects.services.IProjectsService;
  import ICoreService = ngApp.core.services.ICoreService;

  export interface IProjectsController {
    projects: IProjects;
  }


  interface IProjectsScope extends ng.IScope {
    projectColumns:Object[];
    projectColumnIsEnabled(id):Boolean;
  }


  class ProjectsController implements IProjectsController {
    projects: IProjects;
    projectColumns: any[];
    projectColumnIsEnabled(columnId:any);

    /* @ngInject */
    constructor(private $scope: IProjectsScope, private ProjectsService: IProjectsService, private CoreService: ICoreService, TableService) {
      CoreService.setPageTitle("Projects");
      $scope.$on("$locationChangeSuccess", (event, next) => {
        if (next.indexOf("projects") !== -1) {
          this.refresh();
        }
      });
      $scope.$on("gdc-user-reset", () => {
        this.refresh();
      });

      this.projectColumns = [
      {
        name:"Code",
        id:"code",
        enabled: true
      },
      {
        name:"Disease Type",
        id:"disease_type",
        enabled: true
      },
      {
        name:"Program",
        id:"program",
        enabled: true
      },
      {
        name:"Participants",
        id:"participants",
        enabled: true
      },
      {
        name:"Available Data Files per Data Type",
        id:"available_data_files",
        enabled: true
      },
      {
        name:"Status",
        id:"status",
        enabled: true
      },
      {
        name:"Last Update",
        id:"last_update",
        enabled: true
      }
      ];

      this.projectColumnIsEnabled = function(columnId) {
        var projectColumns = this.projectColumns;
        return TableService.objectWithMatchingIdInArrayIsEnabled(projectColumns,columnId);
      }
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
        "core.services"
      ])
      .controller("ProjectsController", ProjectsController)
      .controller("ProjectController", ProjectController);
}
