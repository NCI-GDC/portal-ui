module ngApp.components.facets.directives {
  /* @ngInject */
  function Facets(): ng.IDirective {

    return {
      restrict: "EA",
      scope: {
        facets: "="
      },
      replace: true,
      templateUrl: "components/facets/templates/facets.html"
    };
  }

  function FacetsFreeText(): ng.IDirective {
    return {
      restrict: "EA",
      scope: {
        header: "@",
        placeholder: "@"
      },
      replace: false,
      templateUrl: "components/facets/templates/facets-free-text.html"
    };
  }

  angular.module("components.facets.directives", [])
      .directive("facets", Facets)
      .directive("facetsFreeText", FacetsFreeText);
}

