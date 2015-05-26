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
    constructor(private Restangular: restangular.IService, private LocationService: ILocationService) {
    }

    getSummary(filters: Object = this.LocationService.filters()) {
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
        sortKey: "doc_count",
        defaultText: "project",
        pluralDefaultText: "projects",
        state: {
          "default": {
            name: "search.files",
            params: {
              filters: function(value) {
                return $filter("makeFilter")([
                  {
                    name: "participants.project.project_id",
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
        sortKey: "doc_count",
        defaultText: "primary site",
        pluralDefaultText: "primary sites",
        state: {
          "default": {
            name: "search.files",
            params: {
              filters: function(value) {
                return $filter("makeFilter")([
                  {
                    name: "participants.project.primary_site",
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
        sortKey: "doc_count",
        defaultText: "access level",
        pluralDefaultText: "access levels",
        state: {
          open: {
            name: "search.files",
            params: {
              filters: $filter("makeFilter")([
                {
                  name: "files.file_id",
                  value: _.pluck(_.filter(this.files, (file) => {
                    return file.access === "open";
                  }), "file_id")
                },
                {
                  name: "files.access",
                  value: "open"
                }
              ], true)
            }
          },
          "protected": {
            name: "search.files",
            params: {
              filters: $filter("makeFilter")([
                {
                  name: "files.file_id",
                  value: _.pluck(_.filter(this.files, (file) => {
                    return file.access === "protected";
                  }), "file_id")
                },
                {
                  name: "files.access",
                  value: "protected"
                }
              ], true)
            }
          }
        }
      };
      this.dataTypeChartConfig = {
        sortKey: "doc_count",
        defaultText: "data type",
        pluralDefaultText: "data types",
        state: {
          "default": {
            name: "search.files",
            params: {
              filters: function(value) {
                return $filter("makeFilter")([
                  {
                    name: "files.data_type",
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
        sortKey: "doc_count",
        defaultText: "data format",
        pluralDefaultText: "data formats",
        state: {
          "default": {
            name: "search.files",
            params: {
              filters: function(value) {
                return $filter("makeFilter")([
                  {
                    name: "files.data_format",
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
        sortKey: "doc_count",
        defaultText: "experimental strategy",
        pluralDefaultText: "experimental strategies",
        state: {
          "default": {
            name: "search.files",
            params: {
              filters: function(value) {
                return $filter("makeFilter")([
                  {
                    name: "files.experimental_strategy",
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
