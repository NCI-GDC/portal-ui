module ngApp.core.controllers {
  import ICartService = ngApp.cart.services.ICartService;
  import INotifyService = ng.cgNotify.INotifyService;

  export interface ICoreController {
    showWarning: boolean;
  }

  class CoreController implements ICoreController {
    showWarning: boolean = false;

    /* @ngInject */
    constructor(public $scope: ng.IScope,
                private $rootScope: ngApp.IRootScope,
                private CartService: ICartService,
                private notify: INotifyService,
                $location: ng.ILocationService,
                private $cookies: ng.ICookiesService) {

      var showWarning = $location.search()["showWarning"];

      if (showWarning) {
        this.$rootScope.showWarning = true;
      } else if (!$cookies["NCI-Warning"]) {
        this.$rootScope.showWarning = true;
      }

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
      };

      this.$rootScope.cancelRequest = (): void => {
        this.$rootScope.$broadcast("gdc-cancel-request");
      };

      this.$rootScope.closeWarning = () => {
        this.$rootScope.showWarning = false;
        this.$cookies["NCI-Warning"] = true;
      };

    }

  }

  angular
      .module("core.controller", ["ngCookies"])
      .controller("CoreController", CoreController);
}
