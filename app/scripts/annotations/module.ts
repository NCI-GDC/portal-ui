module ngApp.annotations {
  "use strict";

  import IAnnotationsService = ngApp.annotations.services.IAnnotationsService;
  import IAnnotation = ngApp.annotations.models.IAnnotation;

  /* @ngInject */
  function annotationsConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("annotations", {
      url: "/annotations",
      controller: "AnnotationsController as asc",
      templateUrl: "annotations/templates/annotations.html",
      resolve: {
        annotations: (AnnotationsService: IAnnotationsService) => {
          return AnnotationsService.getAnnotations();
        }
      }
    });

    $stateProvider.state("annotation", {
      url: "/annotations/:annotationId",
      controller: "AnnotationController as ac",
      templateUrl: "annotations/templates/annotation.html",
      resolve: {
        annotation: ($stateParams: ng.ui.IStateParamsService, AnnotationsService: IAnnotationsService): ng.IPromise<IAnnotation> => {
          return AnnotationsService.getAnnotation($stateParams["annotationId"]);
        }
      }
    });
  }

  angular
      .module("ngApp.annotations", [
        "annotations.controller",
        "ui.router.state"
      ])
      .config(annotationsConfig);
}
