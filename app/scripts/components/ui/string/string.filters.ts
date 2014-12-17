module ngApp.components.ui.string {

  class Ellipsicate {
    constructor() {
      return function(fullstring: string, length: number = 50) {
        return (fullstring.length <= length) ? fullstring : fullstring.substring(0, length) + "…";
      };
    }
  }

  class Humanify {
    constructor() {
      return function(original: string) {
        var split = original.split('.');
        var humanified = split[split.length-1].replace(/_/g, ' ');
        return humanified.charAt(0).toUpperCase() + humanified.slice(1);
      }
    }
  }

  angular.module("string.filters", [])
  .filter("ellipsicate", Ellipsicate)
  .filter("humanify", Humanify);
}
