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
  }

  class FileController implements IFileController {
    archiveCount: number = 0;

    /* @ngInject */
    constructor(public file: IFile,
                public $scope: ng.IScope,
                private CoreService: ICoreService,
                private CartService: ICartService,
                private FilesService: IFilesService
                ) {

      CoreService.setPageTitle("File " + file.file_name);
      angular.forEach(file.participants, (p: any) => {
        p.sc = 0;
        p.poc = 0;
        p.anc = 0;
        p.alc = 0;
        angular.forEach(p.samples, (s: any) => {
          p.sc++;
          angular.forEach(s.portions, (po: any) => {
            p.poc++;
            angular.forEach(po.analytes, (an: any) => {
              p.anc++;
              angular.forEach(an.aliquots, (al: any) => {
                p.alc++;
              });
            });
          });
        });
      });
      this.FilesService.getFiles({
        fields: [
          "archive.archive_uuid"
        ],
        filters: {"op": "=", "content": {"field": "files.archive.archive_uuid", "value": [file.archive.archive_uuid]}}
      }).then((data) => this.archiveCount = data.pagination.total);
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

