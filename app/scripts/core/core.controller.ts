module ngApp.core.controllers {
  import ICartService = ngApp.cart.services.ICartService;
  import INotifyService = ng.cgNotify.INotifyService;
  import IUserService = ngApp.components.user.services.IUserService;

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
                private $cookies: ng.cookies.ICookiesService,
                private $uibModal: any) {

      // display login failed warning
      if(_.get($location.search(), 'error') === 'You are not authorized to gdc services') {
        var loginWarningModal = this.$uibModal.open({
          templateUrl: "core/templates/login-failed-warning.html",
          controller: "WarningController",
          controllerAs: "wc",
          backdrop: "static",
          keyboard: false,
          backdropClass: "warning-backdrop",
          animation: false,
          size: "lg"
        });
      }

      if (!$cookies.get("browser-checked")) {
        if(bowser.msie && bowser.version <= 9) {
          var bowserWarningModal = this.$uibModal.open({
            templateUrl: "core/templates/browser-check-warning.html",
            controller: "WarningController",
            controllerAs: "wc",
            backdrop: "static",
            keyboard: false,
            backdropClass: "warning-backdrop",
            animation: false,
            size: "lg"
          });
          bowserWarningModal.result.then(() => {
            this.$cookies.put("browser-checked", "true");
          });
        } else {
            this.$cookies.put("browser-checked", "true");
        }
      }

      if (!$cookies.get("NCI-Warning")) {
        var modalInstance = this.$uibModal.open({
          templateUrl: "core/templates/warning.html",
          controller: "WarningController",
          controllerAs: "wc",
          backdrop: "static",
          keyboard: false,
          backdropClass: "warning-backdrop",
          animation: false,
          size: "lg"
        });

        modalInstance.result.then(() => {
          this.$cookies.put("NCI-Warning", "true");
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

      this.$rootScope.handleApplicationClick = (): void => {
        $scope.$broadcast('application:click');
      }
      this.$rootScope.closeWarning = () => {
        this.$rootScope.showWarning = false;
        this.$cookies.put("NCI-Warning", "true");
      };

    }
  }

  class WarningController {
    /* @ngInject */
    constructor(private $uibModalInstance) {}

    acceptWarning(): void {
      this.$uibModalInstance.close();
    }
  }

  angular
      .module("core.controller", ["ngCookies", "user.services"])
      .controller("WarningController", WarningController)
      .directive('authButton', function(config){
        return {
          restrict:'A',
          scope: {
            redirect: "@"
          },
          controller:function($scope,$element,$window){
            $element.on('click',function(){
              var redirect = config.auth;
              var authQuery;

              if ($scope.redirect) {
                redirect += "/" + $scope.redirect;
              }

              if ($window.location.port) {
                authQuery = "?next=" + ":" + $window.location.port + $window.location.pathname;
              } else {
                authQuery = "?next=" + $window.location.pathname;
              }

              $window.location = redirect + authQuery;

            });
          }
        }
      })
      .controller("CoreController", CoreController);
}
