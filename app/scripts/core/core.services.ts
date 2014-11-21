module ngApp.core.services {

  export interface ICoreService {
    setPageTitle(title: string): void;
    setLoadedState(state: boolean): void;
  }

  class CoreService implements ICoreService {
    /* @ngInject */
    constructor(private $rootScope: ngApp.IRootScope, private gettextCatalog) {
      this.setLoadedState(true);
    }

    setLoadedState(state: boolean) {
      var wrapper = angular.element(document.getElementById("wrapper"));
      var flippedState = new Boolean(!state);

      wrapper.attr("aria-busy", flippedState.toString());
      this.$rootScope.loaded = state;
    }

    setPageTitle(title: string): void {
      this.$rootScope.pageTitle = this.gettextCatalog.getString(title);
    }
  }

  angular
      .module("core.services", [
        "gettext"
      ])
      .service("CoreService", CoreService);
}

