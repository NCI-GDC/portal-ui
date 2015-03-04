module ngApp.core.filters {

  class MakeFilter {
    constructor() {
      return function (fields: { name: string; value: string }[], noEscape: boolean) {
        var contentArray = _.map(fields, function (item) {
          var value = [];

          if (_.isArray(item.value)) {
            value = item.value;
          } else if (item.value) {
            value = item.value.split(",");
          } 

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
    constructor($rootScope: IRootScope) {
      return function (ids: string[],
                      baseUrl: string = $rootScope.config.api) {
        return baseUrl + "/data/" + ids.join(",");
      };
    }
  }

  class MakeManifestLink {
    constructor($rootScope: IScope) {
      return function (ids: string[],
                      baseUrl: string = $rootScope.config.api) {
        return baseUrl + "/manifest/" + ids.join(",");
      };
    }
  }

  angular.module("core.filters", [])
    .filter("makeManifestLink", MakeManifestLink)
    .filter("makeFilter", MakeFilter)
    .filter("makeDownloadLink", MakeDownloadLink);
}
