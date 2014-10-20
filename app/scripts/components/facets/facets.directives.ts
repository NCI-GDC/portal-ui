module ngApp.components.facets.directives {
  import IFacet = ngApp.models.IFacet;

  interface IFacetScope extends ng.IScope {
    toggleFacetCategory(clickEvent: any): void;
    toggleFacetTerm(clickEvent: any, facet: IFacet): void;
    displayMax: number;
    type: string;
  }

  /* @ngInject */
  function Facets($location: ng.ILocationService): ng.IDirective {

    return {
      restrict: "EA",
      scope: {
        facets: "="
      },
      replace: true,
      templateUrl: "components/facets/templates/facets.html",
      link: function($scope: IFacetScope) {
        $scope.displayMax = 5;

        $scope.toggleFacetCategory = function (clickEvent: any) {
          var facetGroup = clickEvent.target.parentNode.querySelector(".facet-term-group");

          if (facetGroup.classList.contains("hidden")) {
            clickEvent.target.className = "glyphicon glyphicon-chevron-down";
          } else {
            clickEvent.target.className = "glyphicon glyphicon-chevron-right";
          }

          facetGroup.classList.toggle("hidden");
        };

        $scope.toggleFacetTerm = function(clickEvent: any, facet: IFacet) {
          var term = clickEvent.target.parentNode.querySelector("span").innerHTML;
          var filters = $location.search();
          var categoryTerms = filters[facet.category] = (filters[facet.category] && filters[facet.category].split(",")) || [];

          if (categoryTerms.indexOf(term) === -1 && clickEvent.target.checked) {
            categoryTerms.push(term);
          } else if (categoryTerms.indexOf(term) !== -1 && !clickEvent.target.checked) {
            categoryTerms.splice(categoryTerms.indexOf(term), 1);
          }

          filters[facet.category] = categoryTerms.join(",");

          $location.search(filters);
          $scope.$emit("gdc:facet-changed");
        };

      }
    };
  }

  angular.module("components.facets.directives", [])
      .directive("facets", Facets);
}

