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
          // Splits on capital letters followed by lowercase letters to find
          // words squished together in a string.
          original = original.split(/(?=[A-Z][a-z])/).join(" ");

          humanified = original.replace(/\./g, " ").trim();
        } else {
          split = original.split(".");
          humanified = split[split.length - 1].replace(/_/g, " ").trim();

          // Special case 'name' to include any parent nested for sake of
          // specificity in the UI
          if (humanified === "name" && split.length > 1) {
            humanified = split[split.length - 2] + " " + humanified;
          }
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

  class Titlefy {
    constructor() {
      return function(s) {
        s = ( s === undefined || s === null ) ? '' : s;
        return s.toString().toLowerCase().replace( /\b([a-z])/g, function(ch) {
          return ch.toUpperCase();
        });
      }
    }
  }

  class SpaceReplace {
    constructor() {
      return function(s: string, replaceWith: string) {
        return s.toString().replace(/\s+/g, replaceWith || '');
      };
    }
  }

  class DotReplace {
    constructor() {
      return function(s: string, replaceWith: string) {
        return s.toString().replace(/\.+/g, replaceWith || '');
      };
    }
  }


  class AgeDisplay {
    constructor(gettextCatalog: any) {
      return function(ageInDays: number) {
        if (ageInDays < 365) {
          var daysText = gettextCatalog.getPlural(ageInDays, "d", "ds");
          return ageInDays + daysText;
        } else {
          var ageInYears = Math.floor(ageInDays / 365);
          var remainderDays = Math.ceil(ageInDays % 365);
          var yearsText = gettextCatalog.getPlural(ageInYears, "y", "ys");
          var daysText = gettextCatalog.getPlural(remainderDays, "d", "ds");
          return ageInYears + yearsText + (remainderDays ? " " + remainderDays + daysText : "");
        }
      };
    }
  }

  angular.module("string.filters", [])
      .filter("ellipsicate", Ellipsicate)
      .filter("titlefy", Titlefy)
      .filter("spaceReplace", SpaceReplace)
      .filter("dotReplace", DotReplace)
      .filter("humanify", Humanify)
      .filter("ageDisplay", AgeDisplay);
}
