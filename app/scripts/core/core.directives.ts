module ngApp.core.directives {
  angular
    .module("core.directives", ["ngCookies"])
    .directive("attrOnOff", function AttrOnOff() {
      return {
        link: function($scope, $element, $attrs) {
          $scope.$watch(
            function () { return $element.attr("data-attr-on"); },
            function (newVal) { 
              var attr = $element.attr("data-attr-name");

              if (!eval(newVal)) {
                $element.removeAttr(attr);
              } else {
                $element.attr(attr, attr);
              }
            }
          );
        }
      };
    })
    .directive('loginButton',function(){
      return {
        restrict:'A',
        controller:function($scope,$element,$window){
          $element.on('click',function(){
            var loginQuery;

            if ($window.location.port) {
              loginQuery = "?next=" + ":" + $window.location.port + $window.location.pathname;
            } else {
              loginQuery = "?next=" + $window.location.pathname;
            }

            $window.location = 'https://gdc.nci.nih.gov' + loginQuery;

          });
        }
      }
    });
}