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

        if (!(section === "facets" && tab==="summary")) {
          this[section][tab].active = true;
        }

      }
    }
  }


  export interface ISearchService {
    getSummary();
  }

  class SearchService implements ISearchService {
    private ds: restangular.IElement;

    /* @ngInject */
    constructor(Restangular: restangular.IService) {
      this.ds = Restangular.all("ui/search");
    }

    getSummary() {
      return this.ds.get('summary', {}).then((response) => {
        return response;
      });
    }
  }

  angular
      .module("search.services", [])
      .service("State", State)
      .service("SearchService", SearchService);
}
