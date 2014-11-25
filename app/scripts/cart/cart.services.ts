module ngApp.cart.services {

  import IFiles = ngApp.files.models.IFiles;
  import IFile = ngApp.files.models.IFile;
  import IFilesService = ngApp.files.services.IFilesService;
  import IGDCWindowService = ngApp.models.IGDCWindowService;

  export interface ICartService {
    files: IFiles;
    getFiles(): IFiles;
    add(file: IFile): void;
    addFiles(files: IFile[]): void;
    isInCart(fileId: string): boolean;
    removeAll(): void;
    remove(fileIds: string[]): void;
  }

  class CartService implements ICartService {
    files: IFiles;

    private static GDC_CART_KEY = "gdc-cart-items";

    /* @ngInject */
    constructor(private $window: ng.IWindowService) {
      var local = $window.localStorage.getItem(CartService.GDC_CART_KEY);
      this.files = local ? JSON.parse(local) : {
        hits: [],
        pagination: {
          count: 0,
          total: 0,
          size: 0,
          from: 0,
          page: 0,
          pages: 0,
          sort: "false",
          order: "false"
        }
      };
    }

    getFiles(): IFiles {
      return this.files;
    }

    isInCart(fileId: string): boolean {
      return !!_.where(this.files.hits, { file_uuid: fileId }).length;
    }

    add(file: IFile): void {
      if (!this.isInCart(file.file_uuid)) {
        this.files.hits.push(file);
        this.$window.localStorage.setItem(CartService.GDC_CART_KEY, JSON.stringify(this.files));
      }
    }

    addFiles(files: IFile[]): void {
      _.forEach(files, file => this.add(file));
    }

    removeAll(): void {
      this.files.hits = [];
    }

    remove(fileIds: string[]): void {
      this.files.hits = _.reject(this.files.hits, function (hit: IFile) {
        return fileIds.indexOf(hit.file_uuid) !== -1;
      });
      this.$window.localStorage.setItem(CartService.GDC_CART_KEY, JSON.stringify(this.files));
    }

    getAllFileUrls(): string[] {
      return _.pluck(this.files.hits, "file_url");
    }

    getFileUrls(fileIds: string[]): string[] {
      return _.pluck(_.filter(this.files.hits, function (hit: IFile) {
        return _.contains(fileIds, hit.file_uuid);
      }), "file_url");
    }

    getAllFileIds(): string[] {
      return _.pluck(this.files.hits, "file_uuid");
    }

  }

  angular
      .module("cart.services", [
        "ngApp.files"
      ])
      .service("CartService", CartService);
}

