module ngApp.cart.services {

  import IFiles = ngApp.files.models.IFiles;
  import IFile = ngApp.files.models.IFile;

  export interface ICartService {
    files: IFiles;
    getFiles(): IFiles;
    add(file: IFile): void;
    removeAll(): void;
    remove(fileIds: string[]): void;
  }

    class CartService implements ICartService {
      files: IFiles;
      totalSize: number = 0;

    /* @ngInject */
    constructor () {
      this.files = { hits: [],
              pagination: {
                count: 0,
                total: 0,
                size: 0,
                from: 0,
                page: 0,
                pages: 0,
                sort: "false",
                order: "false"
              }};
      this.getFiles();
    }

    getFiles(): IFiles {
      //TODO: get files from localstorage
      return this.files;
    }

    getNumFiles(): number {
      return this.files.hits.length;
    }

    add(file: IFile): void {
      if(_.where(this.files.hits, { id: file.id} ).length === 0) {
        this.files.hits.push(file);
      }
    }

    removeAll(): void {
      this.files.hits = [];
    }

    remove(fileIds: string[]): void {
      this.files.hits = _.reject(this.files.hits, function(hit) {
        return _.contains(fileIds, hit.id);
      });
    }

    getAllFileUrls(): string[] {
      return _.pluck(this.files.hits, 'url');
    }

    getFileUrls(fileIds: string[]) : string[] {
      return _.pluck(_.filter(this.files.hits, function(hit) {
        return _.contains(fileIds, hit.id);
      }), 'url');
    }

    getAllFileIds(): string[] {
      return _.pluck(this.files.hits, 'id');
    }

  }

  angular
    .module("cart.services", [
        "ngApp.files"
        ])
    .service("CartService", CartService);
}

