module ngApp.components.ui.countCard.directives {

  /* @ngInject */
  function CountCard($filter: ng.IFilterService): ng.IDirective {
    return {
      restrict: "E",
      replace: true,
      templateUrl: "components/ui/countCard/templates/card.html",
      scope: {
        title: "@",
        icon: "@",
        data: "="
      }
    };
  }

  angular.module("count-card.directives", [])
      .directive("countCard", CountCard);
}

