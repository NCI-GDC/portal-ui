module ngApp.search.controllers {
  import IFacet = ngApp.models.IFacet;
  import ISearchService = ngApp.search.services.ISearchService;

  export interface ISearchController {
    searchQuery(section?: string): void;
    participantFacets: IFacet[];
    fileFacets: IFacet[];
    tableData: any;
    activeTabSection: string;
  }

  interface ISearchControllerRootScope {
    activeTabSection: string;
  }

  class SearchController implements ISearchController {
    tableData: any;
    activeTabSection: string = "participant";

    /* @ngInject */
    constructor(private SearchService: ISearchService, private $rootScope: ISearchControllerRootScope,
                public participantFacets: IFacet[], public fileFacets: IFacet[],
                private $location: ng.ILocationService, $scope: ng.IScope) {
      // Default Init value
      this.activeTabSection = this.$rootScope.activeTabSection || this.activeTabSection;

      $scope.$on("gdc:facet-changed", () => {
        // This is an ugly way to have to call these functions we declare for controllers.
        // Need to think of a better way for this.
        SearchController.prototype.searchQuery.call(this);
      });
    }

    searchQuery(section: string = this.activeTabSection) {
      this.activeTabSection = section;
      this.tableData = null;
      switch (section) {
        case "files":
          this.SearchService.getFiles(this.$location.search()).then((response) => {
            this.tableData = response;
          });
          break;
        case "participants":
          this.SearchService.getParticipants(this.$location.search()).then((response) => {
            this.tableData = response;
          });
          break;
      }
    }
  }

  angular
      .module("search.controller", ["search.services"])
      .controller("SearchController", SearchController);
}
