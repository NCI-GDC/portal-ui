module ngApp.core.directives {
  import IUserService = ngApp.components.user.services.IUserService;

  /* @ngInject */
  function loginButton(config, UserService: IUserService): ng.IDirective {
    return {
      restrict:'A',
      scope: {
        redirect: "@"
      },
      controller: function($scope, $element, $window){
        $element.on('click', function(){
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

          var win = open(redirect + authQuery, 'Auth', 'width=800, height=600');

          var interval = setInterval(() => {
            try {
              if (win.document && win.document.URL.indexOf($window.location.pathname) > -1) {
                var nextUrl = win.document.URL;
                win.close();
                setTimeout(() => {
                  clearInterval(interval);
                  UserService.login();
                }, 1000);
              } else if (!win.document) { // window is closed
                clearInterval(interval);
              }
            } catch (err) {
              console.log(err);
            }
          }, 500);
        });
      }
    }
  }

  function logoutButton(config): ng.IDirective {
    return {
      restrict:'A',
      scope: {
        redirect: "@"
      },
      controller: function($scope,$element,$window){
        $element.on('click', function(){
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

          var win = open(redirect + authQuery, 'Auth', 'width=800, height=600');

          var interval = setInterval(() => {
            var nextUrl = win.document.URL;
            win.close();
            setTimeout(() => {
              $window.location.href = nextUrl;
              clearInterval(interval);
            }, 1000);
          }, 500);
        });
      }
    }
  }

  angular
    .module("core.directives", ["ngCookies", "user.services"])
    .directive('loginButton', loginButton)
    .directive('logoutButton', logoutButton)
}
