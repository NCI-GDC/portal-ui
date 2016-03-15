module ngApp.components.gql.filters {

  class GqlHighlight {
    constructor() {
      return function (value: string, query: string): string {
        return value.replace(query, '<strong>' + query + '</strong>');
      };
    }
  }

  angular.module("gql.filters", [])
    .filter("gqlHighlight", GqlHighlight)
}
