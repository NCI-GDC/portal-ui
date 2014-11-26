module ngApp.components.facets.directives {
  import IFacet = ngApp.models.IFacet;
  import IFacetService = ngApp.components.facets.services.IFacetService;

  interface IFacetScope extends ng.IScope {
    facet: IFacet;
    title: string;
    name: string;
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
    title : string = "";
    name: string = "";
    terms : string[] = [];
    actives: string[] = [];
    inactives: string[] = [];

    /* @ngInject */
    constructor($scope: IFacetScope, private FacetService: IFacetService) {
      this.title = $scope.title;
      // TODO api should re-format the facets
      this.name = $scope.name;
      this.terms = $scope.facet.buckets;
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

  angular.module("facets.directives", [
    "facets.services"
  ])
      .controller("termsCtrl", TermsController)
      .directive("terms", Terms)
      .directive("facetsFreeText", FacetsFreeText);
}

