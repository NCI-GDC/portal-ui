module ngApp.search.services {

  export interface ISearchService {}
  export interface ISearchState {
    setActiveFacets(tab: string): void;
    filesFacetsActive: boolean;
    participantsFacetsActive: boolean;
    setActiveTable(state: string): void;
    filesTableActive: boolean;
    participantsTableActive: boolean;
  }

  class SearchService implements ISearchService {
    /* @ngInject */
    constructor() {}
  }

  class SearchState implements ISearchState {

    /* @ngInject */
    constructor() {}

    setActiveFacets(tab: string) {
      if (tab === "files") {
        this.filesFacetsActive = true;
        this.participantsFacetsActive = false;
      } else if (tab === "participants") {
        this.participantsFacetsActive = true;
        this.filesFacetsActive = false;
      }
    }

    setActiveTable(state: string) {
      state = state.split(".")[1];

      if (state === "files") {
        this.filesTableActive = true;
        this.participantsTableActive = false;
      } else if (state === "participants" ) {
        this.filesTableActive = false;
        this.participantsTableActive = true;
      }
    }
  }

  angular
      .module("search.services", ["restangular"])
      .service("SearchService", SearchService)
      .service("SearchState", SearchState);
}
