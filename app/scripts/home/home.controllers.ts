module ngApp.home.controllers {
  import ICoreService = ngApp.core.services.ICoreService;

  import IProjects = ngApp.projects.models.IProjects;
  import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;

  import IProjectsService = ngApp.projects.services.IProjectsService;



  export interface IHomeController {
    getChartFilteredData() : any[];
    getChartTooltipFunction(): any;
    setChartDataFilter(): void;
    getProjectStats(): any;
    refresh(): void
  }

  export interface IHomeScope extends ng.IScope {
  }

  class HomeController implements IHomeController {

    projectData: IProjects;
    projectStats: any;
    projectChartData: any[];
    numberFilter: any;
    tooltipFn: any;

    /* @ngInject */
    constructor(private $scope: IHomeScope, private ProjectsService: IProjectsService,
                private ProjectTableModel: TableiciousConfig, private CoreService: ICoreService,
                private $filter: ng.ui.IFilterService) {
      CoreService.setPageTitle("Welcome to The Genomics Data Commons Data Portal");


      this.numberFilter = $filter("number");

      this.tooltipFn = _.bind(function (d) {
        var str = "";

        if (arguments.length === 0) {
          return str;
        }

        str = "<h4>" + d._key + "</h4>\n<p>" +
          this.numberFilter(d._count) + " cases (" + this.numberFilter(d._fileCount) + " files)\n" +
          "</p>";

        return str;
      }, this);

      this.refresh();

      //this.projectData = null;
      this.projectStats = null;
    }


    transformProjectDataToChartData(data) {
      var hits = _.get(data, 'hits', false);

      if (! hits) {
        return;
      }


      // reduce the array keyed on projectID
      var primarySites = _.reduce(hits, function(primarySiteData, project) {

        var primarySite = project.primary_site;

        if (! primarySite) {
          console.warn("Project has no primary site: ", project);
          return primarySiteData;
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

      console.log(primarySiteIDs);

      this.projectChartData = _.map(primarySiteIDs, function(pID) {


          var primarySiteData =  primarySites[pID],
              caseCount = 0,
              fileCount = 0;

          for (var i = 0; i < primarySiteData.length; i++) {
            caseCount += _.get(primarySiteData[i], 'summary.case_count', 0);
            fileCount +=  _.get(primarySiteData[i], 'summary.file_count', 0);
          }

          console.log(caseCount);
          return {_key: pID, values: primarySiteData, _count: caseCount, _fileCount: fileCount}
      });

      console.log( this.projectChartData);


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

    refresh() {

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
      })
        .then((data) => {
        this.projectData = data;
        this.chartData = this.transformProjectDataToChartData(data);

      });

    }

  }

  angular
      .module("home.controller", [])
      .controller("HomeController", HomeController);
}
