module ngApp.components.facets.directives {
  import IFacet = ngApp.core.models.IFacet;
  import IProjectsService = ngApp.projects.services.IProjectsService;
  import IFacetScope = ngApp.components.facets.models.IFacetScope;
  import ITermsController = ngApp.components.facets.controllers.ITermsController;
  import ICustomFacetsService = ngApp.components.facets.services.ICustomFacetsService;
  import IFacetsConfigService = ngApp.components.facets.models.IFacetsService;

  /* @ngInject */
  function Terms(ProjectsService: IProjectsService): ng.IDirective {
    return {
      restrict: "E",
      scope: {
        facet: "=",
        collapsed: "@",
        expanded: "@",
        displayCount: "@",
        title: "@",
        name: "@",
        removeFunction: "&",
        removable: "@",
        showTooltip: "@"
      },
      replace: true,
      templateUrl: "components/facets/templates/facet.html",
      controller: "termsCtrl as tc",
      link: ($scope: IFacetScope, elem: ng.IAugmentedJQuery, attr: ng.IAttributes, ctrl: ITermsController) => {
        $scope.ProjectsService = ProjectsService;

        $scope.add = (facet: string, term: string, event: any) => {
          if (event.which === 13) {
            elem.closest(".list-group").focus();
            ctrl.add(facet, term);
          }
        };

        $scope.remove = (facet: string, term: string, event: any) => {
          if (event.which === 13) {
            elem.closest(".list-group").focus();
            ctrl.remove(facet, term);
          }
        };
      }
    };
  }

  /* @ngInject */
  function FacetsFreeText(): ng.IDirective {
    return {
      restrict: "EA",
      scope: {
        title: "@",
        placeholder: "@",
        field: "@",
        entity: "@",
        template: "@",
        autocomplete: "@",
        removeFunction: "&",
        removable: "@",
      },
      replace: true,
      templateUrl: "components/facets/templates/facets-free-text.html",
      controller: "freeTextCtrl as ftc"
    };
  }

  /* @ngInject */
  function FacetsPrefix(): ng.IDirective {
    return {
      restrict: "EA",
      scope: {
        title: "@",
        placeholder: "@",
        field: "@",
        entity: "@",
        template: "@",
        autocomplete: "@"
      },
      replace: true,
      templateUrl: "components/facets/templates/facets-prefix.html",
      controller: "freeTextCtrl as ftc"
    };
  }

  /* @ngInject */
  function DateFacet(): ng.IDirective {
    return {
      restrict: "EA",
      scope: {
        title: "@",
        name: "@",
        collapsed: '@',
        removable: '@',
        removeFunction: '&'
      },
      replace: true,
      templateUrl: "components/facets/templates/facets-date.html",
      controller: "dateFacetCtrl as dfc"
    };
  }

  /* @ngInject */
  function RangeFacet(): ng.IDirective {
    return {
      restrict: "E",
      scope: {
        collapsed: '@',
        facet: "=",
        title: "@",
        field: "@",
        convertDays: "@",
        removable: "@",
        removeFunction: "&"
      },
      replace: true,
      templateUrl: "components/facets/templates/range-facet.html",
      controller: "rangeFacetCtrl as rfc"
    };
  }

  /* @ngInject */
  function AddCustomFacetsPanel($uibModal: any, $uibModalStack: any): ng.IDirective {
    return {
      restrict: "E",
      scope: {
        docType: "@",
        aggregations: "=",
        title: "@",
      },
      templateUrl: "components/facets/templates/add-custom-facets-panel.html",
      controller: "addCustomFacetsPanelController as acfc"
    }
  }

  /* @ngInject */
  function CurrentFilters(): ng.IDirective {
    return {
      restrict: "E",
      controller: "currentFiltersCtrl as cfc",
      templateUrl: "components/facets/templates/current.html"
    };
  }

  /* @ngInject */
  function FacetsSection(FacetService: IFacetService,
                         FacetsConfigService: IFacetsConfigService): ng.IDirective {
    return {
      restrict: "E",
      templateUrl: "components/facets/templates/facets-section.html",
      scope: {
        doctype: "@",
        aggregations: "="
      },
      link: ($scope: ng.IScope) => {
        $scope.$watch( () => { return FacetsConfigService.fieldsMap[$scope.doctype]; }, function (config) {
          $scope.facetsConfig = config;
        });

        $scope.facetsConfig = FacetsConfigService.fieldsMap[$scope.doctype];

        $scope.removeFacet = function(name: string) {
          FacetsConfigService.removeField($scope.doctype, name);
          FacetService.removeTerm($scope.doctype + "." + name);
        }
      }
    }
  }

  // This directive is used to re-trigger the typeahead suggestions
  // when user clicks on input field

  function typeaheadClickOpen($timeout) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: ($scope, elem, attrs) => {
        elem.bind('click', () => {
          var ctrl = elem.controller('ngModel');
          var prev = ctrl.$modelValue || '';
          if (prev) {
            ctrl.$setViewValue('');
            $timeout(() => ctrl.$setViewValue(prev));
          } else {
            ctrl.$setViewValue(' ');
          }
        });
      }
    }
  }

  angular.module("facets.directives", ["facets.controllers", "facets.services"])
      .directive("terms", Terms)
      .directive("currentFilters", CurrentFilters)
      .directive("rangeFacet", RangeFacet)
      .directive("dateFacet", DateFacet)
      .directive("addCustomFacetsPanel", AddCustomFacetsPanel)
      .directive("facetsSection", FacetsSection)
      .directive("facetsFreeText", FacetsFreeText)
      .directive("facetsPrefix", FacetsPrefix)
      .directive("typeaheadClickOpen", typeaheadClickOpen);
}
