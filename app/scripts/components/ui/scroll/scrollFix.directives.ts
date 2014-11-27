module ngApp.components.ui.scrollFix {
  import IGDCWindowService = ngApp.models.IGDCWindowService;

  interface IScrollFixAttributes extends ng.IAttributes {
    scrollFix: any;
  }

  /* @ngInject */
  function ScrollFix($window: IGDCWindowService) {
    return {
      require: "^?scrollfixTarget",
      link: function ($scope: ng.IScope, elm: ng.IAugmentedJQuery, attrs: IScrollFixAttributes, scrollfixTarget: any) {
        var top = elm[0].offsetTop,
            $target = scrollfixTarget && scrollfixTarget.$element || angular.element($window),
            entityBody = angular.element(document.querySelector(".entity-body"));

        if (!attrs.scrollFix) {
          attrs.scrollFix = top;
        } else if (typeof(attrs.scrollFix) === "string") {
          // charAt is generally faster than indexOf: http://jsperf.com/indexof-vs-charat
          if (attrs.scrollFix.charAt(0) === "-") {
            attrs.scrollFix = top - parseFloat(attrs.scrollFix.substr(1));
          } else if (attrs.scrollFix.charAt(0) === "+") {
            attrs.scrollFix = top + parseFloat(attrs.scrollFix.substr(1));
          }
        }

        function onScroll() {
          // if pageYOffset is defined use it, otherwise use other crap for IE
          var offset;
          if (angular.isDefined($window.pageYOffset)) {
            offset = $window.pageYOffset;
          } else {
            var iebody = (document.compatMode && document.compatMode !== "BackCompat") ? document.documentElement : document.body;
            offset = iebody.scrollTop;
          }
          if (!elm.hasClass("ui-scroll-fix") && offset > attrs.scrollFix) {
            elm.addClass("ui-scroll-fix");
            entityBody.addClass("scroll-fix-margin");
          } else if (elm.hasClass("ui-scroll-fix") && offset < attrs.scrollFix) {
            elm.removeClass("ui-scroll-fix");
            entityBody.removeClass("scroll-fix-margin");
          }
        }

        $target.on("scroll", onScroll);

        // Unbind scroll event handler when directive is removed
        $scope.$on("$destroy", function () {
          $target.off("scroll", onScroll);
        });
      }
    };
  }

  /* @ngInject */
  function ScrollFixTarget($window: IGDCWindowService): ng.IDirective {
    return {
      controller: ["$element", function ($element: ng.IAugmentedJQuery) {
        this.$element = $element;
      }]
    };
  }

  angular.module("ui.scroll.scrollFix", [])
      .directive("scrollFix", ScrollFix)
      .directive("scrollFixTarget", ScrollFixTarget);
}

