module ngApp.cart.services {

  import IFiles = ngApp.files.models.IFiles;
  import IFile = ngApp.files.models.IFile;
  import IFilesService = ngApp.files.services.IFilesService;
  import IGDCWindowService = ngApp.models.IGDCWindowService;
  import INotify = ng.cgNotify.INotify;
  import IUserService = ngApp.components.user.services.IUserService;

  export interface ICartService {
    files: IFile[];
    lastModified: Moment;
    getFiles(): IFile[];
    getSelectedFiles(): IFile[];
    getFileUrls(): string[];
    getFileIds(): string[];
    add(file: IFile): void;
    addFiles(files: IFile[]): Object;
    isInCart(fileId: string): boolean;
    areInCart(files: IFile[]): boolean;
    removeAll(): void;
    remove(fileIds: string[]): void;
    removeFiles(files: IFile[]): void;
    buildAddedMsg(addedAndAlreadyIn: Object): string;
  }

  class CartService implements ICartService {
    files: IFile[];
    lastModified: Moment;

    private static GDC_CART_KEY = "gdc-cart-items";
    private static GDC_CART_UPDATE = "gdc-cart-updated";

    /* @ngInject */
    constructor(private $window: IGDCWindowService,
                private notify: INotify,
                private UserService: IUserService) {
      var local_files = $window.localStorage.getItem(CartService.GDC_CART_KEY);
      var local_time = $window.localStorage.getItem(CartService.GDC_CART_UPDATE);

      this.lastModified = local_time ? $window.moment(local_time) : $window.moment();
      this.files = local_files ? JSON.parse(local_files) : [];
    }

    getFiles(): IFile[] {
      var filtered: boolean = this.UserService.currentUser && this.UserService.currentUser.isFiltered;
      return filtered ? _.filter(this.files, (file: IFile) : boolean => {
        return this.UserService.currentUser.projects.indexOf(file.archive.disease_code) !== -1;
      }) : this.files;
    }

    getSelectedFiles(): IFile[] {
      return _.where(this.getFiles(), {selected: true});
    }

    isInCart(fileId: string): boolean {
      return _.some(this.files, {file_uuid: fileId});
    }

    areInCart(files: IFile[]): boolean {
      return _.every(files, (f) => this.isInCart(f.file_uuid));
    }

    add(file: IFile): void {
      this.addFiles([file]);
    }

    addFiles(files: IFile[]): Object {
      var addedFiles:IFile[] = [];
      var alreadyIn:IFile[] = [];
      _.forEach(files, (file) => {
        if (!this.isInCart(file.file_uuid)) {
          file.selected = true;
          this.files.push(file);
          addedFiles.push(file);
        } else {
          alreadyIn.push(file);
        }
      });
      this._sync();
      return { "added": addedFiles, "alreadyIn": alreadyIn };
    }

    buildAddedMsg(addedAndAlreadyIn: Object): string {
      console.log(addedAndAlreadyIn);
      var added = addedAndAlreadyIn["added"];
      var alreadyIn = addedAndAlreadyIn["alreadyIn"];
      var message = '<span>added ';
      if (added.length === 1) {
        message += 'file <b>' + added[0].file_name + '</b>';
      } else {
        message += '<b>' + added.length + '</b> files';
      }
      message += ' to the cart.';
      if(alreadyIn.length > 0) {
        message += '<br /><b>' + alreadyIn.length + '</b> files already in cart, not added.';
      }
      if(added.length !== 0)
        message += '<br /> <a ng-click="sc.undo()"><i class="fa fa-undo"></i> Undo</a>';

      return message + '</span>';

    }

    removeAll(): void {
      this.files = [];
      this._sync();
    }

    remove(fileIds: string[]): void {
      this.files = _.reject(this.files, function (hit: IFile) {
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
        "user.services",
        "cgNotify"
      ])
      .service("CartService", CartService);
}

