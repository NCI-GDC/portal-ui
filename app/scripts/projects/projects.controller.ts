module ngApp.projects.controllers {
  import IProject = ngApp.projects.models.IProject;
  import IProjects = ngApp.projects.models.IProjects;
  import IProjectsService = ngApp.projects.services.IProjectsService;
  import ICoreService = ngApp.core.services.ICoreService;
  import ITableService = ngApp.components.tables.services.ITableService;
  import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;
  import ILocationService = ngApp.components.location.services.ILocationService;
  import IAnnotationsService = ngApp.annotations.services.IAnnotationsService;
  import IProjectsState = ngApp.projects.services.IProjectsState;

  export interface IProjectsController {
    projects: IProjects;
    ProjectsState: IProjectsState;
    tabSwitch: boolean;
    numPrimarySites: number;
  }

  export interface IProjectScope extends ng.IScope {
    tableConfig:TableiciousConfig ;
  }

  class ProjectsController implements IProjectsController {
    projects: IProjects;
    projectColumns: any[];
    tabSwitch: boolean = false;
    numPrimarySites: number = 0;

    /* @ngInject */
    constructor(private $scope: IProjectScope, private ProjectsService: IProjectsService,
                private CoreService: ICoreService, private ProjectTableModel: TableiciousConfig,
                private $state: ng.ui.IStateService, public ProjectsState: IProjectsState,
                private LocationService: ILocationService, private $filter, private ProjectsGithutConfig, private ProjectsGithutColumns, private ProjectsGithut) {

      CoreService.setPageTitle("Projects");
      $scope.$on("$locationChangeSuccess", (event, next) => {
        if (next.indexOf("projects") !== -1) {
          this.refresh();
        }
      });
      $scope.$on("$stateChangeSuccess", (event, toState: any) => {
        if (toState.name.indexOf("projects") !== -1) {
          this.ProjectsState.setActive("tabs", toState.name.split(".")[1], "active");
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
          expand: this.ProjectTableModel.expand,
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
            this.drawGraph(this.projects);
          } else if(this.ProjectsState.tabs.summary.active || this.numPrimarySites === 0) {
            this.numPrimarySites = _.unique(this.projects.hits, (project) => { return project.primary_site; }).length;
          }
        });
      } else {
        this.tabSwitch = false;
        if (this.ProjectsState.tabs.graph.active) {
          this.drawGraph(this.projects);
        }
      }
    }

    drawGraph(data) {
      var githut = this.ProjectsGithut(data);

      this.githutData = githut.data;
      this.githutConfig = githut.config;
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
    constructor(public project: IProject, private CoreService: ICoreService,
                private AnnotationsService: IAnnotationsService,
                private ExperimentalStrategyNames,
                private DataTypeNames,
                private $filter: ng.ui.IFilterService) {
      CoreService.setPageTitle("Project " + project.project_id);

      this.experimentalStrategies = _.reduce(ExperimentalStrategyNames.slice(), function(result, name) {
        var strat = _.find(project.summary.experimental_strategies, (item) => {
          return item.experimental_strategy.toLowerCase() === name.toLowerCase();
        });

        if (strat) {
          result.push(strat);
        }

        return result;
      }, []);

      this.dataTypes = _.reduce(DataTypeNames.slice(), function(result, name) {
        var type = _.find(project.summary.data_types, (item) => {
          return item.data_type.toLowerCase() === name.toLowerCase();
        });

        if (type) {
          result.push(type);
        } else {
          result.push({
            data_type: name,
            file_count: 0,
            case_count: 0
          });
        }

        return result;
      }, []);

      this.expStratConfig = {
        sortKey: "file_count",
        showCase: true,
        displayKey: "experimental_strategy",
        defaultText: "experimental strategy",
        pluralDefaultText: "experimental strategies",
        hideFileSize: true,
        noResultsText: "No files with Experimental Strategies",
        state: {
          name: "search.files"
        },
        filters: {
          "default": {
            params: {
              filters: function(value) {
                return $filter("makeFilter")([
                  {
                    name: "cases.project.project_id",
                    value: [
                      project.project_id
                    ]
                  },
                  {
                    name: "files.experimental_strategy",
                    value: [
                      value
                    ]
                  }
                ], true);
              }
            }
          }
        }
      };

      this.dataTypesConfig = {
        sortKey: "file_count",
        showCase: true,
        displayKey: "data_type",
        defaultText: "data type",
        hideFileSize: true,
        pluralDefaultText: "data types",
        state: {
          name: "search.files"
        },
        filters: {
          "default": {
            params: {
              filters: function(value) {
                return $filter("makeFilter")([
                  {
                    name: "cases.project.project_id",
                    value: [
                      project.project_id
                    ]
                  },
                  {
                    name: "files.data_type",
                    value: [
                      value
                    ]
                  }
                ], true);
              }
            }
          }
        }
      };

      AnnotationsService.getAnnotations({
        filters: {
          content: [
            {
              content: {
                field: "project.project_id",
                value: project.project_id
              },
              op: "in"
            }
          ],
          op: "and"
        },
        size: 0
      }).then((data) => {
        this.project.annotations = data;
      });
    }
  }

  angular
      .module("projects.controller", [
        "projects.services",
        "core.services",
        "projects.table.model",
        "projects.githut.config",
        "annotations.services"
      ])
      .controller("ProjectsController", ProjectsController)
      .controller("ProjectController", ProjectController);
}

