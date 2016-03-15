module ngApp.files.controllers {
  import IFile = ngApp.files.models.IFile;
  import IFiles = ngApp.files.models.IFiles;
  import ICoreService = ngApp.core.services.ICoreService;
  import ICartService = ngApp.cart.services.ICartService;
  import IFilesService = ngApp.files.services.IFilesService;
  import IGqlService = ngApp.components.gql.IGqlService;

  export interface IFileController {
    file: IFile;
    isInCart(): boolean;
    handleCartButton(): void;
    archiveCount: number;
    annotationIds: string[];
  }

  class FileController implements IFileController {
    archiveCount: number = 0;
    annotationIds: string[] = [];

    /* @ngInject */
    constructor(public file: IFile,
                public $scope: ng.IScope,
                private CoreService: ICoreService,
                private CartService: ICartService,
                private FilesService: IFilesService
                ) {

      CoreService.setPageTitle("File", file.file_name);

      if (this.file.archive) {
        this.FilesService.getFiles({
          fields: [
            "archive.archive_id"
          ],
          filters: {"op": "=", "content": {"field": "files.archive.archive_id", "value": [file.archive.archive_id]}}
        }).then((data) => this.archiveCount = data.pagination.total);
      } else {
        this.archiveCount = 0;
      }

      _.every(file.associated_entities, (entity) => {
        entity.annotations = _.filter(file.annotations, (annotation) => {
          return annotation.entity_id === entity.entity_id;
        });

        if (entity.annotations) {
          entity.annotations = _.pluck(entity.annotations, "annotation_id");
        }
      });

      //insert cases into related_files for checking isUserProject when downloading
      _.forEach(file.related_files, (related_file) => {
        related_file['cases'] = file.cases;
      });

    }

    isInCart(): boolean {
      return this.CartService.isInCart(this.file.file_id);
    }

    handleCartButton(): void {
      if (this.CartService.isInCart(this.file.file_id)) {
        this.CartService.remove([this.file.file_id]);
      } else {
        this.CartService.addFiles([this.file], true);
      }
    }

    canBAMSlice(): boolean {
      return (this.file.data_type || '').toLowerCase() === 'aligned reads' &&
             (this.file.data_format || '').toLowerCase() === 'bam';
    }

  }

  class BAMSlicingController {

    exampleShowing: boolean = false;
    /* @ngInject */
    constructor (private $uibModalInstance,
                 private $scope: ng.IScope,
                 private FilesService: IFilesService,
                 public file: any,
                 private GqlService: IGqlService,
                 public completeCallback: any) {
       this.$scope.bedModel = "";
     }

    submit(): void {
      this.FilesService.sliceBAM(this.file.file_id, this.$scope.bedModel, this.completeCallback);
      this.$uibModalInstance.dismiss('slicing');
    }

    allowTab($event: any): void {
      if (event.keyCode === 9) {
        event.preventDefault();

        // current caret pos
        var start = $event.target.selectionStart;
        var end = $event.target.selectionEnd;

        var oldValue = this.$scope.bedModel;
        this.$scope.bedModel = oldValue.substring(0, start) + '\t' + oldValue.substring(end);
        // put caret in correct place
        this.GqlService.setPos($event.target, start+1);
      }
    }

    toggleExample() {
      this.exampleShowing = !this.exampleShowing;
    }

    closeModal(): void {
      this.$uibModalInstance.dismiss('cancelled');
    }
  }

  class BAMFailedModalController {
    msg: string = "Invalid BED Format. Please refer to the examples described in the BAM Slicing pop-up.";
    /* @ngInject */
    constructor(private $uibModalInstance,
                public errorStatus: string,
                public errorMsg: string,
                private errorBlob: any) {}
  }


  angular
      .module("files.controller", [
        "files.services"
      ])
      .controller("BAMSlicingController", BAMSlicingController)
      .controller("BAMFailedModalController", BAMFailedModalController)
      .controller("FileController", FileController);
}

