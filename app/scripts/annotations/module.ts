module ngApp.annotations {
  "use strict";

  import IAnnotationsService = ngApp.annotations.services.IAnnotationsService;
  import IAnnotation = ngApp.annotations.models.IAnnotation;

  /* @ngInject */
  function annotationsConfig($stateProvider: ng.ui.IStateProvider) {
    $stateProvider.state("annotations", {
      url: "/annotations?filters",
      controller: "AnnotationsController as asc",
      templateUrl: "annotations/templates/annotations.html",
      reloadOnSearch: false
    });

    $stateProvider.state("annotation", {
      url: "/annotations/:annotationId",
      controller: "AnnotationController as ac",
      templateUrl: "annotations/templates/annotation.html",
      resolve: {
        annotation: ($stateParams: ng.ui.IStateParamsService, AnnotationsService: IAnnotationsService): ng.IPromise<IAnnotation> => {
          return AnnotationsService.getAnnotation($stateParams["annotationId"],
            {
              fields: [
                "annotation_id",
                "category",
                "creator",
                "status",
                "entity_type",
                "entity_id",
                "entity_submitter_id",
                "submitter_id",
                "classification",
                "notes",
                "created_datetime",
                "project.project_id",
                "case_id"
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
