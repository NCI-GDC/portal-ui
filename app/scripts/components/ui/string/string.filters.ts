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
      return function (original: string, capitalize: boolean = true, facetTerm: boolean = false) {
        if (!angular.isDefined(original) || (angular.isString(original) && !original.length)) {
          return '--';
        }
        if (!angular.isString(original) || original.length <= 1) {
          return original;
        }

        var split;
        var humanified;

        if (facetTerm) {
          humanified = original.replace(/\./g, " ").trim();
        } else {
          split = original.split(".");
          humanified = split[split.length - 1].replace(/_/g, " ").trim();
        }

        var words = humanified.split(' '),
            cWords = [];

        if (capitalize) {
          words.forEach(function (word) {
            // Specialcase miRNA instances
            if (word.indexOf("miRNA") === -1) {
              cWords.push(word.charAt(0).toUpperCase() + word.slice(1));
            } else {
              cWords.push(word);
            }
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
