module ngApp.components.gql.directives {

  /* @ngInject */
  function Gql($window: ng.IWindowService): ng.IDirective {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        gql: '=',
        query : '='
      },
      templateUrl: "components/gql/templates/gql.html",
      controller: "GqlController as gc",
      link: function($scope: ng.IScope) {
        $scope.onChange = () => {
          var qs = $scope.query.split(" ");
          $scope.last = qs[qs.length - 1].trim();
          try {
            $scope.gql = $window.gql.parse($scope.query);
            $scope.errorMsg = $scope.error = null;
          } catch(Error) {
            $scope.gql = null;
            $scope.errorMsg = Error.message;
            $scope.error = _.filter(_.pluck(Error.expected, 'value'), (e) => {
              return (e !== undefined) && ['[A-Za-z0-9\\-_.]', '[0-9]', '[ \\t\\r\\n]', '"', '('].indexOf(e) == -1;
            });
          }
        };

        $scope.startsWith = function (actual, expected) {
          var lowerStr = (actual + "").toLowerCase();
          return lowerStr.indexOf(expected.toLowerCase()) === 0;
        }
      }
    };
  }

  angular.module("gql.directives", ["gql.controllers"])
      .directive("gql", Gql);
}

