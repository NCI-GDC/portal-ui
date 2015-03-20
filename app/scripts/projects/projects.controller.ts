module ngApp.projects.controllers {
  import IProject = ngApp.projects.models.IProject;
  import IProjects = ngApp.projects.models.IProjects;
  import IProjectsService = ngApp.projects.services.IProjectsService;
  import ICoreService = ngApp.core.services.ICoreService;
  import ITableService = ngApp.components.tables.services.ITableService;
  import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;
  import ILocationService = ngApp.components.location.services.ILocationService;

  export interface IProjectsController {
    projects: IProjects;
    ProjectsState: IProjectsState;
    tabSwitch: boolean;
  }

  export interface IProjectScope extends ng.IScope {
    tableConfig:TableiciousConfig ;
  }

  class ProjectsController implements IProjectsController {
    projects: IProjects;
    projectColumns: any[];
    tabSwitch: boolean = false;

    /* @ngInject */
    constructor(private $scope: IProjectScope, private ProjectsService: IProjectsService,
                private CoreService: ICoreService, private ProjectTableModel: TableiciousConfig,
                private $state: ng.ui.IStateService, public ProjectsState: IProjectsState,
                private LocationService: ILocationService, private $filter, private ProjectsGithutConfig, private ProjectsGithutColumns,private ProjectsGithut) {

      CoreService.setPageTitle("Projects");
      $scope.$on("$locationChangeSuccess", (event, next) => {
        if (next.indexOf("projects") !== -1) {
          this.refresh();
        }
      });
      $scope.$on("gdc-user-reset", () => {
        this.refresh();
      });

      var data = $state.current.data || {};
      this.ProjectsState.setActive("tabs", data.tab);
      $scope.tableConfig = ProjectTableModel;

      this.refresh();
    }

    refresh() {
      if (!this.tabSwitch) {
        this.ProjectsService.getProjects({
          fields: this.ProjectTableModel.fields,
          facets: [
            "disease_type",
            "program.name",
            "project_id",
            "primary_site",
            "summary.experimental_strategies.experimental_strategy",
            "summary.data_types.data_type"
          ],
          size: 100
        }).then((data) => {
          this.projects = data;

          if (this.ProjectsState.tabs.graph.active) {
            drawTable(data);
          }
        });
      } else {
        this.tabSwitch = false;
        if (this.ProjectsState.tabs.graph.active) {
          drawTable(this.projects);
        }
      }
      
      var $scope = this.$scope;
      var ProjectsGithut = this.ProjectsGithut;
      
      function drawTable(data){
        var githut = ProjectsGithut(data);
        console.log("GITHUUUT!",githut);
        
        $scope.githutData = githut.data;
        $scope.githutConfig = githut.config;
      }

    }

    select(section: string, tab: string) {
      this.ProjectsState.setActive(section, tab);
      this.setState(tab);
    }

    // TODO Load data lazily based on active tab
    setState(tab: string) {
      // Changing tabs and then navigating to another page
      // will cause this to fire.
      if (tab && (this.$state.current.name.match("projects."))) {
        this.tabSwitch = true;
        this.$state.go("projects." + tab, this.LocationService.search(), {inherit: false});
      }
    }
  }

  export interface IProjectController {
    project: IProject;
  }

  class ProjectController implements IProjectController {
    /* @ngInject */
    constructor(public project: IProject, private CoreService: ICoreService) {
      CoreService.setPageTitle("Project " + project.project_id);
    }
  }

  angular
      .module("projects.controller", [
        "projects.services",
        "core.services",
        "projects.table.model",
        "projects.githut.config",
        "GDC.PC"
      ])
      .controller("ProjectsController", ProjectsController)
      .controller("ProjectController", ProjectController);
}

var primary_sites = [];
