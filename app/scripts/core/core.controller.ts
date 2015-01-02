module ngApp.core.controllers {
  import ICartService = ngApp.cart.services.ICartService;
  import INotifyService = ng.cgNotify.INotifyService;

  export interface ICoreController {
  }

  class CoreController implements ICoreController {

    /* @ngInject */
    constructor(public $scope: ng.IScope,
                private $rootScope: ngApp.IRootScope,
                private CartService: ICartService,
                private notify: INotifyService) {

      $scope.$on("undo", (event, action) => {
        if (action === "added") {
          CartService.undoAdded();
        } else if (action === "removed") {
          CartService.undoRemoved();
        }
        this.notify.closeAll();
      });

      this.$rootScope.undoClicked = (action: string): void => {
        this.$rootScope.$broadcast("undo", action);
      }

    }

  }

  angular
      .module("core.controller", [
      ])
      .controller("CoreController", CoreController);
}
