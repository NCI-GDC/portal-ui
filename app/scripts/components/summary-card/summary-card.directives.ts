module ngApp.components.summaryCard.directives {
  import ILocationService = ngApp.components.location.services.ILocationService;
  import IProjectsService = ngApp.projects.services.IProjectsService;
  import IFacetService = ngApp.components.facets.services.IFacetService;

  function SummaryCard(LocationService: ILocationService, ProjectsService: IProjectsService, FacetService: IFacetService): ng.IDirective {
    return {
      restrict: "E",
      templateUrl: "components/summary-card/templates/summary-card.html",
      controller: "SummaryCardController as sc",
      replace: true,
      scope: {
        data: "=",
        height: "@",
        config: "=",
        title: "@",
        mode: "@",
        tableId: "@",
        groupingTitle: "@",
        showCases: "="
      },
      link: function($scope) {
        $scope.ProjectsService = ProjectsService;
        var config = $scope.config;
        $scope.mode = $scope.mode || "graph";

        function checkFilters() {
          if (LocationService.path().indexOf('/query') === 0) {
            return;
          }

          $scope.activeFilters = FacetService.isFacetActive(config.filterKey);
        }
        checkFilters();

        $scope.$on("$locationChangeSuccess", () => {
          checkFilters();
        });

        $scope.$watch("data", function(newVal){
          if (newVal) {
            // Ensure pie chart data is always sorted highest to lowest
            // for tables
            if (config.sortData) {
              newVal.sort(function(a, b) {
                if (a[config.sortKey] > b[config.sortKey]) {
                  return -1;
                }

                if (b[config.sortKey] > a[config.sortKey]) {
                  return 1;
                }

                return 0;
              });
            }

            var color = d3.scale.category20();
            _.forEach(newVal, (item, index) => {
              item.color = color(index);
            });

            $scope.tableData = newVal;
          }
        });
      }
    };
  }

  function CaseSummaryCard(LocationService: ILocationService, FacetService: IFacetService): ng.IDirective {
    return {
      restrict: "E",
      templateUrl: "components/summary-card/templates/case-summary-card.html",
      controller: "SummaryCardController as sc",
      replace: true,
      scope: {
        data: "=",
        height: "@",
        config: "=",
        title: "@",
        mode: "@",
        tableId: "@",
        groupingTitle: "@",
        showCases: "="
      },
      link: function($scope) {
        var config = $scope.config;
        $scope.mode = $scope.mode || "graph";

        function checkFilters() {
          if (LocationService.path().indexOf('/query') === 0) {
            return;
          }

          $scope.activeFilters = FacetService.isFacetActive(config.filterKey);
        }
        checkFilters();

        $scope.$on("$locationChangeSuccess", () => {
          checkFilters();
        });

        $scope.$watch("data", function(newVal){
          if (newVal) {
            // Ensure pie chart data is always sorted highest to lowest
            // for tables

            if (config.sortData) {
              newVal.sort(function(a, b) {
                if (a[config.sortKey] > b[config.sortKey]) {
                  return -1;
                }

                if (b[config.sortKey] > a[config.sortKey]) {
                  return 1;
                }

                return 0;
              });
            }

            var color = d3.scale.category20();
            _.forEach(newVal, (item, index) => {
              item.color = color(index);
            });

            $scope.tableData = config.blacklist
              ? newVal.filter(x =>
                  !config.blacklist.some(y =>
                    y.toLowerCase() === x.data_category.toLowerCase()
                  )
                )
              : newVal;
          }
        });
      }
    };
  }

  function ProjectSummaryCard(LocationService: ILocationService, FacetService: IFacetService): ng.IDirective {
    return {
      restrict: "E",
      templateUrl: "components/summary-card/templates/project-summary-card.html",
      controller: "SummaryCardController as sc",
      replace: true,
      scope: {
        data: "=",
        height: "@",
        config: "=",
        title: "@",
        mode: "@",
        tableId: "@",
        groupingTitle: "@",
        showCases: "="
      },
      link: function($scope) {
        var config = $scope.config;
        $scope.mode = $scope.mode || "graph";

        function checkFilters() {
          if (LocationService.path().indexOf('/query') === 0) {
            return;
          }

          $scope.activeFilters = FacetService.isFacetActive(config.filterKey);
        }
        checkFilters();

        $scope.$on("$locationChangeSuccess", () => {
          checkFilters();
        });

        $scope.$watch("data", function(newVal){
          if (newVal) {
            // Ensure pie chart data is always sorted highest to lowest
            // for tables
            if (config.sortData) {
              newVal.sort(function(a, b) {
                if (a[config.sortKey] > b[config.sortKey]) {
                  return -1;
                }

                if (b[config.sortKey] > a[config.sortKey]) {
                  return 1;
                }

                return 0;
              });
            }

            var color = d3.scale.category20();
            _.forEach(newVal, (item, index) => {
              item.color = color(index);
            });

            $scope.tableData = config.blacklist
              ? newVal.filter(x =>
                  !config.blacklist.some(y =>
                    y.toLowerCase() === x.data_category.toLowerCase()
                  )
                )
              : newVal;
          }
        });
      }
    };
  }

  angular
    .module("summaryCard.directives", [
      "location.services"
    ])
    .directive("summaryCard", SummaryCard)
    .directive("caseSummaryCard", CaseSummaryCard)
    .directive("projectSummaryCard", ProjectSummaryCard);
}
