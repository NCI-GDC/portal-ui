module ngApp.components.overrides.directives {
  import ICoreService = ngApp.core.services.ICoreService;

  /* @ngInject */
  function AnchorOverride(CoreService: ICoreService): ng.IDirective {
    return {
      restrict: "E",
      link: function($scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
        element.on("keyup", function(event: any) {
          if (event.which !== 13) {
            return;
          }

          if (attrs.href && attrs.href.charAt(0) === "#") {
            element[0].blur();
            document.querySelector(attrs.href).focus();
          }
        });
      }
    };
  }

  angular.module("overrides.directives", [])
      .directive("a", AnchorOverride);
}

