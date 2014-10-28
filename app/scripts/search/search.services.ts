module ngApp.search.services {

  export interface ISearchService {}

  export interface ITab {
    active: boolean;
  }

  export interface ITabs {
    participants: ITab;
    files: ITab;
  }

  export interface IState {
    tabs: ITabs;
    setActive(s:string): void;
  }

  class SearchService implements ISearchService {
    /* @ngInject */
    constructor() {}
  }

  class State implements IState {
    tabs: ITabs = {
      participants: {
        active: false
      },
      files: {
        active: false
      },
      annotations: {
        active: false
      }
    };

    /* @ngInject */
    constructor() {}

    setActive(tab: string) {
      if (tab) this.tabs[tab].active = true;
    }
  }

  angular
      .module("search.services", [])
      .service("SearchService", SearchService)
      .service("State", State);
}
