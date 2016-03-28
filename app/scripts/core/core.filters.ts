module ngApp.core.filters {

  class MakeFilter {
    constructor() {
      return function (fields: { field: string; value: string }[], noEscape: boolean) {
        var contentArray = _.map(fields, function (item) {
          var value;

          if (_.isArray(item.value)) {
            value = item.value;
          } else if (item.value) {
            value = item.value.split(",");
          } 

          return {
            "op": "in",
            "content": {
              "field": item.field,
              "value": value
            }
          };
        });


        if (contentArray.length === 0) {
          return angular.toJson({});
        }

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
                      annotations : boolean = true,
                      relatedFiles: boolean = true
                      ) {
        var baseUrl: string = $rootScope.config.api;
        ids = _.compact(ids);
        var url :string = baseUrl + "/data/" + ids.join(",");
        var flags: string[] = [];
        if (annotations) {
          flags.push("annotations=1");
        }
        if (relatedFiles) {
          flags.push("related_files=1");
        }
        if (flags.length) {
          url += "?";
        }
        return url + flags.join("&");
      };
    }
  }

  class MakeManifestLink {
    constructor($rootScope: ng.IScope) {
      return function (ids: string[],
                      baseUrl: string = $rootScope.config.api) {
        return baseUrl + "/manifest/" + ids.join(",");
      };
    }
  }

  angular.module("core.filters", [])
    .filter("makeManifestLink", MakeManifestLink)
    .filter("makeFilter", MakeFilter)
    .filter("makeDownloadLink", MakeDownloadLink)
    .filter("unsafe", function($sce, $compile) { return $sce.trustAsHtml; });
}
