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
      controller: 'termsCtrl as tc',
      compile: function (element: ng.IAugmentedJQuery, attrs: IFacetAttributes) {
        attrs.collapsed = !!attrs.collapsed;
        attrs.displayCount = attrs.displayCount || 5;
        attrs.expanded = !!attrs.expanded;
      }
    };
  }

  function FacetsFreeText(): ng.IDirective {
    return {
      restrict: "EA",
      scope: {
        header: "@",
        placeholder: "@"
      },
      templateUrl: "components/facets/templates/facets-free-text.html"
    };
  }

  angular.module("facets.directives", ["facets.controllers"])
      .directive("terms", Terms)
      .directive("facetsFreeText", FacetsFreeText);
}

