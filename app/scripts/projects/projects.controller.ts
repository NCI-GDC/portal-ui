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
  import IParticipantsService = ngApp.participants.services.IParticipantsService;

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
        if (next.indexOf("projects/t") !== -1 || next.indexOf("projects/g") !== -1) {
          this.refresh();
        }
      });
      $scope.$on("$stateChangeSuccess", (event, toState: any, toParams: any, fromState: any) => {
        if (toState.name.indexOf("projects") !== -1) {
          this.ProjectsState.setActive("tabs", toState.name.split(".")[1], "active");
        }
        if (fromState.name.indexOf("projects") === -1) {
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
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
    biospecimenCount: number;
    clinicalCount: number;
  }

  class ProjectController implements IProjectController {
    biospecimenCount: number = 0;
    clinicalCount: number = 0;

    /* @ngInject */
    constructor(
      public project: IProject, private CoreService: ICoreService,
      private AnnotationsService: IAnnotationsService,
      private ParticipantsService: IParticipantsService,
      private ExperimentalStrategyNames: string[],
      private DATA_CATEGORIES,
      public $state: ng.ui.IStateService,
      private $filter: ng.ui.IFilterService
    ) {
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

      var missingBiospecFilter = {
          content: [
            {
              content: {
                field: "project.project_id",
                value: project.project_id
              },
              op: "="
            },
            {
              content: {
                field: "samples.sample_id",
                value: "MISSING"
              },
              op: "NOT"
            }
          ],
          op: "AND"
      };
      ParticipantsService.getParticipants({
        filters: missingBiospecFilter,
        size: 0,
        }).then(data => this.biospecimenCount = data.pagination.total);

      var missingClinicalFilter = {
          content: [
            {
              content: {
                field: "project.project_id",
                value: project.project_id
              },
              op: "="
            },
            {
              content: [
                {
                  content: {
                    field: "demographic.demographic_id",
                    value: "MISSING"
                  },
                  op: "NOT"
                }, {
                  content: {
                    field: "diagnoses.diagnosis_id",
                    value: "MISSING"
                  },
                  op: "NOT"
                }, {
                  content: {
                    field: "family_histories.family_history_id",
                    value: "MISSING"
                  },
                  op: "NOT"
                }, {
                  content: {
                    field: "exposures.exposure_id",
                    value: "MISSING"
                  },
                  op: "NOT"
                }
              ],
              op: "OR"
            }
          ],
          op: "AND"
      };
      ParticipantsService.getParticipants({
        filters: missingClinicalFilter,
        size: 0
      }).then(data => this.clinicalCount = data.pagination.total);

      this.renderReact();
      this.createOncoGrid();
    }

    renderReact () {
      ReactDOM.render(
        React.createElement(Project, { $scope: this }),
        document.getElementById('react-root')
      );
    };

    createOncoGrid () {
      var donors = [
        {"id": "DO1", "age_diagnosis": 49, "alive": true, "foobar": true},
        {"id": "DO2", "age_diagnosis": 62, "alive": false, "foobar": true},
        {"id": "DO3", "age_diagnosis": 1, "alive": true, "foobar": true},
        {"id": "DO4", "age_diagnosis": 59, "alive": true, "foobar": true},
        {"id": "DO5", "age_diagnosis": 12, "alive": true, "foobar": true},
        {"id": "DO6", "age_diagnosis": 32, "alive": true, "foobar": true},
        {"id": "DO7", "age_diagnosis": 80, "alive": true, "foobar": true}
      ];

      var genes = [
        {"id": "ENSG00000141510", "symbol": "TP53", "totalDonors": 40},
        {"id": "ENSG00000157764", "symbol": "BRAF", "totalDonors": 21},
        {"id": "ENSG00000155657", "symbol": "TTN", "totalDonors": 12},
        {"id": "ENSG00000164796", "symbol": "CSMD3", "totalDonors": 4}
      ];

      var observations = [
        {"id": "MU1", "donorId": "DO1", "geneId": "ENSG00000157764"},
        {"id": "MU2", "donorId": "DO1", "geneId": "ENSG00000141510"},
        {"id": "MU3", "donorId": "DO2", "geneId": "ENSG00000141510"},
        {"id": "MU4", "donorId": "DO3", "geneId": "ENSG00000157764"},
        {"id": "MU5", "donorId": "DO4", "geneId": "ENSG00000157764"},
        {"id": "MU6", "donorId": "DO4", "geneId": "ENSG00000164796"},
        {"id": "MU7", "donorId": "DO5", "geneId": "ENSG00000155657"},
        {"id": "MU8", "donorId": "DO5", "geneId": "ENSG00000157764"},
        {"id": "MU9", "donorId": "DO6", "geneId": "ENSG00000157764"}
      ];

      var donorOpacity = function (d) {
        if (d.type === 'int') {
          return d.value / 100;
        } else {
          return 1;
        }
      };

      var donorFill = function (d) {
        if (d.type === 'bool') {
          if (d.value === true) {
            return '#abc';
          } else {
            return '#f00';
          }
        } else {
          return '#6d72c5';
        }
      };

      var geneOpacity = function (d) {
        return d.value / 40;
      };

      var geneTracks = [
        {'name': 'Total Donors Affected', 'fieldName': 'totalDonors', 'type': 'int', 'group': 'ICGC'},
      ];

      var sortBool = function(field) {
        return function(a, b) {
          if (a[field] && !b[field]) {
            return 1;
          } else if (!a[field] && b[field]) {
            return -1;
          } else {
            return 0;
          }
        }
      };

      var sortInt = function(field) {
        return function(a, b) {
          return a[field] - b[field];
        }
      };

      var donorTracks = [
        {'name': 'Age at Diagnosis', 'fieldName': 'age_diagnosis', 'group':'Clinical', 'type': 'int', 'sort': sortInt},
        {'name': 'Alive', 'fieldName': 'alive', 'type': 'bool', 'group':'Clinical','sort': sortBool},
        {'name': 'Foobar', 'fieldName': 'foobar', 'type': 'bool', 'group':'Data', 'sort': sortBool}
      ];

      var params = {
        element: '#grid-div',
        donors: donors,
        genes: genes,
        observations: observations,
        height: 450,
        width: 600,
        heatMap: true,
        trackHeight: 20,
        donorTracks: donorTracks,
        donorOpacityFunc: donorOpacity,
        donorFillFunc: donorFill,
        geneTracks: geneTracks,
        geneOpacityFunc: geneOpacity
      };
      var grid = new OncoGrid(params);
      grid.render();
      this.grid = grid;
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
