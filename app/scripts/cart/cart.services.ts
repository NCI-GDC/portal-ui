module ngApp.cart.services {

  import IFiles = ngApp.files.models.IFiles;
  import IFile = ngApp.files.models.IFile;
  import IFilesService = ngApp.files.services.IFilesService;
  import IGDCWindowService = ngApp.models.IGDCWindowService;

  export interface ICartService {
    files: IFiles;
    fileIds: string[];
    getFiles(): ng.IPromise<IFiles>;
    add(file: IFile): void;
    addFiles(files: IFile[]): void;
    addAllFiles(): void;
    isInCart(file: IFile): boolean;
    removeAll(): void;
    remove(fileIds: string[]): void;
  }

  class CartService implements ICartService {
    files: IFiles = {
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
    fileIds: string[];
    totalSize: number = 0;

    private static GDC_CART_KEY = "gdc-cart-items";

    /* @ngInject */
    constructor(private FilesService: IFilesService, private $window: IGDCWindowService) {
      this.fileIds = JSON.parse($window.localStorage.getItem(CartService.GDC_CART_KEY) || "[]");
      this.fileIds = this.fileIds || [];
      this.getFiles();
    }

    getFiles(): ng.IPromise<IFiles> {
      var fileIds = this.getAllFileIds();
      fileIds = _.union(this.fileIds, fileIds);

      return this.FilesService.getFilesWithFilters({ filters : { id: fileIds } });
    }

    isInCart(file: IFile): boolean {
      return !!_.where(this.files.hits, { id: file.id }).length;
    }

    private addFileId(fileId: string) {
      if (!_.contains(this.fileIds, fileId)) {
        this.fileIds.push(fileId);
        this.$window.localStorage.setItem(CartService.GDC_CART_KEY, JSON.stringify(this.fileIds));
      }
    }

    add(file: IFile): void {
      if (!this.isInCart(file)) {
        this.files.hits.push(file);
        this.addFileId(file.id);
      }
    }

    addFiles(files: IFile[]): void {
      _.forEach(files, file => this.add(file));
    }

    addAllFiles(): void {
      this.FilesService.getFiles()
      .then((response) => {
        console.log(response);

        this.addFiles(response.hits);
      });
    }

    removeAll(): void {
      this.files.hits = [];
      this.fileIds = [];
      this.$window.localStorage.setItem(CartService.GDC_CART_KEY, JSON.stringify(this.fileIds));
    }

    remove(fileIds: string[]): void {
      this.files.hits = _.reject(this.files.hits, function (hit: IFile) {
        return _.contains(fileIds, hit.id);
      });
      this.fileIds = _.reject(this.fileIds, function (id: string) {
        return _.contains(fileIds, id);
      });
      this.$window.localStorage.setItem(CartService.GDC_CART_KEY, JSON.stringify(this.fileIds));
    }

    getAllFileUrls(): string[] {
      return _.pluck(this.files.hits, "url");
    }

    getFileUrls(fileIds: string[]): string[] {
      return _.pluck(_.filter(this.files.hits, function (hit: IFile) {
        return _.contains(fileIds, hit.id);
      }), "url");
    }

    getAllFileIds(): string[] {
      return _.pluck(this.files.hits, "id");
    }

  }

  angular
      .module("cart.services", [
        "ngApp.files"
      ])
      .service("CartService", CartService);
}

