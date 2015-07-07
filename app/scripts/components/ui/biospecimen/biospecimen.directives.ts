module ngApp.components.ui.biospecimen.directives {
  import IBiospecimenController = ngApp.components.ui.biospecimen.controllers.IBiospecimenController;

  interface IBiospecimenScope extends ng.IScope {
    expandTree(event: any, doc: any): void;
  }

  /* @ngInject */
  function Biospecimen(): ng.IDirective {
    return {
      restrict: "E",
      replace: true,
      scope: {
        case: "=",
        expanded: "="
      },
      templateUrl: "components/ui/biospecimen/templates/biospecimen.html",
      controller: "BiospecimenController as bc",
      link: ($scope: IBiospecimenScope, elem: ng.IAugmentedJQuery, attr: ng.IAttributes, ctrl: IBiospecimenController) => {
        $scope.expandTree = (event: any, doc: any) => {
          if (event.which === 1 || event.which === 13) {
            doc.expanded = !doc.expanded;
            event.target.focus();
          }
        };
      }
    };
  }

  angular.module("biospecimen.directives", ["biospecimen.controllers"])
      .directive("biospecimen", Biospecimen);
}

