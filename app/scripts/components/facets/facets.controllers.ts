module ngApp.components.facets.directives {

  import IFacetScope = ngApp.components.facets.models.IFacetScope;
  import IFacetService = ngApp.components.facets.services.IFacetService;

  interface ITermsController {
    add(facet: string, term: string): void;
    actives: string[];
    inactives: string[];
  }

  class TermsController implements ITermsController {
    title: string = "";
    name: string = "";
    actives: string[] = [];
    inactives: string[] = [];

    /* @ngInject */
    constructor($scope: IFacetScope, private FacetService: IFacetService) {
      this.title = $scope.title;
      if ($scope.facet) {
        this.refresh($scope.facet.buckets);
      }
      // TODO api should re-format the facets
      this.name = $scope.name;

      $scope.$watch("facet", (n, o) => {
        if (n === o) {
          return;
        }
        this.refresh(n.buckets);
      });
    }

    add(facet: string, term: string): void {
      this.FacetService.addTerm(facet, term);
    }

    remove(facet: string, term: string): void {
      this.FacetService.removeTerm(facet, term);
    }

    refresh(terms) {
      this.actives = this.FacetService.getActives(this.name, terms);
      this.inactives = _.difference(terms, this.actives);
    }
  }

  angular.module("facets.controllers", ["facets.services"])
      .controller("termsCtrl", TermsController);
}
