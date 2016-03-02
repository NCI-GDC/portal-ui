module ngApp.components.ui.biospecimen.directives {
  import IBiospecimenController = ngApp.components.ui.biospecimen.controllers.IBiospecimenController;

  interface IBiospecimenScope extends ng.IScope {
    expandTree(event: any, doc: any): void;
    expandAll(event: any, participant: any, expand: boolean): void;
  }

  /* @ngInject */
  function Biospecimen(): ng.IDirective {
    return {
      restrict: "E",
      replace: true,
      scope: {
        participant: "=",
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

        $scope.expandAll = (event: any, participant: any, expand: boolean) => {
          participant.biospecimenTreeExpanded = expand;
          if (event.which === 1 || event.which === 13) {
            participant.samples.expanded = expand;
            (participant.samples || []).forEach(sample => {
              sample.portions.expanded = sample.expanded = expand;
              (sample.portions || []).forEach(portion => {
                portion.analytes.expanded = portion.expanded = expand;
                (portion.analytes || []).forEach(analyte => {
                  analyte.aliquots.expanded = analyte.expanded = true;
                  (analyte.aliquots || []).forEach(aliquots => aliquots.expanded = true);
                });
              });
            });
          }
        };
      }
    };
  }

  angular.module("biospecimen.directives", ["biospecimen.controllers"])
      .directive("biospecimen", Biospecimen);
}
