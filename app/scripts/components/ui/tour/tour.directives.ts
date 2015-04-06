module ngApp.components.ui.tour.directives {
  import IGDCTourController = ngApp.components.ui.tour.controllers.IGDCTourController;

  /* @ngInject */
  function GDCTour(): ng.IDirective {
    return {
      restrict: "E",
      scope: {
        config: "="
      },
      templateUrl: "components/ui/tour/templates/tour.html",
      controller: "GDCTourController as gdct"
    };
  }

  angular.module("gdc.tour.directives", ["gdc.tour.controllers"])
      .directive("gdcTour", GDCTour);
}

