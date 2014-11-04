module ngApp.search.services {

  export interface ITab {
    active: boolean;
  }

  export interface ITabs {
    participants: ITab;
    files: ITab;
  }

  export interface IState {
    tabs: ITabs;
    setActive(s: string): void;
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

    setActive(tab: string) {
      if (tab) {
        this.tabs[tab].active = true;
      }
    }
  }

  angular
      .module("search.services", [])
      .service("State", State);
}
