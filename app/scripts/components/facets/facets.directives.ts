module ngApp.components.facets.directives {
  import IFacet = ngApp.core.models.IFacet;
  import IProjectsService = ngApp.projects.services.IProjectsService;
  import IFacetScope = ngApp.components.facets.models.IFacetScope;
  import ITermsController = ngApp.components.facets.controllers.ITermsController;
  import ICustomFacetsService = ngApp.components.facets.services.ICustomFacetsService;

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
        name: "@"
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
        template: "@"
      },
      replace: true,
      templateUrl: "components/facets/templates/facets-free-text.html",
      controller: "freeTextCtrl as ftc"
    };
  }

  /* @ngInject */
  function DateFacet(): ng.IDirective {
    return {
      restrict: "EA",
      scope: {
        title: "@",
        name: "@"
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
        unitsMap: "="
      },
      replace: true,
      templateUrl: "components/facets/templates/range-facet.html",
      controller: "rangeFacetCtrl as rfc"
    };
  }

  /* @ngInject */
  function AddCustomizableFacets($modal: any, $window: ng.IWindowService, $modalStack): ng.IDirective {
    return {
      restrict: "A",
      scope: {
        docType: "@"
      },
      controller: function($scope, $modalStack, $modal) {
        var modalInstance;
        $scope.$on("$stateChangeStart", () => {
          if (modalInstance) {
            modalInstance.close();
          }
        });
        this.openModal = () => {
          // Modal stack is a helper service. Used to figure out if one is currently
          // open already.
          if ($modalStack.getTop()) {
            return;
          }
          modalInstance = $modal.open({
            templateUrl: "components/facets/templates/add-facets-modal.html",
            backdrop: true,
            controller: "customFacetsCtrl as cufc",
            keyboard: true,
            animation: false,
            size: "lg",
            resolve: {
                facetFields: (CustomFacetsService: ICustomFacetsService): ng.IPromise<any> => {
                  return CustomFacetsService.getFacetFields($scope.docType);
                }
              }
          });
        };
      },
      link: function($scope, $element, attrs, ctrl) {
        $element.on("click", function() {
          ctrl.openModal();
        });
      }
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
  function FacetsSection(): ng.IDirective {
    return {
      restrict: "E",
      templateUrl: "components/facets/templates/facets-section.html",
      scope: {
        facetsConfig: "="
      }
    }
  }

  angular.module("facets.directives", ["facets.controllers"])
      .directive("terms", Terms)
      .directive("currentFilters", CurrentFilters)
      .directive("rangeFacet", RangeFacet)
      .directive("dateFacet", DateFacet)
      .directive("addCustomizableFacets", AddCustomizableFacets)
      .directive("facetsSection", FacetsSection)
      .directive("facetsFreeText", FacetsFreeText);
}

