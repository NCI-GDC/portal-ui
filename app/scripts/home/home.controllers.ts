module ngApp.home.controllers {
  import ICoreService = ngApp.core.services.ICoreService;

  import IProjects = ngApp.projects.models.IProjects;
  import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;

  import IProjectsService = ngApp.projects.services.IProjectsService;



  export interface IHomeController {
    getChartFilteredData() : any[];
    getChartTooltipFunction(): any;
    setChartDataFilter(): void;
    getProjectStatsList(): any[];
    getExampleSearchQueries(): any[];
    refresh(): void
  }

  export interface IHomeScope extends ng.IScope {
  }

  class HomeController implements IHomeController {

    projectData: IProjects;
    projectStatsOrdering: any;
    projectStatsList: any[];
    projectChartData: any[];
    numberFilter: any;
    tooltipFn: any;
    exampleSearchQueries: any[];

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
          this.numberFilter(d._count) + " cases (" + this.numberFilter(d.fileCount) + " files)\n" +
          "</p>";

        return str;
      }, this);


      this.projectStatsList = [
        {title: "Projects", value: 0, icon: "fa-files-o", url: "/projects/t"},
        {title: "Cases", value: 0, icon: "fa-user", url: "/search/c"},
        {title: "Files", value: 0, icon: "fa-file-o", url: "/search/f"},
        {title: "Cancer Types", value: 0, icon: "fa-heartbeat", url: "/projects/t"},
        {title: "Downloads to Date", value: 0, icon: "fa-download", url: "#"}
      ];


      this.projectStatsOrdering = {projects: 0, cases: 1, files: 2, cancerTypes: 3, downloads: 4};

      this.exampleSearchQueries = [
        {
          description: "Brain cancer cases over the age of 40 at diagnosis",
          filters: "%7B%22op%22:%22and%22,%22content%22:%5B%7B%22op%22:%22in%22,%22content%22:%7B%22field%22:%22cases.project.primary_site%22,%22value%22:%5B%22Brain%22%5D%7D%7D,%7B%22op%22:%22%3E%3D%22,%22content%22:%7B%22field%22:%22cases.clinical.age_at_diagnosis%22,%22value%22:%5B14965%5D%7D%7D%5D%7D",
          caseCount: 78,
          fileCount: 41890
        },
        {
          description: "All female cases from the TARGET-NBL project",
          filters: "%7B%22op%22:%22and%22,%22content%22:%5B%7B%22op%22:%22in%22,%22content%22:%7B%22field%22:%22cases.project.project_id%22,%22value%22:%5B%22TARGET-NBL%22%5D%7D%7D,%7B%22op%22:%22in%22,%22content%22:%7B%22field%22:%22cases.clinical.gender%22,%22value%22:%5B%22female%22%5D%7D%7D%5D%7D",
          caseCount: 506,
          fileCount: 731
        },
        {
          description: "All Asian cases with disease type Thyroid Carcinoma project",
          filters: "%7B%22op%22:%22and%22,%22content%22:%5B%7B%22op%22:%22in%22,%22content%22:%7B%22field%22:%22cases.project.disease_type%22,%22value%22:%5B%22Thyroid%20Carcinoma%22%5D%7D%7D,%7B%22op%22:%22in%22,%22content%22:%7B%22field%22:%22cases.clinical.race%22,%22value%22:%5B%22asian%22%5D%7D%7D%5D%7D",
          caseCount: 52,
          fileCount: 3171
        },
      ];

      this.refresh();

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

      console.log(primarySiteIDs);

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



          console.log(_controller.projectStatsList[_controller.projectStatsOrdering.cases]);
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

    getProjectStatsList() {
      return this.projectStatsList;
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
        this.chartData = this.transformProjectData(data);

      });

    }

  }

  angular
      .module("home.controller", [])
      .controller("HomeController", HomeController);
}
