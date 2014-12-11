module ngApp.components.ui.search.directives {
  import IGDCWindowService = ngApp.models.IGDCWindowService;

  /* @ngInject */
  function SearchBar(): ng.IDirective {
    return {
      restrict: "E",
      scope: true,
      templateUrl: "components/ui/search/templates/search-bar.html",
      controller: "SearchBarController as sb"
    };
  }

  angular.module("ui.search.directives", ["ui.search.controllers"])
      .directive("searchBar", SearchBar);
}

