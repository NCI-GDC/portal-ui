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
  import IGDCConfig = ngApp.IGDCConfig;

  export interface IProjectsController {
    projects: IProjects;
    ProjectsState: IProjectsState;
    tabSwitch: boolean;
    numPrimarySites: number;
  }

  export interface IProjectScope extends ng.IScope {
    tableConfig:TableiciousConfig;
  }

  class ProjectsController implements IProjectsController {
    projects: IProjects = [];
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
                private FacetService: IFacetService,
                private $http: ng.IHttpService,
                private config: IGDCConfig,
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

    renderReact({
      projects,
      topGenesWithCasesPerProject,
      projectsIsFetching,
      genesIsFetching,
      topGenesWithCasesPerProject,
      numUniqueCases
    }: { projects: Array<Object>, topGenesWithCasesPerProject: Object, projectsIsFetching: boolean, genesIsFetching: boolean, numUniqueCases: number  }) {
      ReactDOM.render(
      React.createElement(ReactComponents.Projects, {
        projects: projects || [],
        FacetService: this.FacetService,
        projectsIsFetching: projectsIsFetching,
        genesIsFetching: genesIsFetching,
        topGenesWithCasesPerProject: topGenesWithCasesPerProject,
        numUniqueCases: numUniqueCases
      }), document.getElementById('react-projects-root')
      );
    };

    refresh() {
      this.loading = true;
      this.$rootScope.$emit('ShowLoadingScreen');
      this.renderReact({ projects: [], genes: [], projectsIsFetching: true, genesIsFetching: true });
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
          this.renderReact({ projects: this.projects.hits, genes: [], projectsIsFetching: false, genesIsFetching: true });
          if (this.ProjectsState.tabs.graph.active) {
            this.drawGraph(this.projects);
          } else if(this.ProjectsState.tabs.summary.active || this.numPrimarySites === 0) {
            this.numPrimarySites = _.uniq(this.projects.hits, (project) => { return project.primary_site; }).length;
          }
          //get stackedbar chart data
          const projectIds = this.projects.hits.map(p => p.project_id);
          this.$http({
            method: 'POST',
            url: `${this.config.es_host}/${this.config.es_index_version}-gene-centric/gene-centric/_search`,
            headers: {'Content-Type' : 'application/json'},
            data: {
              "size": 20,
              "_source": ["gene_id", "symbol"],
              "query": {
                "nested": {
                  "path": "case",
                  "score_mode": "sum",
                  "query": {
                    "function_score": {
                      "query": {
                        "bool": {
                          "must": [
                            {
                              "terms": {
                                "case.project.project_id": projectIds
                                }
                            },
                            {
                              "nested": {
                                "path": "case.ssm",
                                "query": {
                                  "nested": {
                                    "path": "case.ssm.consequence",
                                    "query": {
                                      "bool": {
                                        "must": [
                                          {
                                            "terms": {
                                              "case.ssm.consequence.transcript.annotation.impact": [
                                                "HIGH", "MODERATE"
                                              ]
                                            }
                                          }
                                        ]
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          ]
                        }
                      },
                      "boost_mode": "replace",
                      "script_score": {
                        "script": "doc['case.project.project_id'].empty ? 0 : 1"
                      }
                    }
                  }
                }
              }
            }
           }).then(data => {
            const topGenesSource = (data.data.hits.hits || []).map(g => g._source);
            this.$http({
              method: 'POST',
              url: `${this.config.es_host}/${this.config.es_index_version}-case-centric/case-centric/_search`,
              headers: {'Content-Type' : 'application/json'},
              data: {
              "size": 0,
              "query": {
                "nested": {
                  "path": "gene",
                  "score_mode": "sum",
                  "query": {
                    "function_score": {
                      "query": {
                        "bool": {
                          "must": [
                            {
                              "terms": {
                                "gene.gene_id": topGenesSource.map(g => g.gene_id)
                              }
                            },
                            {
                              "nested": {
                                "path": "gene.ssm",
                                "query": {
                                  "nested": {
                                    "path": "gene.ssm.consequence",
                                    "query": {
                                      "bool": {
                                        "must": [
                                          {
                                            "terms": {
                                              "gene.ssm.consequence.transcript.annotation.impact": [
                                                "HIGH",
                                                "MODERATE"
                                              ]
                                            }
                                          }
                                        ]
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          ]
                        }
                      },
                      "boost_mode": "replace",
                      "script_score": {
                        "script": "doc['gene.gene_id'].empty ? 0 : 1"
                      }
                    }
                  }
                }
              },
              "aggs": {
                "projects": {
                  "terms": {
                    "field": "project.project_id.raw",
                    "size": 20000
                  },
                  "aggs": {
                    "case_summary": {
                      "nested": {
                        "path": "summary.data_categories"
                      },
                      "aggs": {
                        "case_with_ssm": {
                          "filter": {
                            "bool": {
                              "must": [
                                {
                                  "term": {
                                    "summary.data_categories.data_category": "Simple Nucleotide Variation"
                                  }
                                },
                                {
                                  "range": {
                                    "summary.data_categories.file_count": {
                                      "gt": 0
                                    }
                                  }
                                }
                              ]
                            }
                          }
                        }
                      }
                    },
                    "genes": {
                      "nested": {
                        "path": "gene"
                      },
                      "aggs": {
                        "my_genes": {
                          "filter": {
                            "bool": {
                              "must": [
                                {
                                  "terms": {
                                    "gene.gene_id": topGenesSource.map(g => g.gene_id)
                                  }
                                }
                              ]
                            }
                          },
                          "aggs": {
                            "gene_id": {
                              "terms": {
                                "field": "gene.gene_id",
                                "size": 20000
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
              }
            }).then(caseData => {
              const caseAggs = caseData.data.aggregations.projects.buckets
                .filter(b => _.includes(projectIds, b.key));
              const caseAggsByProject = caseAggs.reduce((acc, b) => Object.assign(acc, {[b.key]: {genes: b.genes.my_genes.gene_id.buckets, case_with_ssm: b.case_summary.case_with_ssm.doc_count}}), {});
              const numUniqueCases = caseAggs.reduce((sum, b) => sum + b.case_summary.case_with_ssm.doc_count, 0);
              const topGenesWithCasesPerProject = Object.keys(caseAggsByProject).reduce(
                (acc, projectId) => {
                  const agg = caseAggsByProject[projectId];
                  const docCounts = agg.genes.reduce((acc, a) => Object.assign(acc, {[a.key]: a.doc_count}), {});
                  Object.keys(docCounts).map(
                    (geneId) => acc[geneId] = acc[geneId] ?
                      Object.assign(acc[geneId], { [projectId]: docCounts[geneId] }) :
                      {
                        [projectId]: docCounts[geneId],
                        symbol: topGenesSource.reduce((symbol, g) => g.gene_id === geneId ? g.symbol : symbol, ''),
                      }
                  );
                  return acc;
                }, {});
                this.renderReact({ projects: this.projects.hits, topGenesWithCasesPerProject: topGenesWithCasesPerProject, numUniqueCases: numUniqueCases, projectsIsFetching: false, genesIsFetching: false });
            });
          });
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
      public project: IProject,
      public mutatedGenesProject: Array<Object>,
      public numCasesAggByProject: Array<Object>,
      public mostAffectedCases: Array<Object>,
      public survivalData: Array<Object>,
      private CoreService: ICoreService,
      private AnnotationsService: IAnnotationsService,
      private ParticipantsService: IParticipantsService,
      private ExperimentalStrategyNames: string[],
      private DATA_CATEGORIES,
      public $state: ng.ui.IStateService,
      private $filter: ng.ui.IFilterService,
      private config
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

      const promises = [];
      promises.push(
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
        }).then((data) => this.project.annotations = data)
      )

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

      promises.push(
        ParticipantsService.getParticipants({
          filters: missingBiospecFilter,
          size: 0,
          }).then(data => this.biospecimenCount = data.pagination.total)
      );

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

      promises.push(
        ParticipantsService.getParticipants({
          filters: missingClinicalFilter,
          size: 0
        }).then(data => this.clinicalCount = data.pagination.total)
      );

      Promise.all(promises).then(() => this.renderReact());
    }

    renderReact () {
      ReactDOM.render(
        React.createElement(ReactComponents.SideNavLayout, {
            links: [
              { icon: 'table', title: 'Summary', id: 'summary' },
              { icon: 'bar-chart-o', title: 'Mutated Genes', id: 'mutated-genes' },
              { icon: 'th', title: 'OncoGrid', id: 'oncogrid' },
              { icon: 'bar-chart-o', title: 'Frequent Mutations', id: 'frequent-mutations' },
              { icon: 'bar-chart-o', title: 'Most Affected Cases', id: 'most-affected-cases' },
            ],
            title: this.project.project_id,
            entityType: 'PR',
          },
          React.createElement(ReactComponents.Project, {
            $scope: this,
            mutatedGenesProject: this.mutatedGenesProject.map(g => g._source),
            numCasesAggByProject: this.numCasesAggByProject,
            authApi: this.CoreService.config.auth_api,
            api: this.CoreService.config.api,
            esHost: this.CoreService.config.es_host,
            esIndexVersion: this.CoreService.config.es_index_version,
            defaultSurvivalRawData: this.survivalData,
            mostAffectedCases: this.mostAffectedCases.map(c => c._source),
          })
        ),
        document.getElementById('react-root')
      );
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
