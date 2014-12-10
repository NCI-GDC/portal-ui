module ngApp.query.services {

  export interface ITab {
    active: boolean;
  }

  export interface ITabs {
    participants: ITab;
    files: ITab;
  }

  export interface IQueryState {
    tabs: ITabs;
    setActive(tab: string): void;
  }

  class State implements IQueryState {
    tabs: ITabs = {
      participants: {
        active: false
      },
      files: {
        active: false
      }
    };

    setActive(tab: string) {
      console.log(this.tabs, tab);
      if (tab) {
        _.each(this.tabs, (t: ITab) => {
          console.log(t.active);
          t.active = false;
        });
        this.tabs[tab].active = true;
        console.log(this.tabs[tab].active)
      }
    }
  }

  angular
      .module("query.services", [])
      .service("QState", State);
}
