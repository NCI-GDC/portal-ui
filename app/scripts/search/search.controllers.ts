module ngApp.search.controllers {
  import IFacet = ngApp.models.IFacet;
  import IFilesService = ngApp.files.services.IFilesService;
  import IParticipantsService = ngApp.participants.services.IParticipantsService;

  export interface ISearchController {
    searchQuery(section?: string): void;
    pageChanged(): void;
    setPagination(newPagination: Object): void;
    participantFacets: IFacet[];
    fileFacets: IFacet[];
    tableData: any;
    activeTabSection: string;
    pagination: any;
  }

  interface ISearchControllerRootScope {
    activeTabSection: string;
  }

  class SearchController implements ISearchController {
    tableData: any;
    pagination: any = {
      count: 20,
      page: 1,
      pages: 4
    };
    activeTabSection: string = "participant";

    /* @ngInject */
    constructor(private FilesService: IFilesService, private ParticipantsService: IParticipantsService,
                private $rootScope: ISearchControllerRootScope,
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

    setPagination(newPagination: Object) {
      this.pagination = newPagination;
    }

    pageChanged() {
      SearchController.prototype.searchQuery.call(this);
    }

    searchQuery(section: string = this.activeTabSection) {
      this.activeTabSection = section;

      var filters = this.$location.search();
      filters.paging = this.pagination;

      switch (section) {
        case "files":
          this.FilesService.getFiles(filters).then((response) => {
            this.tableData = response;
            SearchController.prototype.setPagination.call(this, response.pagination);
          });
          break;
        case "participants":
          this.ParticipantsService.getParticipants(filters).then((response) => {
            this.tableData = response;
            SearchController.prototype.setPagination.call(this, response.pagination);
          });
          break;
      }
    }
  }

  angular
      .module("search.controller", ["search.services"])
      .controller("SearchController", SearchController);
}
