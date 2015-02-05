module ngApp.annotations.controllers {
  import IAnnotation = ngApp.annotations.models.IAnnotation;
  import IAnnotations = ngApp.annotations.models.IAnnotations;
  import ICoreService = ngApp.core.services.ICoreService;
  import IAnnotationsService = ngApp.annotations.services.IAnnotationsService;
  import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;

  export interface IAnnotationsController {
    annotations: IAnnotations;
    sortColumns: any;
  }

  interface IAnnotationsScope extends ng.IScope {
    tableConfig:TableiciousConfig;
  }

  class AnnotationsController implements IAnnotationsController {
    annotations: IAnnotations;


    /* @ngInject */
    constructor(private $scope: IAnnotationsScope, private AnnotationsService: IAnnotationsService, private CoreService: ICoreService, AnnotationsTableModel:TableiciousConfig) {
      CoreService.setPageTitle("Annotations");
      $scope.$on("$locationChangeSuccess", (event, next: string) => {
        if (next.indexOf("annotations") !== -1) {
          this.refresh();
        }
      });

      $scope.tableConfig = AnnotationsTableModel;

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
          "categoryName",
          "dateCreated",
          "createdBy",
          "status",
          "itemType",
          "item",
          "annotationClassificationName"
        ]
      }).then((data) => {
        if (!data.hits.length) {
          this.CoreService.setSearchModelState(true);
        }

        this.annotations = data;
      });
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
        "core.services",
        "annotations.table.model"
      ])
      .controller("AnnotationsController", AnnotationsController)
      .controller("AnnotationController", AnnotationController);
}
