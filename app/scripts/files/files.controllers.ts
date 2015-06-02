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

      this.file.related_ids = _.pluck(this.file.related_files, 'file_id');

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

