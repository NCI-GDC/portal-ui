module ngApp.components.facets.directives {
  import IFacet = ngApp.models.IFacet;

  interface IFacetScope extends ng.IScope {
    toggleTerm(clickEvent: any): void;
    facet: IFacet;
    collapsed: boolean;
    expanded: boolean;
    displayCount: number;
    toggle(event: any, property: string): void;
  }

  interface IFacetAttributes extends ng.IAttributes {
    collapsed: boolean;
    expanded: boolean;
    displayCount: number;
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
      compile: function(element: ng.IAugmentedJQuery, attrs: IFacetAttributes) {
        attrs.collapsed = !!attrs.collapsed;
        attrs.displayCount = attrs.displayCount || 5;
        attrs.expanded = !!attrs.expanded;

        return {
          post: function($scope: IFacetScope) {
            $scope.toggleTerm = function (clickEvent: any) {
              angular.element(clickEvent.target).attr("aria-checked", clickEvent.target.checked);
            };

            $scope.toggle = function(event: any, property: string) {
              if (event.which === 1 || event.which === 13) {
                $scope[property] = !$scope[property];
              }

              if (property === "collapsed") {
                element.find("div.facet-name").attr("aria-collapsed", new Boolean($scope.collapsed).toString());
              }
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

