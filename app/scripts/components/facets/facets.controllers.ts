module ngApp.components.facets.directives {

  import IFacetScope = ngApp.components.facets.models.IFacetScope;
  import IFacetService = ngApp.components.facets.services.IFacetService;
  import IFreeTextFacetsScope = ngApp.components.facets.models.IFreeTextFacetsScope;
  import ILocationService = ngApp.components.location.services.ILocationService;

  interface ITermsController {
    add(facet: string, term: string, event: any): void;
    remove(facet: string, term: string, event: any): void;
    actives: string[];
    inactives: string[];
    displayCount: number;
    originalDisplayCount: number;
    collapsed: boolean;
    expanded: boolean;
    toggle(event: any, property: string): void;
  }

  class TermsController implements ITermsController {
    title: string = "";
    name: string = "";
    displayCount: number = 5;
    originalDisplayCount: number = 5;
    collapsed: boolean = false;
    expanded: boolean = false;
    actives: string[] = [];
    inactives: string[] = [];

    /* @ngInject */
    constructor($scope: IFacetScope, private FacetService: IFacetService) {
      this.collapsed = !!$scope.collapsed;
      this.expanded = !!$scope.expanded;
      this.displayCount = this.originalDisplayCount = $scope.displayCount || 5;
      this.title = $scope.title;
      // TODO api should re-format the facets
      this.name = $scope.name;
      if ($scope.facet) {
        this.refresh($scope.facet.buckets);
      }

      $scope.$watch("facet", (n, o) => {
        if (n === o) {
          return;
        }
        this.refresh(n.buckets);
      });
    }

    add(facet: string, term: string, event: any): void {
      if (event.which === 1 || event.which === 13) {
        this.FacetService.addTerm(facet, term);
      }
    }

    remove(facet: string, term: string, event: any): void {
      if (event.which === 1 || event.which === 13) {
        this.FacetService.removeTerm(facet, term);
      }
    }

    refresh(terms) {
      this.actives = this.FacetService.getActives(this.name, terms);
      this.inactives = _.difference(terms, this.actives);
    }

    toggle(event: any, property: string) {
      if (event.which === 1 || event.which === 13) {
        this[property] = !this[property];
      }

      if (property === "collapsed") {
        angular.element(event.target).attr("aria-collapsed", this.collapsed.toString());
      }

      if (property === "expanded") {
        this.displayCount = this.expanded ? this.inactives.length : this.originalDisplayCount;
      }
    }
  }

  interface ICurrentFiltersController {
    build(): void;
    currentFilters: any;
    removeTerm(facet: string, term: string, event: any): void;
  }

  class CurrentFiltersController implements ICurrentFiltersController {
    currentFilters: any = [];

    /* @ngInject */
    constructor($scope: ng.IScope, private LocationService: ILocationService,
                private FacetService: IFacetService) {
      this.build();

      $scope.$on("$locationChangeSuccess", () => this.build());
    }

    removeTerm(facet: string, term: string, event: any) {
      if (event.which === 1 || event.which === 13) {
        this.FacetService.removeTerm(facet, term);
      }
    }

    build() {
      this.currentFilters = _.sortBy(this.LocationService.filters().content, function(item: any) {
        return item.content.field;
      });
    }
  }

  interface IFreeTextController {
    actives: string[];
    searchTerm: string;
    searchButtonClick(): void;
    remove(term: string): void;
    refresh(): void;
  }

  class FreeTextController implements IFreeTextController {
    searchTerm: string = "";
    actives: string[] = [];

    /* @ngInject */
    constructor(private $scope: IFreeTextFacetsScope,
                private LocationService: ILocationService,
                private FacetService: IFacetService) {
      this.refresh();
      $scope.$watch("searchTerm", (n, o) => {
        if (n === o) {
          return;
        }
        this.refresh();
      });

      $scope.$on("$locationChangeSuccess", () => this.refresh());
    }

    searchButtonClick(): void {
      this.FacetService.addTerm(this.$scope.field, this.searchTerm);
      this.actives.push(this.searchTerm);
      this.searchTerm = "";
    }

    remove(term: string): void {
      this.FacetService.removeTerm(this.$scope.field, term);
      this.refresh();
    }

    refresh(): void {
      this.actives = this.FacetService.getActiveIDs(this.$scope.field);
    }

  }

  angular.module("facets.controllers", ["facets.services"])
      .controller("currentFiltersCtrl", CurrentFiltersController)
      .controller("freeTextCtrl", FreeTextController)
      .controller("termsCtrl", TermsController);
}

