module ngApp.core.services {

  export interface ICoreService {
    setPageTitle(title: string, id?: any): void;
    setLoadedState(state: boolean): void;
  }

  class CoreService implements ICoreService {
    /* @ngInject */
    constructor(private $rootScope: ngApp.IRootScope, private gettextCatalog) {
      this.setLoadedState(true);
    }

    setLoadedState(state: boolean) {
      var wrapper = angular.element(document.getElementById("wrapper"));
      var flippedState = !state;

      wrapper.attr("aria-busy", flippedState.toString());
      this.$rootScope.loaded = state;
    }

    setPageTitle(title: string, id?: any): void {
      // TODO - this could probably be done when the function is called
      var formattedTitle: string = this.gettextCatalog.getString(title);
      formattedTitle = id ? formattedTitle + " - " + id : formattedTitle;
      this.$rootScope.pageTitle = formattedTitle;
    }

  }

  angular
      .module("core.services", [
        "gettext"
      ])
      .service("CoreService", CoreService);
}
