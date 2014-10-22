module ngApp.search.controllers {
  import IFacet = ngApp.models.IFacet;
  import IFilesService = ngApp.files.services.IFilesService;
  import IParticipantsService = ngApp.participants.services.IParticipantsService;
  import IFiles = ngApp.files.models.IFiles;
  import IParticipants = ngApp.participants.models.IParticipants;
  import ISearchState = ngApp.search.services.ISearchState;

  export interface ISearchController {
    files: IFiles;
    participants: IParticipants;
    searchQuery(newCount?: number): void;
    setState(state: string): void;
  }

  class SearchController implements ISearchController {

    /* @ngInject */
    constructor(private FilesService: IFilesService, private ParticipantsService: IParticipantsService,
                private $location: ng.ILocationService,
                private $state: ng.ui.IStateService, private SearchState: ISearchState,
                public files: IFiles, public participants: IParticipants) {
      // In our tests this winds up being undefined. Haven't figured out a better solution around this.
      $state.current.data = $state.current.data || {};

      SearchState.setActiveFacets($state.current.data.tab);
      SearchState.setActiveTable($state.current.name);
    }

    setState(state: string) {
      var storedLocation = this.$location.search();
      var newState:string = "search." + state;
      
      if (this.$state.current.name !== newState) {
        this.$state.go(newState)
          .then(() => {
            this.$location.search(storedLocation);
            this.SearchState.setActiveTable(newState);
            SearchController.prototype.searchQuery.call(this);
          });
      }
    }

    searchQuery(newCount?: number) {
      var section = this.$state.current.name.split(".")[1];
      var filters = this.$location.search();
      filters.paging = this[section].pagination;

      if (newCount) {
        filters.paging.count = newCount;
      }

      switch (section) {
        case "files":
          this.FilesService.getFiles(filters).then((response) => {
            this.files = response;
          });
          break;
        case "participants":
          this.ParticipantsService.getParticipants(filters).then((response) => {
            this.participants = response;
          });
          break;
      }
    }
  }

  angular
      .module("search.controller", ["search.services"])
      .controller("SearchController", SearchController);
}
