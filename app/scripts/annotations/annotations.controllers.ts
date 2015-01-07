module ngApp.annotations.controllers {
  import IAnnotation = ngApp.annotations.models.IAnnotation;
  import IAnnotations = ngApp.annotations.models.IAnnotations;
  import ICoreService = ngApp.core.services.ICoreService;
  import IAnnotationsService = ngApp.annotations.services.IAnnotationsService;

  export interface IAnnotationsController {
    annotations: IAnnotations;
    sortColumns: any;
  }

  class AnnotationsController implements IAnnotationsController {
    annotations: IAnnotations;
    sortColumns: any = [
      {
        key: "categoryName",
        name: "Category"
      },
      {
        key: "createdBy",
        name: "Annotator"
      },
      {
        key: "id",
        name: "ID"
      }
    ];

    /* @ngInject */
    constructor(private $scope: ng.IScope, private AnnotationsService: IAnnotationsService, private CoreService: ICoreService) {
      CoreService.setPageTitle("Annotations");
      $scope.$on("$locationChangeSuccess", (event, next: string) => {
        if (next.indexOf("annotations") !== -1) {
          this.refresh();
        }
      });

      $scope.annotationsColumns = [
      {
        name:"ID",
        id:"id",
        enabled: true
      },
      {
        name:"Participant ID",
        id:"participant_id",
        enabled: true
      },
      {
        name:"Project",
        id:"project",
        enabled: true
      },
      {
        name:"Item Type",
        id:"item_type",
        enabled: true
      },
      {
        name:"Item UUID",
        id:"item_UUID",
        enabled: true
      },
      {
        name:"Item Barcode",
        id:"item_barcode",
        enabled: true
      },
      {
        name:"Classification",
        id:"classification",
        enabled: true
      },
      {
        name:"Category",
        id:"category",
        enabled: true
      },
      {
        name:"Created Date",
        id:"created_date",
        enabled: true
      },
      {
        name:"Annotator",
        id:"annotator",
        enabled: true
      },
      {
        name:"Status",
        id:"status",
        enabled: true
      }
      ];
      

      $scope.annotationsColumnIsEnabled = function(columnId) {
        return CoreService.arrayHasEnabledColumn($scope.annotationsColumns,columnId);
      }


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
