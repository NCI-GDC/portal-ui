module ngApp.components.ui.biospecimen.directives {
  import IBiospecimenController = ngApp.components.ui.biospecimen.controllers.IBiospecimenController;
  import IBiospecimenService = ngApp.components.ui.biospecimen.services.IBiospecimenService;

  interface IBiospecimenScope extends ng.IScope {
    expandTree(event: any, doc: any): void;
    expandAll(event: any, participant: any, expand: boolean): void;
    search(searchTerm: string, participant: any, field: string): void;
    searchTerm: string;
    foundBySearch(term: string, field: string): boolean;
    found: any[];
  }

  /* @ngInject */
  function Biospecimen(BiospecimenService: IBiospecimenService): ng.IDirective {
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

        $scope.searchTerm = "";

        $scope.expandTree = (event: any, doc: any) => {
          if (event.which === 1 || event.which === 13) {
            doc.expanded = !doc.expanded;
            event.target.focus();
          }
        };

        $scope.expandAll = (event: any, participant: any, expand: boolean) => {
          BiospecimenService.expandAll(event, participant, expand);
        };

        var idFields = [
          'submitter_id', 'sample_id', 'portion_id',
          'analyte_id', 'slide_id', 'aliquot_id'
        ];

        $scope.search = (searchTerm: string, participant: any) => {
          if (searchTerm) {
            $scope.found = BiospecimenService.search(searchTerm, participant, idFields);
            if ($scope.found.length) {
              ctrl.displayBioSpecimenDocument(
                { which: 1 }, // https://github.com/angular/angular.js/issues/6370
                $scope.found[0].entity, $scope.found[0].type
              );
              participant.biospecimenTreeExpanded = BiospecimenService.allExpanded(participant);
            }
          } else $scope.found = [];
        };

        $scope.foundBySearch = (term: string, field: string) => {
          if (term === '') return false;
          return ($scope.found || []).some(x => x.entity[field] === term);
        };
      }
    };
  }

  angular.module("biospecimen.directives", ["biospecimen.controllers", "biospecimen.services"])
      .directive("biospecimen", Biospecimen);
}
