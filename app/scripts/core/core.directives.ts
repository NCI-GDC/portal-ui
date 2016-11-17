module ngApp.core.directives {
  import IUserService = ngApp.components.user.services.IUserService;
  enum KeyCode {
      Space = 32,
      Enter = 13,
      Esc = 27,
      Left = 37,
      Right = 39,
      Up = 38,
      Down = 40,
      Tab = 9
  }

  /* @ngInject */
  function loginButton(
    config,
    UserService: IUserService,
    $timeout,
    $uibModal,
    $uibModalStack
  ): ng.IDirective {
    return {
      restrict:'A',
      scope: {
        redirect: "@"
      },
      controller: function($scope, $element, $window) {

        let openLogin = () => {
          if (navigator.cookieEnabled) {
            const returningPath = $window.location.pathname + '?t=' + (+new Date);
            const redirectUrl = config.auth +
              (p => p ? ('/' + p) : '')($scope.redirect) +
              '?next=' +
              (p => p ? (':' + p) : '')($window.location.port) +
              returningPath;

            const closeLogin = (url) => {
              if (url === redirectUrl) {
                // Redirect hasn't happened yet so don't kill the login window.
                return false;
              } else {
                return _.includes(url, returningPath);
              }
            }

            const win = open(redirectUrl, 'Auth', 'width=800, height=600');
            const interval = setInterval(() => {
              try {
                // Because the login window redirects to a different domain, checking win.document in IE11 throws
                // exceptions right away, which prevents #clearInterval from ever getting called in this block.
                // Must check this block (if the login window has been closed) first!
                if (win.closed) {
                  clearInterval(interval);
                }
                else if (closeLogin(_.get(win, 'document.URL', ''))) {
                  win.close();
                  setTimeout(() => {
                    clearInterval(interval);
                    UserService.login();
                  }, 1000);
                }
              } catch (err) {
                console.log('Error while monitoring the Login window: ', err);
              }
            }, 500);
          } else {
            $timeout(() => {
              if (!$uibModalStack.getTop()) {
                var modalInstance = $uibModal.open({
                  templateUrl: "core/templates/enable-cookies.html",
                  controller: "WarningController",
                  controllerAs: "wc",
                  backdrop: "static",
                  keyboard: false,
                  backdropClass: "warning-backdrop",
                  animation: false,
                  resolve: { warning: null, header: null }
                });
              }
            });
          }
        };

        $element.on('keypress', (e) => {
          if (e.keyCode === KeyCode.Enter) {
            openLogin();
          }
        });

        $element.on('click', openLogin);
      }
    }
  }

  function logoutButton(config): ng.IDirective {
    return {
      restrict:'A',
      scope: {
        redirect: "@"
      },
      controller: function($scope, $element, $window) {
        let logout = () => {
          var redirect = config.auth;
          var authQuery = "";

          if ($scope.redirect) {
            redirect += "/" + $scope.redirect;
          }

          if ($window.location.port) {
            authQuery = "?next=" + ":" + $window.location.port + $window.location.pathname;
          } else {
            authQuery = "?next=" + $window.location.pathname;
          }
          $window.location = redirect + authQuery;
        };

        $element.on('keypress', (e) => {
          if (e.keyCode === KeyCode.Enter) {
            logout();
          }
        });
        $element.on('click', logout);
      }
    }
  }

  angular
    .module("core.directives", ["ngCookies", "user.services"])
    .directive('loginButton', loginButton)
    .directive('logoutButton', logoutButton)
}
