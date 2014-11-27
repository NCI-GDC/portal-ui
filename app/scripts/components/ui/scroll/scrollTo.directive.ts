module ngApp.components.ui.scrollTo {
  import IGDCWindowService = ngApp.models.IGDCWindowService;

  interface IScrollToAttributes extends ng.IAugmentedJQuery {
    href: string;
    scrollto: string;
  }

  /* @ngInject */
  function ScrollTo($window: IGDCWindowService): ng.IDirective {
    return function ($scope, elm: ng.IAugmentedJQuery, attrs: IScrollToAttributes) {
      elm.bind("click", function (e) {
        var top;
        e.preventDefault();

        if (attrs.href) {
          attrs.scrollto = attrs.href;
        }

        top = $window.jQuery(attrs.scrollto).offset().top - 60;
        $window.jQuery("body,html").animate({ scrollTop: top }, 800);
      });
    };
  }

  angular.module("ui.scroll.scrollTo", [])
      .directive("scrollTo", ScrollTo);
}

