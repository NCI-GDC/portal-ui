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
    facets: ITabs;
    setActive(section: string, s: string): void;
  }

  class State implements IState {
    tabs: ITabs = {
      summary: {
        active: false
      },
      participants: {
        active: false
      },
      files: {
        active: false
      }
    };
    facets: ITabs = {
      participants: {
        active: false
      },
      files: {
        active: false
      }
    };

    setActive(section: string, tab: string) {
      if (section && tab) {
        _.each(this[section], function (section: ITab) {
          section.active = false;
        });
        console.log('h33!');
        if (!(section === "facets" && tab==="summary")) {
          this[section][tab].active = true;
        }

      }
    }
  }

  angular
      .module("search.services", [])
      .service("State", State);
}
