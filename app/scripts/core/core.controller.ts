module ngApp.core.controllers {
  import ICartService = ngApp.cart.services.ICartService;
  import INotifyService = ng.cgNotify.INotifyService;
  import IUserService = ngApp.components.user.services.IUserService;

  export interface ICoreController {
    showWarning: boolean;
    loading: boolean;
  }

  class CoreController implements ICoreController {
    showWarning: boolean = false;
    loading: boolean;
    loading5s: boolean;
    loading8s: boolean;
    loadingTimers: Promise<any>[];

    /* @ngInject */
    constructor(public $scope: ng.IScope,
                private $rootScope: ngApp.IRootScope,
                private CartService: ICartService,
                private notify: INotifyService,
                $location: ng.ILocationService,
                private $cookies: ng.cookies.ICookiesService,
                UserService: IUserService,
                private $uibModal: any,
                private $uibModalStack,
                private $timeout
              ) {

      this.loadingTimers = [];

      this.$rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams, options) => {
        UserService.login();
        this.$rootScope.$emit('ShowLoadingScreen');
      });

      this.$rootScope.$on("$stateChangeSuccess", (event, toState: any, toParams: any, fromState: any) => {
        this.$rootScope.$emit('ClearLoadingScreen');
        if (Object.keys(toState.data || {}).indexOf('tab') === -1) {
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }
      });

      this.$rootScope.$on('ShowLoadingScreen', (data, throttleMs) => {
        this.loadingTimers.push(this.$timeout(() => this.showLoadingScreen(), throttleMs || 500));
      });

      this.$rootScope.$on('ClearLoadingScreen', () => {
        this.clearLoadingScreen();
      });

      // display login failed warning
      if(_.get($location.search(), 'error') === 'You are not authorized to gdc services') {
        this.$timeout(() => {
          if (!this.$uibModalStack.getTop()) {
            var loginWarningModal = this.$uibModal.open({
              templateUrl: "core/templates/login-failed-warning.html",
              controller: "WarningController",
              controllerAs: "wc",
              backdrop: "static",
              keyboard: false,
              backdropClass: "warning-backdrop",
              animation: false,
              size: "lg",
              resolve: {
                warning: null
              }
            });
          }
        });
      }

      if (!$cookies.get("browser-checked")) {
        if (bowser.msie && bowser.version <= 9) {
          this.$timeout(() => {
            if (!this.$uibModalStack.getTop()) {
              var bowserWarningModal = this.$uibModal.open({
                templateUrl: "core/templates/browser-check-warning.html",
                controller: "WarningController",
                controllerAs: "wc",
                backdrop: "static",
                keyboard: false,
                backdropClass: "warning-backdrop",
                animation: false,
                size: "lg",
                resolve: {
                  warning: null
                }
              });
              bowserWarningModal.result.then(() => {
                this.$cookies.put("browser-checked", "true");
              });
            };
          });
        } else {
          this.$cookies.put("browser-checked", "true");
        }
      }
      if (!$cookies.get("NCI-Warning")) {
        this.$timeout(() => {
          if (!this.$uibModalStack.getTop()) {
            var modalInstance = this.$uibModal.open({
              templateUrl: "core/templates/warning.html",
              controller: "WarningController",
              controllerAs: "wc",
              backdrop: "static",
              keyboard: false,
              backdropClass: "warning-backdrop",
              animation: false,
              size: "lg",
              resolve: {
                warning: null
              }
            });

            modalInstance.result.then(() => {
              this.$cookies.put("NCI-Warning", "true");
            });
          }
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

    showLoadingScreen() {
      this.loading = true;
      this.loadingTimers = this.loadingTimers.concat(
        this.$timeout(() => this.loading5s = true, 5000),
        this.$timeout(() => this.loading8s = true, 8000)
      );
    }

    clearLoadingScreen() {
      this.loading = false
      this.loading5s = false;
      this.loading8s = false;
      this.loadingTimers.forEach(x => this.$timeout.cancel(x));
    }
  }

  class WarningController {
    /* @ngInject */
    constructor(private $uibModalInstance, private warning) {}

    acceptWarning(): void {
      this.$uibModalInstance.close();
    }
  }

  angular
      .module("core.controller", ["ngCookies", "user.services"])
      .controller("WarningController", WarningController)
      .controller("CoreController", CoreController);
}
