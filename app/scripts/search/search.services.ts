module ngApp.search.services {

  import ILocationService = ngApp.components.location.services.ILocationService;
  import IUserService = ngApp.components.user.services.IUserService;

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
    setActive(section: string, tab: string, key: string): void;
  }

  class State implements ISearchState {
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
    facets: ITabs = {
      participants: {
        active: false
      },
      files: {
        active: false
      }
    };

    setActive(section: string, tab: string, key: string) {
      if (section && tab) {
        if (key === "active") {
          _.each(this[section], function (section: ITab) {
            section.active = false;
          });

          if (!(section === "facets" && tab==="summary")) {
            this[section][tab].active = true;
          }
        } else {
          this[section][tab].hasLoadedOnce = true;
        }

      }
    }
  }


  export interface ISearchService {
    getSummary(filters?: Object): ng.IPromise<any>;
  }

  class SearchService implements ISearchService {

    /* @ngInject */
    constructor(private Restangular: restangular.IService, private LocationService: ILocationService,
                private UserService: IUserService) {
    }

    getSummary(filters: Object = this.LocationService.filters(), ignoreUserProjects: boolean = false) {
      if (!ignoreUserProjects) {
        filters = this.UserService.addMyProjectsFilter(filters, "cases.project.project_id");
      }

      return this.Restangular.all("ui/search/summary")
      .post({ filters: filters }, undefined, { 'Content-Type': 'application/json' })
      .then((response) => {
        return response;
      });
    }
  }

  class SearchChartConfigs {

    /* @ngInject */
    constructor($filter: ng.IFilterService) {
      this.projectIdChartConfig = {
        filterKey: "cases.project.project_id",
        sortKey: "doc_count",
        displayKey: "key",
        defaultText: "project",
        pluralDefaultText: "projects",
        sortData: true,
        filters: {
          "default": {
            params: {
              filters: function(value) {
                return $filter("makeFilter")([
                  {
                    field: "cases.project.project_id",
                    value: [
                      value
                    ]
                  }
                ], true);
              }
            }
          }
        }
      };
      this.primarySiteChartConfig = {
        filterKey: "cases.project.primary_site",
        sortKey: "doc_count",
        displayKey: "key",
        defaultText: "primary site",
        pluralDefaultText: "primary sites",
        sortData: true,
        filters: {
          "default": {
            params: {
              filters: function(value) {
                return $filter("makeFilter")([
                  {
                    field: "cases.project.primary_site",
                    value: [
                      value
                    ]
                  }
                ], true);
              }
            }
          }
        }
      };
      this.accessChartConfig = {
        filterKey: "files.access",
        sortKey: "doc_count",
        displayKey: "key",
        defaultText: "access level",
        pluralDefaultText: "access levels",
        sortData: true,
        filters: {
          open: {
            params: {
              filters: $filter("makeFilter")([
                {
                  field: "files.access",
                  value: "open"
                }
              ], true)
            }
          },
          "controlled": {
            params: {
              filters: $filter("makeFilter")([
                {
                  field: "files.access",
                  value: "controlled"
                }
              ], true)
            }
          }
        }
      };
      this.dataTypeChartConfig = {
        filterKey: "files.data_type",
        sortKey: "doc_count",
        displayKey: "key",
        defaultText: "data type",
        pluralDefaultText: "data types",
        sortData: true,
        filters: {
          "default": {
            params: {
              filters: function(value) {
                return $filter("makeFilter")([
                  {
                    field: "files.data_type",
                    value: [
                      value
                    ]
                  }
                ], true);
              }
            }
          }
        }
      };
      this.dataFormatChartConfig = {
        filterKey: "files.data_format",
        sortKey: "doc_count",
        displayKey: "key",
        defaultText: "data format",
        pluralDefaultText: "data formats",
        sortData: true,
        filters: {
          "default": {
            params: {
              filters: function(value) {
                return $filter("makeFilter")([
                  {
                    field: "files.data_format",
                    value: [
                      value
                    ]
                  }
                ], true);
              }
            }
          }
        }
      };
      this.expStratChartConfig = {
        filterKey: "files.experimental_strategy",
        sortKey: "doc_count",
        displayKey: "key",
        defaultText: "experimental strategy",
        pluralDefaultText: "experimental strategies",
        sortData: true,
        filters: {
          "default": {
            params: {
              filters: function(value) {
                return $filter("makeFilter")([
                  {
                    field: "files.experimental_strategy",
                    value: [
                      value
                    ]
                  }
                ], true);
              }
            }
          }
        }
      };
    }
  }

  angular
      .module("search.services", [])
      .service("SearchState", State)
      .service("SearchChartConfigs", SearchChartConfigs)
      .service("SearchService", SearchService);
}
