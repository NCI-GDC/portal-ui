module ngApp.core.services {

  export interface ICoreService {
    setPageTitle(title: string, id?: any): void;
    setLoadedState(state: boolean): void;
    setSearchModelState(state: boolean): void;
    xhrSent(model: string): void;
    xhrDone(model: string): void;
    activeRequests: boolean;
    finishedRequests: number;
    requestCount: number;
  }

  class CoreService implements ICoreService {
    activeRequests: boolean = false;
    finishedRequests: number = 0;
    requestCount: number = 0;
    searchModels: string[] = [
      "files",
      "participants",
      "annotations"
    ];

    /* @ngInject */
    constructor(private $rootScope: ngApp.IRootScope,
                private $state: ng.ui.IStateService,
                private ngProgressLite: ng.progressLite.INgProgressLite,
                private gettextCatalog) {
      this.setLoadedState(true);
    }

    setLoadedState(state: boolean) {
      var wrapper = angular.element(document.getElementById("wrapper"));
      var flippedState = !state;

      wrapper.attr("aria-busy", flippedState.toString());
      this.$rootScope.loaded = state;

      this.$rootScope.makeFilter = function (fields: { name: string; value: string }[]): string {
        var contentArray = _.map(fields, function (item) {
          return {
            "op": "is",
            "content": {
              "field": item.name,
              "value": item.value.split(",")
            }
          };
        });
        return angular.toJson({
          "op": "and",
          "content": contentArray
        });
      };

      this.$rootScope.makeDownloadLink = function(ids: string[]): string {
        return "/api/data/" + ids.join(",");
      };

    }

    setPageTitle(title: string, id?: any): void {
      // TODO - this could probably be done when the function is called
      var formattedTitle: string = this.gettextCatalog.getString(title);
      formattedTitle = id ? formattedTitle + " - " + id : formattedTitle;
      this.$rootScope.pageTitle = formattedTitle;
    }

    xhrSent(model: string) {
      if (!this.activeRequests) {
        this.activeRequests = true;
        this.ngProgressLite.start();
        if (this.searchModels.indexOf(model) !== -1) {
          this.setSearchModelState(false);
        }
      }
      this.requestCount++;
    }

    xhrDone(model: string) {
      this.finishedRequests++;
      if (this.finishedRequests === this.requestCount) {
        this.activeRequests = false;
        this.finishedRequests = 0;
        this.requestCount = 0;
        this.ngProgressLite.done();
        if (this.searchModels.indexOf(model) !== -1) {
          this.setSearchModelState(true);
        }
      }
    }

    setSearchModelState(state: boolean): void {
      this.$rootScope.modelLoaded = state;
    }


    arrayHasEnabledColumn (array,columnId) {
        var column = _.find(array,function(_column){
          return _column.id === columnId;
        });
        return column && column.enabled;
      }

  }

  angular
      .module("core.services", [
        "gettext"
      ])
      .service("CoreService", CoreService);
}
