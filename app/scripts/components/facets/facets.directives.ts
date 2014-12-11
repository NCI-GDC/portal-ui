module ngApp.components.facets.directives {
  import IFacet = ngApp.models.IFacet;
  import IFacetAttributes = ngApp.components.facets.models.IFacetAttributes;

  /* @ngInject */
  function Terms(): ng.IDirective {
    return {
      restrict: "E",
      scope: {
        facet: "=",
        collapsed: "@",
        expanded: "@",
        displayCount: "@",
        title: "@",
        name: "@"
      },
      replace: true,
      templateUrl: "components/facets/templates/facet.html",
      controller: "termsCtrl as tc"
    };
  }

  /* @ngInject */
  function FacetsFreeText(): ng.IDirective {
    return {
      restrict: "EA",
      scope: {
        title: "@",
        placeholder: "@",
        field: "@"
      },
      replace: true,
      templateUrl: "components/facets/templates/facets-free-text.html",
      controller: "freeTextCtrl as ftc"
    };
  }

  /* @ngInject */
  function CurrentFilters(): ng.IDirective {
    return {
      restrict: "E",
      controller: "currentFiltersCtrl as cfc",
      templateUrl: "components/facets/templates/current.html"
    };
  }

  angular.module("facets.directives", ["facets.controllers"])
      .directive("terms", Terms)
      .directive("currentFilters", CurrentFilters)
      .directive("facetsFreeText", FacetsFreeText);
}

