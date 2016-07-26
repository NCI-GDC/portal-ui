module ngApp.components.ui.biospecimen.directives {
  import IBiospecimenController = ngApp.components.ui.biospecimen.controllers.IBiospecimenController;
  import IBiospecimenService = ngApp.components.ui.biospecimen.services.IBiospecimenService;

  interface IBiospecimenScope extends ng.IScope {
    expandTree(event: any, doc: any): void;
    expandAll(event: any, participant: any, expand: boolean): void;
    search(searchTerm: string, participant: any, field: string): void;
    searchTerm: string;
    found: any[];
  }

  /* @ngInject */
  function Biospecimen(BiospecimenService: IBiospecimenService, $stateParams): ng.IDirective {
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
              $scope.$emit('displayBioSpecimenDocument', {
                doc: $scope.found[0].entity,
                type: $scope.found[0].type
              })
              participant.biospecimenTreeExpanded = BiospecimenService.allExpanded(participant);
            }
          } else $scope.found = [];
        };

        if ($stateParams.bioId) {
          $scope.search($stateParams.bioId, $scope.participant);
          $scope.searchTerm = $stateParams.bioId;
        }
      }
    };
  }

  function Tree() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'components/ui/biospecimen/templates/tree.html',
      scope: {
        entities: '=',
        type: '=',
        depth: '=',
        searchTerm: '=',
        activeDoc: '=',
      },
      link: scope => {
        scope.expandTree = (event: any, doc: any) => {
          if (event.which === 1 || event.which === 13) {
            doc.expanded = !doc.expanded;
            event.target.focus();
          }
        };

        scope.hasEntities = (entities, type) => entities.some(x => x[type.s + '_id']);
      }
    }
  }

  function TreeItem($compile) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'components/ui/biospecimen/templates/tree-item.html',
      scope: {
        entity: '=',
        type: '=',
        depth: '=',
        searchTerm: '=',
        activeDoc: '=',
      },
      link: (scope, el, attrs) => {
        scope.expandTree = (event: any, doc: any) => {
          if (event.which === 1 || event.which === 13) {
            doc.expanded = !doc.expanded;
            event.target.focus();
          }
        };

        scope.displayBioSpecimenDocument = (event: any, doc: any, type: string): void => {
          if (event.which === 1 || event.which === 13) {
            scope.$emit('displayBioSpecimenDocument', { doc: doc, type: type });
          }
        }

        el.append($compile([
          '<tree',
            'depth="depth + 1"',
            'data-ng-repeat="childType in ',
            '[',
              '{ p: \'portions\', s: \'portion\' },',
              '{ p: \'aliquots\', s: \'aliquot\' },',
              '{ p: \'analytes\', s: \'analyte\' },',
              '{ p: \'slides\', s: \'slide\' }',
            ']"',
            'entities="entity[childType.p]"',
            'data-ng-if="entity[childType.p]"',
            'type="childType"',
            'search-term="searchTerm"',
            'active-doc="activeDoc"',
          '></tree>'
        ].join(' '))(scope))
      }
    }
  }

  angular.module("biospecimen.directives", ["biospecimen.controllers", "biospecimen.services"])
      .directive("biospecimen", Biospecimen)
      .directive("tree", Tree)
      .directive("treeItem", TreeItem)
}
