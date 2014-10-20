module ngApp.search.services {

  export interface ISearchService {}

  class SearchService implements ISearchService {
    /* @ngInject */
    constructor() {}
  }

  angular
      .module("search.services", ["restangular"])
      .service("SearchService", SearchService);
}
