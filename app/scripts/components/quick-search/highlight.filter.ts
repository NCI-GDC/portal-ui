module ngApp.components.ui.string {

  class Highlight {
    constructor($rootScope: ng.IScope) {
      return function (value: any, query: string = "") {
        if (!value) {
          return "";
        }

        var regex = new RegExp("[" + query.replace(/\-/g, "\\-") + "]{" + query.length + "}", "i");

        if (!_.isArray(value)) {
          value = [value];
        }

        var html = "";
        // Only ever show the top matched term in the arrays returned.
        var term = value.filter(item => {
          var matchedText = item.match(regex);
          return matchedText && matchedText[0] &&
            matchedText[0].toLowerCase() === query.toLowerCase();
        }).sort((a, b) => a.match(regex).length - b.match(regex).length)[0];

        if (term) {
          var matchedText = term.match(regex);
          matchedText = matchedText[0];
          var boldedQuery = "<span class='bolded'>" + matchedText + "</span>";
          html = term.replace(regex, boldedQuery);
        } else {
          html = value[0]; // if nothing matches, take first value
        }

        return html;
      };
    }
  }

  angular
    .module("quickSearch.filters", [])
    .filter("highlight", Highlight)
}
