module ngApp.home.controllers {

  import ICoreService = ngApp.core.services.ICoreService;
  import IProjects = ngApp.projects.models.IProjects;
  import IHomeService = ngApp.home.services.IHomeService;

  export interface IHomeController {
    getChartFilteredData() : any[];
    getChartTooltipFunction(): any;
    setChartDataFilter(): void;
    getProjectStatsList(): any[];
    getProjectStats(): any;
    getExampleSearchQueries(): any[];
    refresh(): void;
  }

  class HomeController implements IHomeController {

    projectData: IProjects;
    projectStatsOrdering: any;
    projectStatsList: any[];
    projectStats: any;
    projectChartData: any[];
    numberFilter: any;
    tooltipFn: any;
    exampleSearchQueries: any[];
    defaultParams: any;

    /* @ngInject */
    constructor(private HomeService: IHomeService, private ProjectsTableService: TableiciousConfig,
                private CoreService: ICoreService, private $filter: ng.ui.IFilterService,
                private DATA_CATEGORIES) {

      CoreService.setPageTitle("Welcome to The Genomics Data Commons Data Portal");


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


      this.projectStatsList = [
        {title: "Projects", value: 0, icon: "icon-gdc-projects project-icon", url: "/projects/t"},
        {title: "Primary Sites", value: 0, icon: "cancer_type_hardcode", url: "/projects/t"},
        {title: "Cases", value: 0, icon: "icon-gdc-cases data-icon", url: "/search/c"},
        {title: "Files", value: 0, icon: "fa fa-file-o data-icon", url: "/search/f"},
      ];

      this.projectStats = {
        downloads: {
          totalDownloads: null,
          totalDownloadSizeBytes : null
        }
      };

      this.projectStatsOrdering = {projects: 0, cases: 2, files: 3, cancerTypes: 1, downloads: 4};

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
          description: "Germline mutation data in TCGA-OV project",
          filters: {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field: "files.data_category",
                  value: [ this.DATA_CATEGORIES.SNV.full ]
                }
              },
              {
                op: "in",
                content: {
                  field: "cases.project.project_id",
                  value: [ "TCGA-OV" ]
                }
              }
            ]
          },
          caseCount: null,
          fileCount: null
        },
      ];

      this.defaultParams =  {
        fields: this.ProjectsTableService.model().fields,
        facets: [
          "disease_type",
          "program.name",
          "project_id",
          "primary_site",
          "summary.experimental_strategies.experimental_strategy",
          "summary.data_categories.data_category"
        ],
        size: 100
      };

      this.refresh();

    }

    fetchExampleSearchQueryStats() {
      var exampleQueries = this.exampleSearchQueries;
      var defaultParams = this.defaultParams;

      exampleQueries.forEach(query => {
        var params = _.cloneDeep(defaultParams);
        params.filters = query.filters;

        this.HomeService.getParticipants(params).then(
          projectData => query.caseCount = projectData.pagination.total
        ).catch(() => query.fileCount = '--');

        this.HomeService.getFiles(params).then(
          projectData => query.fileCount = projectData.pagination.total
        ).catch(() => query.fileCount = '--');
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

        _controller.projectStatsList[_controller.projectStatsOrdering.projects].value += 1;

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


          var primarySiteData =  primarySites[pID],
              caseCount = 0,
              fileCount = 0;

          for (var i = 0; i < primarySiteData.length; i++) {
            caseCount += +(_.get(primarySiteData[i], 'summary.case_count', 0));
            fileCount += +(_.get(primarySiteData[i], 'summary.file_count', 0));
          }

          _controller.projectStatsList[_controller.projectStatsOrdering.cases].value += caseCount;
          _controller.projectStatsList[_controller.projectStatsOrdering.files].value += fileCount;


          /* _key and _count are required data properties for the marked bar chart */
          return {_key: pID, values: primarySiteData, _count: caseCount, fileCount: fileCount}
      }), function(d) { return d._count > 0; })
      .sort(function (primarySiteA, primarySiteB) {
          return primarySiteB._count - primarySiteA._count;
      });


      _controller.projectStatsList[_controller.projectStatsOrdering.cancerTypes].value += primarySiteIDs.length;


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
    }


    getChartFilteredData() {
      return this.projectChartData;
    }

    getChartTooltipFunction() {
      return this.tooltipFn;
    }

    setChartDataFilter() {

    }

    getProjectStats() {
      return this.projectStats;
    }

    getProjectStatsList() {
      return this.projectStatsList;
    }

    getProjects(filters:Object = null) {

     var params = this.defaultParams;

      if (filters) {
        params.filters = filters;
      }

      return this.HomeService.getProjects(params);
    }

    fetchAllStatsData() {
      var _controller = this;

      _controller.getProjects()
        .then((projectData) => {
          _controller.projectData = projectData;
          _controller.chartData = _controller.transformProjectData(projectData);
        })
        .then(() => {
          _controller.fetchSummaryData();
          _controller.fetchReportData({size: _controller.projectStatsList[_controller.projectStatsOrdering.projects].value});
        });
    }

    fetchSummaryData() {
      var _controller = this;

      _controller.HomeService.getSummary().then((summaryData) => {
        _controller.projectStats.summaryData = summaryData;
      });
    }

    fetchReportData(params: Object = {}) {
      var _controller = this;

      _controller.HomeService.getReports(params).then(function(reportData) {
        var hits = _.get(reportData, 'hits', false);

        if (! hits) {
          return;
        }

        var totalDownloads = 0,
            totalSizeInBytes = 0;

        _.map(hits, function(hit) {
          totalDownloads += parseInt(_.get(hit, "count", 0));
          totalSizeInBytes += parseInt(_.get(hit, "size", 0))
        });

        _controller.projectStats.downloads.totalDownloads = totalDownloads;
        _controller.projectStats.downloads.totalDownloadSizeBytes = totalSizeInBytes;

      });
    }

    refresh() {
      this.fetchExampleSearchQueryStats();
      this.fetchAllStatsData();
    }

  }

  angular
      .module("home.controller", ["ngApp.core"])
      .controller("HomeController", HomeController);
}
