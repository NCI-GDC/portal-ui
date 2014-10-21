module ngApp.search.controllers {
  import IFacet = ngApp.models.IFacet;
  import IFilesService = ngApp.files.services.IFilesService;
  import IParticipantsService = ngApp.participants.services.IParticipantsService;
  import IFiles = ngApp.files.models.IFiles;
  import IParticipants = ngApp.participants.models.IParticipants;

  export interface ISearchController {
    files: IFiles;
    participants: IParticipants;
    searchQuery(section?: string): void;
    pageChanged(newCount?: number): void;
    setPagination(newPagination: Object): void;
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
    constructor(
        private FilesService: IFilesService, private ParticipantsService: IParticipantsService,
//                private $rootScope: ISearchControllerRootScope,
                private $location: ng.ILocationService,
//                $scope: ng.IScope,
                public files: IFiles, public participants: IParticipants) {
      // Default Init value
      this.activeTabSection = 'participants'; //this.$rootScope.activeTabSection || this.activeTabSection;

//      $scope.$on("$locationChangeSuccess", () => {
//        // This is an ugly way to have to call these functions we declare for controllers.
//        // Need to think of a better way for this.
//        SearchController.prototype.searchQuery.call(this);
//      });
    }

    setPagination(newPagination: Object) {
      this.pagination = newPagination;
    }

    pageChanged(newCount: number = this.pagination.count) {
      this.pagination.count = newCount;
      SearchController.prototype.searchQuery.call(this);
    }

    searchQuery(section: string = this.activeTabSection) {
      this.activeTabSection = section;

      var filters = this.$location.search();
      filters.paging = this.pagination;

      switch (section) {
        case "files":
          this.FilesService.getFiles(filters).then((response) => {
            this.files = response;
            SearchController.prototype.setPagination.call(this, response.pagination);
          });
          break;
        case "participants":
          this.ParticipantsService.getParticipants(filters).then((response) => {
            this.participants = response;
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
