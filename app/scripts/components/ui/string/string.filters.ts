module ngApp.components.ui.string {

  class Ellipsicate {
    constructor() {
      return function (fullstring: string, length: number = 50) {
        if (fullstring) {
          return (fullstring.length <= length) ? fullstring : fullstring.substring(0, length) + "…";
        } else {
          return '';
        }
      };
    }
  }

  class Humanify {
    constructor() {
      return function (original: string, capitalize: boolean = true) {
        if (!angular.isDefined(original) || (angular.isString(original) && !original.length)) {
          return '--';
        }
        if (!angular.isString(original) || original.length <= 1) {
          return original;
        }

        var split = original.split(".");
        var humanified = split[split.length - 1].replace(/_/g, " ").trim();
        var words, cWords = [];
        if (capitalize) {
          words = humanified.split(' ');
          words.forEach(function (word) {
            cWords.push(word.charAt(0).toUpperCase() + word.slice(1));
          });
          humanified = cWords.join(' ');
        }
        return humanified;
      };
    }
  }

  angular.module("string.filters", [])
      .filter("ellipsicate", Ellipsicate)
      .filter("humanify", Humanify);
}
