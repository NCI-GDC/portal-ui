module ngApp.core.controllers {
  import ICartService = ngApp.cart.services.ICartService;
  import INotifyService = ng.cgNotify.INotifyService;
  import IUserService = ngApp.components.user.services.IUserService;
  import ILocationService = ngApp.components.location.services.ILocationService;

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
                private $modal: any) {

      if (!$cookies.get("NCI-Warning")) {
        var modalInstance = this.$modal.open({
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
    constructor(private $modalInstance){}

    acceptWarning(): void {
      this.$modalInstance.close();
    }
  }

  angular
      .module("core.controller", ["ngCookies", "user.services", "location.services"])
      .controller("WarningController", WarningController)
      .directive('authButton', function(LocationService: ILocationService, $window: ng.IWindowService){
        return {
          restrict:'A',
          scope: {
            redirect: "@"
          },
          controller:function($scope,$element){
            $element.on('click',function(){
              var authQuery;

              if ($window.location.port) {
                authQuery = "?next=" + ":" + $window.location.port + $window.location.pathname;
              } else {
                authQuery = "?next=" + $window.location.pathname;
              }

              if (!_.isEmpty(LocationService.search())) {
                authQuery += "?";
                _.each(LocationService.search(), (v, k) => {
                  authQuery += k + "=";

                  if (_.isObject(angular.fromJson(v))) {
                    authQuery += $window.encodeURIComponent(v);
                  } else {
                    authQuery += v;
                  }

                  authQuery += "&";
                });
              }

              $window.location = $scope.redirect + authQuery;
            });
          }
        }
      })
      .controller("CoreController", CoreController);
}
