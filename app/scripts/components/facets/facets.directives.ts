module ngApp.components.facets.directives {
  import IFacet = ngApp.models.IFacet;

  interface IFacetScope extends ng.IScope {
    toggleTerm(clickEvent: any): void;
    toggle(): void;
    displayCount: number;
    collapsed: boolean;
    expanded: boolean;
    facet: IFacet;
  }

  /* @ngInject */
  function FacetTerms(): ng.IDirective {
    return {
      restrict: "EA",
      scope: {
        facet: "=",
        collapsed: "@",
        expanded: "@",
        displayCount: "@"
      },
      replace: true,
      templateUrl: "components/facets/templates/facet.html",
      compile: function(element: Element, attrs) {
        attrs.expanded = attrs.expanded || false;
        attrs.collapsed = attrs.collapsed || false;
        attrs.displayCount = parseInt(attrs.displayCount, 10) || 5;
        attrs.expanded = !!attrs.expanded;
        attrs.collapsed = !!attrs.collapsed;

        return {
          post: function($scope: IFacetScope) {
            $scope.toggleTerm = function (clickEvent: any) {
              console.log(clickEvent);
            };

            $scope.toggle = function() {
              $scope.expanded = !$scope.expanded;
            };
          }
        };
      }
    };
  }

  function FacetsFreeText(): ng.IDirective {
    return {
      restrict: "EA",
      replace: true,
      scope: {
        header: "@",
        placeholder: "@"
      },
      templateUrl: "components/facets/templates/facets-free-text.html"
    };
  }

  angular.module("components.facets.directives", [])
      .directive("facetTerms", FacetTerms)
      .directive("facetsFreeText", FacetsFreeText);
}

