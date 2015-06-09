module ngApp.components.summaryCard.directives {

  function SummaryCard(): ng.IDirective {
    return {
      restrict: "E",
      templateUrl: "components/summary-card/templates/summary-card.html",
      controller: "SummaryCardController as sc",
      scope: {
        data: "=",
        height: "@",
        config: "=",
        title: "@",
        mode: "@"
      },
      link: function($scope) {
        $scope.mode = $scope.mode || "graph";
        var config = $scope.config;

        $scope.$watch("data", function(newVal){
          if (newVal) {
            // Ensure pie chart data is always sorted highest to lowest
            newVal.sort(function(a, b) {
              if (a[config.sortKey] > b[config.sortKey]) {
                return -1;
              }

              if (b[config.sortKey] > a[config.sortKey]) {
                return 1;
              }

              return 0;
            });

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
    .module("summaryCard.directives", [])
    .directive("summaryCard", SummaryCard);
}
