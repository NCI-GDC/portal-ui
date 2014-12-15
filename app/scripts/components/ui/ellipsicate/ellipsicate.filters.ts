module ngApp.components.ui.ellipsicate {

  class Ellipsicate {
    constructor() {
      return function(fullstring: string, length: number = 50) {
        return (fullstring.length <= length) ? fullstring : fullstring.substring(0, length) + "…";
      };
    }
  }

  angular.module("ellipsicate.filters", [])
  .filter("ellipsicate", Ellipsicate);
}
