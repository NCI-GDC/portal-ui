module ngApp.home.controllers {

  import ICoreService = ngApp.core.services.ICoreService;
  import IProjects = ngApp.projects.models.IProjects;
  import IParticipantsService = ngApp.participants.services.IParticipantsService;
  import IFilesService = ngApp.files.services.IFilesService;

  export interface IHomeController {
    getChartFilteredData() : any[];
    getChartTooltipFunction(): any;
    setChartDataFilter(): void;
    getExampleSearchQueries(): any[];
    refresh(): void;
  }

  class HomeController implements IHomeController {

    projectData: IProjects;
    projectChartData: any[];
    numberFilter: any;
    tooltipFn: any;
    exampleSearchQueries: any[];
    defaultParams: any;

    /* @ngInject */
    constructor(
      private ProjectsTableService: TableiciousConfig,
      private CoreService: ICoreService,
      private $filter: ng.ui.IFilterService,
      private ParticipantsService: IParticipantsService,
      private FilesService: IFilesService,
      private ProjectsService: IProjectsService,
      private DATA_TYPES,
      private DATA_CATEGORIES,
      private LocationService,
      private $state,
      private config
    ) {

      CoreService.setPageTitle("Welcome to The Genomic Data Commons Data Portal");

      this.numberFilter = $filter("number");

      this.tooltipFn = _.bind(function (d) {
        var str = "";

        if (arguments.length === 0) {
          return str;
        }

        str = "<h4>" + d.projectID + " (" + d.primarySite + ")</h4>\n<p>" +
          this.numberFilter(d.caseCount) + " cases (" + this.numberFilter(d.fileCount) + " files)\n" +
          "</p>";

        return str;
      }, this);

      const yearsToDays = year => year * 365.25;

      this.exampleSearchQueries = [
        {
          description: "Cases of kidney cancer diagnosed at the age of 20 and below",
          filters: {
            op: "and",
            content: [
              {
                op: "<=",
                content: {
                  field: "cases.diagnoses.age_at_diagnosis",
                  value: [ yearsToDays(20) ]
                }
              },
              {
                op: "in",
                content: {
                  field: "cases.project.primary_site",
                  value: [ "Kidney" ]
                }
              }
            ]
          },
          caseCount: null,
          fileCount: null
        },
        {
          description: "CNV data of female brain cancer cases",
          filters: {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field: "files.data_category",
                  value: [ this.DATA_CATEGORIES.CNV.full ]
                }
              },
              {
                op: "in",
                content: {
                  field: "cases.project.primary_site",
                  value: [ "Brain" ]
                }
              },
              {
                op: "in",
                content: {
                  field: "cases.demographic.gender",
                  value: [ "female" ]
                }
              }
            ]
          },
          caseCount: null,
          fileCount: null
        },
        {
          description: "Gene expression quantification data in TCGA-GBM project",
          filters: {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field: "files.data_type",
                  value: [ this.DATA_TYPES.GEQ.full ]
                }
              },
              {
                op: "in",
                content: {
                  field: "cases.project.project_id",
                  value: [ "TCGA-GBM" ]
                }
              }
            ]
          },
          caseCount: null,
          fileCount: null
        },
      ];

      this.defaultParams =  {
        size: 0
      };

      this.loadingHumanBody = true;

      this.refresh();

      this.renderReact();

    }

    renderReact() {
      ReactDOM.render(
        React.createElement(ReactComponents.Home, { $scope: this }),
        document.getElementById('react-root')
      );
    }

    fetchExampleSearchQueryStats() {
      var exampleQueries = this.exampleSearchQueries;
      var defaultParams = this.defaultParams;

      exampleQueries.forEach(query => {
        var params = _.cloneDeep(defaultParams);
        params.filters = query.filters;

        Promise.all([
          this.ParticipantsService.getParticipants(params),
          this.FilesService.getFiles(params),
        ])
          .then(projectData => {
            query.caseCount = projectData[0].pagination.total
            query.fileCount = projectData[1].pagination.total

            this.renderReact();
          });

      });
    }

    getExampleSearchQueries() {
      return this.exampleSearchQueries;
    }


    transformProjectData(data) {
      var _controller = this,
          hits = _.get(data, 'hits', false);

      if (! hits) {
        return;
      }


      // reduce the array keyed on projectID
      var primarySites = _.reduce(hits, function(primarySiteData, project) {

        var primarySite = project.primary_site;

        if (primarySite) {
          if (! _.isArray(primarySiteData[primarySite])) {
            primarySiteData[primarySite] = [];
          }

          primarySiteData[primarySite].push(project);
        }

        return primarySiteData;

      }, {});

      var primarySiteIDs = _.keys(primarySites);

      if (primarySiteIDs.length === 0) {
        return;
      }


      var firstPassProjectData = _.filter(
        _.map(primarySiteIDs, function(pID) {

          var primarySiteData = primarySites[pID],
              caseCount = 0,
              fileCount = 0;

          for (var i = 0; i < primarySiteData.length; i++) {
            caseCount += +(_.get(primarySiteData[i], 'summary.case_count', 0));
            fileCount += +(_.get(primarySiteData[i], 'summary.file_count', 0));
          }

          /* _key and _count are required data properties for the marked bar chart */
          return {_key: pID, values: primarySiteData, _count: caseCount, fileCount: fileCount}
      }), function(d) { return d._count > 0; })
      .sort(function (primarySiteA, primarySiteB) {
          return primarySiteB._count - primarySiteA._count;
      });

      _controller.projectChartData = _.map(firstPassProjectData, function(primarySite) {

        var dataStack : any = {};

        var primarySiteTotal = 0;

        _.assign(dataStack, primarySite);

        var sortedProjects = primarySite.values.sort(function(a,b) { return a.summary.case_count - b.summary.case_count; });

        dataStack.stacks =  _.map(sortedProjects, function (project) {

          // Make sure previous site y1 > y0
          if (primarySiteTotal > 0) {
            primarySiteTotal++;
          }

          var newPrimarySiteTotal = primarySiteTotal + project.summary.case_count;

          var stack = {
            _key: primarySite._key,
            primarySite: primarySite._key,
            y0: primarySiteTotal,
            y1: newPrimarySiteTotal,
            projectID: project.project_id,
            caseCount: project.summary.case_count,
            fileCount: project.summary.file_count
          };

          primarySiteTotal = newPrimarySiteTotal;

          return stack;
        });

        dataStack._maxY = primarySiteTotal;

        return dataStack;

      });

      this.loadingHumanBody = false;
      this.renderReact();

      setTimeout(() => {
        let root = document.getElementById('human-body-root');
        HumanBody.default({
          clickHandler: this.setFilters.bind(this),
          data: _controller.projectChartData.sort((a, b) => a._key > b._key ? 1 : -1),
          selector: `#human-body-root`,
          width: 380,
          height: 435,
          offsetLeft: root.offsetLeft,
          offsetTop: root.offsetTop,
          primarySiteKey: '_key',
          caseCountKey: '_count',
          fileCountKey: 'fileCount',
        })
      });
    }

    setFilters(d) {

      var filters = {
        op: "and",
        content: [{
          op: "in",
          content: {
            field: "primary_site",
            value: [d._key.replace(/-/g, ' ')],
          }
        }]
      };

      this.$state.go("projects.table",
        {
          filters: JSON.stringify(filters)
        },
        {
          inherit: false
        }
      );
    }

    getChartFilteredData() {
      return this.projectChartData;
    }

    getChartTooltipFunction() {
      return this.tooltipFn;
    }

    getProjectStats() {
      return this.projectStats;
    }

    fetchAllStatsData() {
      var _controller = this;

      this.FilesService.getFiles({size: 0}).then((d) => {
        this.fileData = d;
      });

      this.ParticipantsService.getParticipants({size: 0}).then((d) => {
        this.caseData = d;
      });
      this.ProjectsService.getProjects({
        fields: ['primary_site', 'project_id', 'summary.case_count', 'summary.file_count'],
        facets: ['primary_site'],
        size: 1000
      })
        .then((projectData) => {
          _controller.projectData = projectData;
          _controller.projectData.aggregations.primary_site.buckets = projectData.aggregations.primary_site.buckets.filter(x => !(x.key === '_missing'));
          _controller.chartData = _controller.transformProjectData(projectData);
        })
    }

    refresh() {
      this.fetchExampleSearchQueryStats();
      this.fetchAllStatsData();
    }

  }

  angular
      .module("home.controller", [
        "ngApp.core",
        "participants.services",
        "files.services"
        ])
      .controller("HomeController", HomeController);
}
