module ngApp.files.controllers {
  import IFile = ngApp.files.models.IFile;
  import IFiles = ngApp.files.models.IFiles;
  import ICoreService = ngApp.core.services.ICoreService;
  import ICartService = ngApp.cart.services.ICartService;
  import IFilesService = ngApp.files.services.IFilesService;

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
      return this.file.data_type.toLowerCase() === "raw sequencing data" &&
             this.file.data_subtype.toLowerCase() === "aligned reads" &&
             _.indexOf(_.pluck(this.file.related_files, 'type'), "bai") !== -1;
    }

  }

  class BAMSlicingController {

    /* @ngInject */
    constructor (private $modalInstance,
                 private $scope: ng.IScope,
                 private FilesService: IFilesService,
                 public fileID: string,
                 public completeCallback: any) {}

    submit(): void {
      if(this.$scope.bedModel) {
        this.FilesService.sliceBAM(this.fileID, this.$scope.bedModel, this.completeCallback);
        this.$modalInstance.dismiss('slicing');
      } else {
        this.$modalInstance.dismiss('cancelled');
      }
    }

    closeModal(): void {
      this.$modalInstance.dismiss('cancelled');
    }
  }

  class BAMFailedModalController {
    public errorBlobString: string;
    /* @ngInject */
    constructor(private $modalInstance,
                public errorStatus: string,
                public errorMsg: string,
                private errorBlob: any) {
      this.errorBlobString = "";
      var reader = new FileReader();
      reader.addEventListener("loadend", () => {
        this.errorBlobString = _.get(JSON.parse(reader.result), "error", "Error slicing");
      });
      reader.readAsText(errorBlob);
    }
  }


  angular
      .module("files.controller", [
        "files.services"
      ])
      .controller("BAMSlicingController", BAMSlicingController)
      .controller("BAMFailedModalController", BAMFailedModalController)
      .controller("FileController", FileController);
}

