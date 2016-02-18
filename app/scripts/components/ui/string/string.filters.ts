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
      return function (original: any, capitalize: boolean = true, facetTerm: boolean = false) {
        // use `--` for null, undefined and empty string 
        if (original === null || original === undefined || (angular.isString(original) && original.length === 0)) {
          return '--';
        // return all other non-strings 
        } else if (!angular.isString(original)) return original;

        var humanified = "";

        if (facetTerm) {
          // Splits on capital letters followed by lowercase letters to find
          // words squished together in a string.
          original = original.split(/(?=[A-Z][a-z])/).join(" ");
          humanified = original.replace(/\./g, " ").trim();
        } else {
          var split = original.split(".");
          humanified = split[split.length - 1].replace(/_/g, " ").trim();

          // Special case 'name' to include any parent nested for sake of
          // specificity in the UI
          if (humanified === "name" && split.length > 1) {
            humanified = split[split.length - 2] + " " + humanified;
          }
        }
        
        return capitalize 
          ? humanified.split(' ').map(function (word) {
              return word.indexOf("miRNA") === -1 
                ? word.charAt(0).toUpperCase() + word.slice(1)
                : word
            }).join(' ')
          : humanified;
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

  class AgeDisplay {
    constructor(gettextCatalog: any) {
      return function(ageInDays: number) {
        if (ageInDays < 365) {
          var daysText = gettextCatalog.getPlural(ageInDays, "day", "days");
          return ageInDays + " " + daysText;
        } else {
          var ageInYears = Math.floor(ageInDays / 365);
          var remainderDays = Math.ceil(ageInDays % 365);
          var yearsText = gettextCatalog.getPlural(ageInYears, "year", "years");
          var daysText = gettextCatalog.getPlural(remainderDays, "day", "days");
          return ageInYears + " " + yearsText + (remainderDays ? " " + remainderDays + " " + daysText : "");
        }
      };
    }
  }

  angular.module("string.filters", [])
      .filter("ellipsicate", Ellipsicate)
      .filter("titlefy", Titlefy)
      .filter("spaceReplace", SpaceReplace)
      .filter("humanify", Humanify)
      .filter("ageDisplay", AgeDisplay);
}
