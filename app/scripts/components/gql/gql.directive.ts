module ngApp.components.gql.directives {

  /* @ngInject */
  function Gql($window: ng.IWindowService): ng.IDirective {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: "components/gql/templates/gql.html",
      controller: "GqlController as gc",
      link: function($scope: ng.IScope) {
        $scope.query = "";
        $scope.onChange = () => {
          //if ($scope.query[0] !== "(") {
          //  $scope.query = "(" + $scope.query;
          //}
          try {
            $scope.gql = $window.gql.parse($scope.query);
            console.log($scope.gql);
            $scope.errorMsg = Error.message;
            $scope.error = null;
          } catch(Error) {
            $scope.gql = null;
            $scope.errorMsg = Error.message;
            $scope.error = _.pluck(Error.expected, 'value');
            //if ($scope.error.length === 1 && $scope.error[0].length === 1) {
            //  $scope.query += $scope.error[0];
            //  $scope.onChange();
            //}

          }

        };
      }
    };
  }

  angular.module("gql.directives", ["gql.controllers"])
      .directive("gql", Gql);
}

