module ngApp.cart.services {

  import IFiles = ngApp.files.models.IFiles;
  import IFile = ngApp.files.models.IFile;
  import IFilesService = ngApp.files.services.IFilesService;
  import IGDCWindowService = ngApp.models.IGDCWindowService;

  export interface ICartService {
    files: IFiles;
    lastModified: Moment;
    getFiles(): IFiles;
    getSelectedFiles(): IFile[];
    getFileUrls(): string[];
    getFileIds(): string[];
    add(file: IFile): void;
    addFiles(files: IFile[]): void;
    isInCart(fileId: string): boolean;
    areInCart(files: IFile[]): boolean;
    removeAll(): void;
    remove(fileIds: string[]): void;
    removeFiles(files: IFile[]): void;
  }

  class CartService implements ICartService {
    files: IFiles;
    lastModified: Moment;

    private static GDC_CART_KEY = "gdc-cart-items";
    private static GDC_CART_UPDATE = "gdc-cart-updated";

    /* @ngInject */
    constructor(private $window: IGDCWindowService,
                private ngToast: any) {
      var local_files = $window.localStorage.getItem(CartService.GDC_CART_KEY);
      var local_time = $window.localStorage.getItem(CartService.GDC_CART_UPDATE);

      this.lastModified = local_time ? $window.moment(local_time) : $window.moment();
      this.files = local_files ? JSON.parse(local_files) : {
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

    getSelectedFiles(): IFile[] {
      return _.where(this.files.hits, {selected: true});
    }

    isInCart(fileId: string): boolean {
      return _.some(this.files.hits, {file_uuid: fileId});
    }

    areInCart(files: IFile[]): boolean {
      return _.every(files, (f) => this.isInCart(f.file_uuid));
    }

    add(file: IFile): void {
      this.addFiles([file]);
    }

    addFiles(files: IFile[]): void {
      var numAdded = 0;
      var lastAddedFileName = "";
      _.forEach(files, (file) => {
        if (!this.isInCart(file.file_uuid)) {
          file.selected = true;
          this.files.hits.push(file);
          numAdded++;
          lastAddedFileName = file.file_name;
        }
      });
      this._sync();
      if (numAdded == 1) {
        this.ngToast.create("added file <b>" + lastAddedFileName + "</b> to the cart");
      } else {
        this.ngToast.create("added <b>" + numAdded + "</b> files added to the cart");
      }
    }

    removeAll(): void {
      this.files.hits = [];
      this._sync();
    }

    remove(fileIds: string[]): void {
      this.files.hits = _.reject(this.files.hits, function (hit: IFile) {
        return fileIds.indexOf(hit.file_uuid) !== -1;
      });
      this._sync();
    }

    removeFiles(files: IFile[]): void {
      var ids: string[] = _.pluck(files, "file_uuid");
      this.remove(ids);
    }


    getFileUrls(): string[] {
      return _.pluck(this.getSelectedFiles(), "file_url");
    }

    getFileIds(): string[] {
      return _.pluck(this.getSelectedFiles(), "file_uuid");
    }

    _sync() {
      this.lastModified = this.$window.moment();
      this.$window.localStorage.setItem(CartService.GDC_CART_UPDATE, this.lastModified.toISOString());
      this.$window.localStorage.setItem(CartService.GDC_CART_KEY, JSON.stringify(this.files));
    }
  }

  angular
      .module("cart.services", [
        "ngApp.files",
        "ngToast"
      ])
      .service("CartService", CartService);
}

