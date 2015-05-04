module ngApp.search.services {

  import ILocationService = ngApp.components.location.services.ILocationService;

  export interface ITab {
    active: boolean;
  }

  export interface ITabs {
    participants: ITab;
    files: ITab;
  }

  export interface ISearchState {
    tabs: ITabs;
    facets: ITabs;
    setActive(section: string, s: string): void;
  }

  class State implements ISearchState {
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
    getSummary(filters?: Object);
  }

  class SearchService implements ISearchService {
    private ds: restangular.IElement;

    /* @ngInject */
    constructor(Restangular: restangular.IService, private LocationService: ILocationService) {
      this.ds = Restangular.all("ui/search");
    }

    getSummary(filters: Object = this.LocationService.filters()) {
      return this.ds.get('summary', {filters: filters}).then((response) => {
        return response;
      });
    }
  }

  angular
      .module("search.services", [])
      .service("SearchState", State)
      .service("SearchService", SearchService);
}
