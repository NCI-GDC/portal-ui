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
        var spyElems, w;

        spyElems = [];
        w = $window.jQuery($window);

        function scrl() {
          var highlightSpy, pos, spy, _i, _len, _ref;
          highlightSpy = null;
          _ref = $scope.spies;

          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            spy = _ref[_i];
            spy.out();

            pos = pos = spyElems[spy.id].offset().top + 100;
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

        $scope.$watch("spies", function (spies) {
          var spy, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = spies.length; _i < _len; _i++) {
            spy = spies[_i];
            if (!spyElems[spy.id]) {
            _results.push(spyElems[spy.id] = elem.find("#" + spy.id));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        });

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

  angular.module("components.ui.scrollSpy", [])
      .directive("scrollSpy", ScrollSpy)
      .directive("spy", Spy);
}

