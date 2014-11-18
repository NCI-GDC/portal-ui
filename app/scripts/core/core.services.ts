module ngApp.core.services {

  export interface ICoreService {
    setPageTitle(title: string): void;
  }

  class CoreService implements ICoreService {
    /* @ngInject */
    constructor(private $rootScope: ngApp.IRootScope, private gettextCatalog) {
      var wrapper = angular.element(document.getElementById("wrapper"));

      wrapper.attr("aria-busy", false);
      this.$rootScope.loaded = true;
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

