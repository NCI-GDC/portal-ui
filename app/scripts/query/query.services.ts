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

  class QState implements IQueryState {
    tabs: ITabs = {
      summary: {
        active: false,
        hasLoadedOnce: false
      },
      participants: {
        active: false,
        hasLoadedOnce: false
      },
      files: {
        active: false,
        hasLoadedOnce: false
      }
    };

    setActive(tab: string, key: string) {
      if (tab) {
        if (key === "active") {
          _.each(this.tabs, (t: ITab) => {
            t.active = false;
          });

          this.tabs[tab].active = true;
        } else {
          this.tabs[tab].hasLoadedOnce = true;
        }
      }
    }
  }

  angular
      .module("query.services", [])
      .service("QState", QState);
}
