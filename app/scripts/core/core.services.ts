module ngApp.core.services {

  export interface ICoreService {
    setPageTitle(title: string, id?: any): void;
    setLoadedState(state: boolean): void;
    xhrSent(): void;
    xhrDone(): void;
    activeRequests: boolean;
    finishedRequests: number;
    requestCount: number;
  }

  class CoreService implements ICoreService {
    activeRequests: boolean = false;
    finishedRequests: number = 0;
    requestCount: number = 0;

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
    }


    setPageTitle(title: string, id?: any): void {
      // TODO - this could probably be done when the function is called
      var formattedTitle: string = this.gettextCatalog.getString(title);
      formattedTitle = id ? formattedTitle + " - " + id : formattedTitle;
      this.$rootScope.pageTitle = formattedTitle;
    }

    xhrSent() {
      if (!this.activeRequests) {
        this.activeRequests = true;
        this.ngProgressLite.start();
      }
      this.requestCount++;
    }

    xhrDone() {
      this.finishedRequests++;
      if (this.finishedRequests === this.requestCount) {
        this.activeRequests = false;
        this.finishedRequests = 0;
        this.requestCount = 0;
        this.ngProgressLite.done();
      }
    }

  }

  angular
      .module("core.services", [
        "gettext"
      ])
      .service("CoreService", CoreService);
}
