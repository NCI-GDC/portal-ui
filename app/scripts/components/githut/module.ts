module ngApp.components.githut {

  /* @ngInject */
  function GitHut(): ng.IDirective {
    return {
      restrict: "AE",
      scope:{
        config: "=",
        data: "="
      },
      replace: true,
      templateUrl: "components/githut/templates/graph.html",
      controller: "GitHutController as ghc"
    };
  }

  angular.module("components.githut",["githut.controllers"])
  .directive("gitHut", GitHut);
}
