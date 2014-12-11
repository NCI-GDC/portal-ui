module ngApp.annotations {
  "use strict";

  import IAnnotationsService = ngApp.annotations.services.IAnnotationsService;
  import IAnnotations = ngApp.annotations.models.IAnnotations;
  import IAnnotation = ngApp.annotations.models.IAnnotation;

  /* @ngInject */
  function annotationsConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("annotations", {
      url: "/annotations",
      controller: "AnnotationsController as asc",
      templateUrl: "annotations/templates/annotations.html",
      resolve: {
        annotations: (AnnotationsService: IAnnotationsService): ng.IPromise<IAnnotations> => {
          return AnnotationsService.getAnnotations();
        }
      },
      reloadOnSearch: false
    });

    $stateProvider.state("annotation", {
      url: "/annotations/:annotationId",
      controller: "AnnotationController as ac",
      templateUrl: "annotations/templates/annotation.html",
      resolve: {
        annotation: ($stateParams: ng.ui.IStateParamsService, AnnotationsService: IAnnotationsService): ng.IPromise<IAnnotation> => {
          console.log(1);
          return AnnotationsService.getAnnotation($stateParams["annotationId"],
            {
              fields: [
                "id",
                "categoryName",
                "createdBy",
                "status",
                "itemType",
                "item",
                "annotationClassificationName",
                "notes.noteText",
                "notes.dateAdded",
                "notes.noteId",
                "notes.addedBy"
              ]
            });
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
