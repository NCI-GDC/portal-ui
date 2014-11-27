module ngApp.components.ui.scrollSpy {
  import IGDCWindowService = ngApp.models.IGDCWindowService;

  interface IScrollSpyScope extends ng.IScope {
    spies: any;
  }

  /* @ngInject */
  function ScrollSpy($window: IGDCWindowService): ng.IDirective {
    return {
      restrict: "A",
      controller: function ($scope: IScrollSpyScope) {
        $scope.spies = [];
        this.addSpy = function (spyObj) {
          return $scope.spies.push(spyObj);
        };
      },
      link: function ($scope: IScrollSpyScope, elem: ng.IAugmentedJQuery) {
        var w;

        w = $window.jQuery($window);

        function scrl() {
          var highlightSpy, pos, spy, _i, _len, _ref;
          highlightSpy = null;
          _ref = $scope.spies;

          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            spy = _ref[_i];
            spy.out();

            pos = pos = elem.find("#" + spy.id).offset().top + 100;
            if (((pos - $window.scrollY) <= 65) ||
                (pos > $window.scrollY && pos < ($window.innerHeight + $window.scrollY))) {
              spy.pos = pos;

              if (!highlightSpy) {
                highlightSpy = spy;
              }

              if (highlightSpy.pos < spy.pos) {
                highlightSpy = spy;
              }
            } else if (!$window.scrollY) {
              highlightSpy = null;
            }
          }

          return highlightSpy ? highlightSpy["in"]() : $scope.spies[0]["in"]();
        }

        w.on("scroll", scrl);
        $scope.$on("$destroy", function () {
          w.off("scroll", scrl);
        });
      }
    };
  }

  interface ISpyAttributes extends ng.IAttributes {
    spy: any;
  }

  /* @ngInject */
  function Spy(): ng.IDirective {
    return {
      restrict: "A",
      require: "^scrollSpy",
      link: function ($scope: ng.IScope, elem: ng.IAugmentedJQuery, attrs: ISpyAttributes, affix: any) {
        return affix.addSpy({
          id: attrs.spy,
          "in": function () {
            return elem.addClass("current");
          },
          out: function () {
            return elem.removeClass("current");
          }
        });
      }
    };
  }

  angular.module("ui.scroll.scrollSpy", [])
      .directive("scrollSpy", ScrollSpy)
      .directive("spy", Spy);
}

