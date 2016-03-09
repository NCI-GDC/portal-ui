module ngApp.components.summaryCard.directives {
  import ILocationService = ngApp.components.location.services.ILocationService;

  function SummaryCard(LocationService: ILocationService): ng.IDirective {
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
      },
      link: function($scope) {
        var config = $scope.config;
        $scope.mode = $scope.mode || "graph";

        function checkFilters() {
          if (LocationService.path().indexOf('/query') === 0) {
            return;
          }

          var filters = LocationService.filters();
          $scope.activeFilters = _.some(filters.content, (filter) => {
            return filter.content && filter.content.field === config.filterKey;
          });
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

  angular
    .module("summaryCard.directives", [
      "location.services"
    ])
    .directive("summaryCard", SummaryCard);
}
