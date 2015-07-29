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
        removable: "@"
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
        unitsMap: "=",
        hasGraph: "@",
        removable: "@",
        removeFunction: "&",
      },
      replace: true,
      templateUrl: "components/facets/templates/range-facet.html",
      controller: "rangeFacetCtrl as rfc"
    };
  }

  /* @ngInject */
  function AddCustomizableFacets($modal: any, $modalStack: any): ng.IDirective {
    return {
      restrict: "E",
      scope: {
        docType: "@",
        //facetsConfig: "=",
        aggregations: "="
      },
      templateUrl: "components/facets/templates/add-customizable-facets.html",
      controller: "addCustomFacetsController as acfc"
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
      //  facetsConfig: "=",
        aggregations: "="
      },
      link: ($scope: ng.IScope) => {
        $scope.facetsConfig = FacetsConfigService.getFields($scope.doctype);

        $scope.removeFacet = function(name: string) {
            $scope.facetsConfig = _.reject($scope.facetsConfig, (facet) => {
            return facet.name === name;
          });
          FacetService.removeTerm($scope.doctype + "." + name);
        }
      }
    }
  }

  angular.module("facets.directives", ["facets.controllers", "facets.services"])
      .directive("terms", Terms)
      .directive("currentFilters", CurrentFilters)
      .directive("rangeFacet", RangeFacet)
      .directive("dateFacet", DateFacet)
      .directive("addCustomizableFacets", AddCustomizableFacets)
      .directive("facetsSection", FacetsSection)
      .directive("facetsFreeText", FacetsFreeText);
}

