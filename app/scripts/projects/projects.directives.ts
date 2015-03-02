module ngApp.projects.directives {
  /* @ngInject */
  function ParallelCoordinates(): ng.IDirective {
    return {
      restrict: "E",
      scope: {
        config: '=',
        data: '='
      },
      controller: function ($scope, $element, ProjectsService) {
        $scope.config.container = $element[0];
        new ParallelCoordinates($scope.data, $scope.config);

      }
    }
  }

  angular
      .module("projects.directives", [])
      .directive("parallelCoordinates",ParallelCoordinates);
}
