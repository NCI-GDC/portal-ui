module ngApp.files.controllers {
  import IFile = ngApp.files.models.IFile;
  import IFiles = ngApp.files.models.IFiles;
  import ICoreService = ngApp.core.services.ICoreService;
  import ICartService = ngApp.cart.services.ICartService;

  export interface IFileController {
    file: IFile;
    isInCart(): boolean;
    handleCartButton(): void;
  }

  class FileController implements IFileController {
    /* @ngInject */
    constructor(public file: IFile, private CoreService: ICoreService, private CartService: ICartService) {
      CoreService.setPageTitle("File " + file.file_name);
      angular.forEach(file.participants, (p: any) => {
        p.sc = 0;
        p.poc = 0;
        p.anc = 0;
        p.alc = 0;
        angular.forEach(p.samples, (s:any) => {
          p.sc++;
          angular.forEach(s.portions, (po:any) => {
            p.poc++;
            angular.forEach(po.analytes, (an:any) => {
              p.anc++;
              angular.forEach(an.aliquots, (al:any) => {
                p.alc++;
              });
            });
          });
        });
      });
    }

    isInCart(): boolean {
      return this.CartService.isInCart(this.file.file_uuid);
    }

    handleCartButton(): void {
      if(!this.CartService.isInCart(this.file.file_uuid)) {
        this.CartService.add(this.file);
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
