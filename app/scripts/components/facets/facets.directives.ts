module ngApp.components.facets.directives {
  import IFacet = ngApp.models.IFacet;
  import IFacetService = ngApp.components.facets.services.IFacetService;

  interface IFacetScope extends ng.IScope {
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

  interface ITermsController {
    add(facet: string, term: string): void;
    actives: string[];
    inactives: string[];
  }

  class TermsController implements ITermsController {
    name : string = "";
    terms : string[] = [];
    actives: string[] = [];
    inactives: string[] = [];

    /* @ngInject */
    constructor($scope: IFacetScope, private FacetService: IFacetService) {
      this.name = $scope.facet.value;
      this.terms = $scope.facet.terms;
      this.refresh();
      $scope.$watch("facet", (n,o) => {
        if (n === o) {
          return;
        }
        this.refresh();
      });
    }

    add(facet: string, term: string): void {
      this.FacetService.addTerm(facet, term);
    }

    remove(facet: string, term: string): void {
      this.FacetService.removeTerm(facet, term);
    }

    refresh() {
      this.actives = this.FacetService.getActives(this.name, this.terms);
      this.inactives = _.difference(this.terms, this.actives);
    }

  }

  /* @ngInject */
  function Terms(): ng.IDirective {
    return {
      restrict: "E",
      scope: {
        facet: "=",
        collapsed: "@",
        expanded: "@",
        displayCount: "@"
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

  angular.module("facets.directives", [
    "facets.services"
  ])
      .controller("termsCtrl", TermsController)
      .directive("facetTerms", Terms)
      .directive("facetsFreeText", FacetsFreeText);
}

