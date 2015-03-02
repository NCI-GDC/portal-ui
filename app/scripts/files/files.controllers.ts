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

      CoreService.setPageTitle("File " + file.file_name);

      this.FilesService.getFiles({
        fields: [
          "archives.archive_id"
        ],
        filters: {"op": "=", "content": {"field": "files.archives.archive_id", "value": [file.archives ? file.archives.archive_id : 0]}}
      }).then((data) => this.archiveCount = data.pagination.total);

      this.annotationIds = _.map(file.annotations, (annotation) => {
        return annotation.annotation_id;
      });

      //this.archiveCount = 0;
    }

    isInCart(): boolean {
      return this.CartService.isInCart(this.file.file_uuid);
    }

    handleCartButton(): void {
      if (!this.CartService.isInCart(this.file.file_uuid)) {
        this.CartService.addFiles([this.file]);
      } else {
        this.CartService.remove([this.file.file_uuid]);
      }
    }

  }

  angular
      .module("files.controller", [
        "files.services"
      ])
      .controller("FileController", FileController);
}

