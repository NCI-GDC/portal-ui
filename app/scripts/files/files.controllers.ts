module ngApp.files.controllers {
  import IFile = ngApp.files.models.IFile;
  import IFiles = ngApp.files.models.IFiles;
  import ICoreService = ngApp.core.services.ICoreService;
  import ICartService = ngApp.cart.services.ICartService;
  import IFilesService = ngApp.files.services.IFilesService;
  import ILocalStorageService = ngApp.components.localStorage.ILocalStorage;

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
                private FilesService: IFilesService,
                private LocalStorageService: ILocalStorageService) {

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
      return this.CartService.isInCart(this.file.file_uuid);
    }

    handleCartButton(): void {
      //this.file.file_uuid => fild_id
      if (!this.CartService.isInCart(this.file.file_uuid)) {
        this.CartService.addFiles([this.file]);
        this.LocalStorageService.cartAddedFiles(this.file.file_id);
        
      } else {
        //this block is not hit
        this.CartService.remove([this.file.file_uuid]);
        //this.LocalStorageService.cartRemovedFiles(this.file.file_id);
      }
    }

  }

  angular
      .module("files.controller", [
        "files.services"
      ])
      .controller("FileController", FileController);
}

