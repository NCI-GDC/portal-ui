module ngApp.components.quickSearch.services {

  interface IQuickSearchService {
    getDetails(type: string, id: string): ng.IPromise<any>;
    goTo(entity: string, id: string): void;
  }

  class QuickSearchService implements IQuickSearchService {
    /* @ngInject */
    constructor(private $state: ng.ui.IStateService, private $uibModalStack) {}

    goTo(entity: string, id: string): void {
      if (this.$state.params[entity + "Id"] === id) {
        this.$uibModalStack.dismissAll();
        return;
      }

      var options = {};
      options[entity + "Id"] = id;
      this.$state.go(entity, options, { inherit: false });
    }
  }

  angular
    .module("quickSearch.services", [
      "ui.bootstrap.modal"
    ])
    .service("QuickSearchService", QuickSearchService);
}
