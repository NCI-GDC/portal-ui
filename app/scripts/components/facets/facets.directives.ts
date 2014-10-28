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
          var facetGroup = clickEvent.target.parentNode.querySelector(".facet-term-group"),
              arrow = clickEvent.target.querySelector(".fa");

          if (facetGroup.classList.contains("hidden")) {
            arrow.className = "fa fa-chevron-down";
          } else {
            arrow.className = "fa fa-chevron-right";
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
        };

      }
    };
  }

  function FacetsFreeText($location: ng.ILocationService): ng.IDirective {
    return {
      restrict: "EA",
      scope: {
        header: "@",
        placeholder: "@"
      },
      replace: false,
      templateUrl: "components/facets/templates/facets-free-text.html",
      link: function($scope: ng.IScope) {
          //TODO
      }
    };
  }

  angular.module("components.facets.directives", [])
      .directive("facets", Facets)
      .directive("facetsFreeText", FacetsFreeText);
}

