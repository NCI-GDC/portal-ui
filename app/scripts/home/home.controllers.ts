module ngApp.home.controllers {
  import ICoreService = ngApp.core.services.ICoreService;

  import IProjects = ngApp.projects.models.IProjects;
  import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;

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

  /*
  export interface IHomeScope extends ng.IScope {
  }*/

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
    constructor(private HomeService: IHomeService, private ProjectTableModel: TableiciousConfig,
                private CoreService: ICoreService, private $filter: ng.ui.IFilterService) {

      CoreService.setPageTitle("Welcome to The Genomics Data Commons Data Portal");


      this.numberFilter = $filter("number");

      this.tooltipFn = _.bind(function (d) {
        var str = "";

        if (arguments.length === 0) {
          return str;
        }

        str = "<h4>" + d._key + "</h4>\n<p>" +
          this.numberFilter(d._count) + " cases (" + this.numberFilter(d.fileCount) + " files)\n" +
          "</p>";

        return str;
      }, this);


      this.projectStatsList = [
        {title: "Projects", value: 0, icon: "icon-gdc-projects project-icon", url: "/projects/t"},
        {title: "Primary Sites", value: 0, icon: "cancer_type_hardcode", url: "/projects/t"},
        {title: "Cases", value: 0, icon: "icon-gdc-cases data-icon", url: "/search/c"},
        {title: "Files", value: 0, icon: "fa fa-file-o data-icon", url: "/search/f"},

        //{title: "Cancer Types", value: 0, icon: "fa fa-heartbeat", url: "/projects/t"},
        //{title: "Downloads to Date", value: 0, icon: "fa fa-download", url: "/reports/data-download-statistics"}
      ];

      this.projectStats = {
        downloads: {
          totalDownloads: null,
          totalDownloadSizeBytes : null
        }
      };


      this.projectStatsOrdering = {projects: 0, cases: 2, files: 3, cancerTypes: 1, downloads: 4};

      this.exampleSearchQueries = [
        {
          description: "Kidney cancer cases under the age of 20 at diagnosis",
          filters: {"op":"and","content":[{"op":"<=","content":{"field":"cases.clinical.age_at_diagnosis","value":[14600]}},{"op":"in","content":{"field":"cases.project.primary_site","value":["Kidney"]}}]},
          caseCount: null,
          fileCount: null
        },
        {
          description: "CNV data of female brain cancer cases",
          filters: {"op":"and","content":[{"op":"in","content":{"field":"files.data_category","value":["Copy number variation"]}},{"op":"in","content":{"field":"cases.project.primary_site","value":["Brain"]}},{"op":"in","content":{"field":"cases.demographic.gender","value":["female"]}}]},
          caseCount: null,
          fileCount: null
        },
        {
          description: "Germline mutation data in TCGA-OV project",
          filters: {"op":"and","content":[{"op":"in","content":{"field":"files.data_type","value":["Simple nucleotide variation"]}},{"op":"in","content":{"field":"cases.project.project_id","value":["TCGA-OV"]}}]},
          caseCount: null,
          fileCount: null
        },
      ];


      this.defaultParams =  {
        fields: this.ProjectTableModel.fields,
        expand: this.ProjectTableModel.expand,
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
      var _controller = this,
          exampleQueries = _controller.exampleSearchQueries,
          defaultParams = _controller.defaultParams;

      for (var i = 0; i < exampleQueries.length; i++) {
        var query = exampleQueries[i];

       (function(q) {

         var params = _.cloneDeep(defaultParams);
         params.filters = q.filters;
         _controller.HomeService.getParticipants(params).then(
            function (projectData) {
              q.caseCount = _.get(projectData, 'pagination.total', 0);
            },
           function () {
             q.caseCount = '--';
           }
          );

         _controller.HomeService.getFiles(params).then(
           function (projectData) {
             q.fileCount = _.get(projectData, 'pagination.total', 0);
           },
           function () {
             q.fileCount = '--';
           }
         );


        })(query);

      }
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

        if (! primarySite) {
          console.warn("Project has no primary site using project id instead: ", project);
          primarySite = project.project_id;
        }

        if (! _.isArray(primarySiteData[primarySite])) {
          primarySiteData[primarySite] = [];
        }

        primarySiteData[primarySite].push(project);


        return primarySiteData;

      }, {});

      var primarySiteIDs = _.keys(primarySites);

      if (primarySiteIDs.length === 0) {
        return;
      }

      _controller.projectChartData = _.filter(
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
      }), function(d) { return d._count > 0; });


      _controller.projectStatsList[_controller.projectStatsOrdering.cancerTypes].value += primarySiteIDs.length;




      console.log( _controller.projectStatsList);


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
      .module("home.controller", [])
      .controller("HomeController", HomeController);
}
