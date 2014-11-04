module ngApp.core.services {

  export interface ICoreService {
    setPageTitle(title: string): void;
  }

  class CoreService implements ICoreService {
    /* @ngInject */
    constructor(private $rootScope: ngApp.IRootScope) {
    }

    setPageTitle(title: string): void {
      this.$rootScope.pageTitle = title;
    }

  }

  angular
      .module("core.services", [])
      .service("CoreService", CoreService);
}

