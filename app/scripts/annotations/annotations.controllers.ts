module ngApp.annotations.controllers {
  import IAnnotation = ngApp.annotations.models.IAnnotation;
  import IAnnotations = ngApp.annotations.models.IAnnotations;

  export interface IAnnotationsController {
    annotations: IAnnotations;
  }

  class AnnotationsController implements IAnnotationsController {
    /* @ngInject */
    constructor(public annotations: IAnnotations) {}
  }

  export interface IAnnotationController {
    annotation: IAnnotation;
  }

  class AnnotationController implements IAnnotationController {
    /* @ngInject */
    constructor(public annotation: IAnnotation) {}
  }

  angular
      .module("annotations.controller", [
        "annotations.services"
      ])
      .controller("AnnotationsController", AnnotationsController)
      .controller("AnnotationController", AnnotationController);
}
