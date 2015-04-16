module ngApp.search.directives {

  function SummaryTable(FacetService): ng.IDirective {
    return {
      restrict: "AE",
      templateUrl: "search/templates/search.summary.table.html",
      scope: {
        facet: "@",
        buckets: "=",
        title: "@",
        id: "@"
      },
      controller: function($element, $scope) {
        $scope.FacetService = FacetService;

        $scope.toggleTableExpand = function() {
          $scope.expanded = !$scope.expanded;
        };
      },
      replace: true
    }
  }

  angular
    .module("search.directives", ["facets.services"])
    .directive("summaryTable", SummaryTable);
}