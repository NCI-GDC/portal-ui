module ngApp.core.filters {

  class MakeFilter {
    constructor() {
      return function (fields: { name: string; value: string }[], noEscape: boolean) {
        var contentArray = _.map(fields, function (item) {
          var value = _.isArray(item.value) ? item.value : item.value.split(",");

          return {
            "op": "in",
            "content": {
              "field": item.name,
              "value": value
            }
          };
        });

        var ret = angular.toJson({
          "op": "and",
          "content": contentArray
        });

        if (noEscape) {
          return ret;
        }

        // Still unsure why this causes problems with ui-sref if the stringified
        // JSON doesn't have quotes and other things escaped, but switching to
        // this works in all known cases
        return angular.toJson(ret);
      };
    }
  }

  class MakeDownloadLink {
    constructor() {
      return function (ids: string[]) {
        return "/api/data/" + ids.join(",");
      };
    }
  }

  angular.module("core.filters", [])
    .filter("makeFilter", MakeFilter)
    .filter("makeDownloadLink", MakeDownloadLink);
}
