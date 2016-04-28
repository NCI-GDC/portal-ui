module ngApp.projects.controllers {
  import IProject = ngApp.projects.models.IProject;
  import IProjects = ngApp.projects.models.IProjects;
  import IProjectsService = ngApp.projects.services.IProjectsService;
  import ICoreService = ngApp.core.services.ICoreService;
  import ITableService = ngApp.components.tables.services.ITableService;
  import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;
  import ILocationService = ngApp.components.location.ILocationService;
  import IAnnotationsService = ngApp.annotations.services.IAnnotationsService;
  import IProjectsState = ngApp.projects.services.IProjectsState;
  import IFacetService = ngApp.components.facets.services.IFacetService;

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
    loading: boolean = true;

    /* @ngInject */
    constructor(private $scope: IProjectScope, private $rootScope: IRootScope,
                private ProjectsService: IProjectsService,
                private CoreService: ICoreService, private ProjectsTableService: TableiciousConfig,
                private $state: ng.ui.IStateService, public ProjectsState: IProjectsState,
                private LocationService: ILocationService, private $filter,
                private ProjectsGithutConfig, private ProjectsGithutColumns, private ProjectsGithut,
                private FacetService: IFacetService
    ) {
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
      $scope.tableConfig = this.ProjectsTableService.model();

      this.refresh();
    }

    refresh() {
      this.loading = true;
      this.$rootScope.$emit('ShowLoadingScreen');
      var projectsTableModel = this.ProjectsTableService.model();
      if (!this.tabSwitch) {
        this.ProjectsService.getProjects({
          fields: projectsTableModel.fields,
          facets: this.FacetService.filterFacets(projectsTableModel.facets),
          size: 100
        }).then((data) => {
          this.loading = false;
          this.$rootScope.$emit('ClearLoadingScreen');
          this.projects = data;
          if (this.ProjectsState.tabs.graph.active) {
            this.drawGraph(this.projects);
          } else if(this.ProjectsState.tabs.summary.active || this.numPrimarySites === 0) {
            this.numPrimarySites = _.unique(this.projects.hits, (project) => { return project.primary_site; }).length;
          }
        });
      } else {
        this.loading = false;
        this.$rootScope.$emit('ClearLoadingScreen');
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

    gotoQuery() {
      var stateParams = {};
      var f = this.LocationService.filters();
      var prefixed = {
        "op": "and",
        "content": _.map(f.content, x => ({
          op: "in",
          content: {
            field: x.content.field.indexOf("summary") === 0 ? "files." + x.content.field.split(".")[2] : "cases.project." + x.content.field,
            value: x.content.value
          }
        }))
      }
      if (f) {
        stateParams = {
          filters: angular.toJson(prefixed)
        };
      }

      this.$state.go("search.participants", stateParams, { inherit: true });
    }
  }

  export interface IProjectController {
    project: IProject;
  }

  class ProjectController implements IProjectController {
    /* @ngInject */
    constructor(public project: IProject, private CoreService: ICoreService,
                private AnnotationsService: IAnnotationsService,
                private ExperimentalStrategyNames: string[],
                private DATA_CATEGORIES,
                public $state: ng.ui.IStateService,
                private $filter: ng.ui.IFilterService) {
      CoreService.setPageTitle("Project", project.project_id);

      this.experimentalStrategies = _.reduce(ExperimentalStrategyNames.slice(), function(result, name) {
        var strat = _.find(project.summary.experimental_strategies, (item) => {
          return item.experimental_strategy.toLowerCase() === name.toLowerCase();
        });

        if (strat) {
          result.push(strat);
        }

        return result;
      }, []);

      this.dataCategories = Object.keys(this.DATA_CATEGORIES).reduce((acc, key) => {
        var type = _.find(project.summary.data_categories, (item) => {
          return item.data_category === this.DATA_CATEGORIES[key].full;
        });

        return acc.concat(type || {
          data_category: this.DATA_CATEGORIES[key].full,
          file_count: 0
        });
      }, []);

      this.expStratConfig = {
        sortKey: "file_count",
        showParticipant: true,
        displayKey: "experimental_strategy",
        defaultText: "experimental strategy",
        pluralDefaultText: "experimental strategies",
        hideFileSize: true,
        tableTitle: "Case and File Counts by Experimental Strategy",
        noResultsText: "No files or cases with Experimental Strategies",
        state: {
          name: "search.files"
        },
        filters: {
          "default": {
            params: {
              filters: function(value) {
                return $filter("makeFilter")([
                  {
                    field: "cases.project.project_id",
                    value: [
                      project.project_id
                    ]
                  },
                  {
                    field: "files.experimental_strategy",
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

      this.dataCategoriesConfig = {
        sortKey: "file_count",
        showParticipant: true,
        displayKey: "data_category",
        defaultText: "data category",
        hideFileSize: true,
        tableTitle: "Case and File Counts by Data Category",
        pluralDefaultText: "data categories",
        noResultsText: "No files or cases with Data Categories",
        state: {
          name: "search.files"
        },
        blacklist: ["structural rearrangement", "dna methylation"],
        filters: {
          "default": {
            params: {
              filters: function(value) {
                return $filter("makeFilter")([
                  {
                    field: "cases.project.project_id",
                    value: [
                      project.project_id
                    ]
                  },
                  {
                    field: "files.data_category",
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

      const projectId = project.project_id;
      this.clinicalDataExportFilters = this.biospecimenDataExportFilters = {
        'project.project_id': projectId
      };
      this.clinicalDataExportExpands = ['demographic', 'diagnoses', 'family_histories', 'exposures'];
      this.clinicalDataExportFileName = 'clinical.project-' + projectId;

      this.biospecimenDataExportExpands =
        ['samples','samples.portions','samples.portions.analytes','samples.portions.analytes.aliquots',
        'samples.portions.analytes.aliquots.annotations','samples.portions.analytes.annotations',
        'samples.portions.submitter_id','samples.portions.slides','samples.portions.annotations',
        'samples.portions.center'];
      this.biospecimenDataExportFileName = 'biospecimen.project-' + projectId;

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
        "projects.table.service",
        "projects.githut.config",
        "annotations.services"
      ])
      .controller("ProjectsController", ProjectsController)
      .controller("ProjectController", ProjectController);
}
