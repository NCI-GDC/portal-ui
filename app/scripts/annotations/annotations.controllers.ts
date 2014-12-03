module ngApp.annotations.controllers {
  import IAnnotation = ngApp.annotations.models.IAnnotation;
  import IAnnotations = ngApp.annotations.models.IAnnotations;
  import ICoreService = ngApp.core.services.ICoreService;
  import IAnnotationsService = ngApp.annotations.services.IAnnotationsService;

  export interface IAnnotationsController {
    annotations: IAnnotations;
  }

  class AnnotationsController implements IAnnotationsController {
    annotations: IAnnotations;

    /* @ngInject */
    constructor(private $scope: ng.IScope, private AnnotationsService: IAnnotationsService, private CoreService: ICoreService) {
      CoreService.setPageTitle("Annotations");
      $scope.$on("$locationChangeSuccess", (event, next: string) => {
        if (next.indexOf("annotations") !== -1) {
          this.refresh();
        }
      });
      this.refresh();
    }

    refresh() {
      this.AnnotationsService.getAnnotations({
        fields: [
          "id",
          "categoryName",
          "dateCreated",
          "createdBy",
          "status",
          "itemType",
          "item",
          "annotationClassificationName"
        ],
        facets: [
          "id",
          "categoryName",
          "dateCreated",
          "createdBy",
          "status",
          "itemType",
          "item",
          "annotationClassificationName"
        ]
      }).then((data) => this.annotations = data);
    }
  }

  export interface IAnnotationController {
    annotation: IAnnotation;
  }

  class AnnotationController implements IAnnotationController {
    /* @ngInject */
    constructor(public annotation: IAnnotation, private CoreService: ICoreService) {
      CoreService.setPageTitle("Annotation", annotation.id);
    }
  }

  angular
      .module("annotations.controller", [
        "annotations.services",
        "core.services"
      ])
      .controller("AnnotationsController", AnnotationsController)
      .controller("AnnotationController", AnnotationController);
}
