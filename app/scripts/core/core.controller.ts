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
                private $cookies: ng.ICookiesService,
                private $modal: any) {

      var showWarning = $location.search()["showWarning"];

      if (showWarning || !showWarning && !$cookies["NCI-Warning"]) {
        var modalInstance = this.$modal.open({
          templateUrl: "core/templates/warning.html",
          controller: "WarningController as wc",
          backdrop: "static",
          keyboard: false,
          backdropClass: "warning-backdrop",
          size: "lg"
        });

        modalInstance.result.then(() => {
          this.$cookies["NCI-Warning"] = true;
        });
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

    }

  }

  class WarningController {
    /* @ngInject */
    constructor(private $modalInstance){}

    acceptWarning(): void {
      this.$modalInstance.close();
    }
  }

  angular
      .module("core.controller", ["ngCookies"])
      .controller("WarningController", WarningController)
      .controller("CoreController", CoreController);
}
