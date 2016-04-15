module ngApp.annotations.controllers {
  import IAnnotation = ngApp.annotations.models.IAnnotation;
  import IAnnotations = ngApp.annotations.models.IAnnotations;
  import ICoreService = ngApp.core.services.ICoreService;
  import IAnnotationsService = ngApp.annotations.services.IAnnotationsService;
  import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;
  import IFacetService = ngApp.components.facets.services.IFacetService;


  export interface IAnnotationsController {
    annotations: IAnnotations;
  }

  interface IAnnotationsScope extends ng.IScope {
    tableConfig:TableiciousConfig;
  }

  class AnnotationsController implements IAnnotationsController {
    annotations: IAnnotations;

    /* @ngInject */
    constructor(private $scope: IAnnotationsScope, private AnnotationsService: IAnnotationsService,
                private CoreService: ICoreService, private AnnotationsTableModel:TableiciousConfig,
                private FacetService: IFacetService
    ) {
      CoreService.setPageTitle("Annotations");
      $scope.$on("$locationChangeSuccess", (event, next: string) => {
        if (next.indexOf("annotations") !== -1) {
          this.refresh();
        }
      });
      $scope.$on("gdc-user-reset", () => {
        this.refresh();
      });

      $scope.tableConfig = AnnotationsTableModel;

      this.refresh();
    }

    refresh() {
      this.AnnotationsService.getAnnotations({
        fields: this.AnnotationsTableModel.fields,
        expand: this.AnnotationsTableModel.expand,
        facets: this.FacetService.filterFacets(this.AnnotationsTableModel.facets)
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
      CoreService.setPageTitle("Annotation", annotation.annotation_id);
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
