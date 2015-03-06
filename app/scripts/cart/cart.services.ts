module ngApp.cart.services {

  import IFiles = ngApp.files.models.IFiles;
  import IFile = ngApp.files.models.IFile;
  import IFilesService = ngApp.files.services.IFilesService;
  import IGDCWindowService = ngApp.models.IGDCWindowService;
  import INotifyService = ng.cgNotify.INotifyService;

  export interface ICartService {
    files: IFile[];
    lastModified: Moment;
    getFiles(): IFile[];
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
    buildAddedMsg(addedAndAlreadyIn: Object): string;
    buildRemovedMsg(removedFiles: IFile[]): string;
    undoAdded(): void;
    undoRemoved(): void;
    getMaxSize(): number;
    isFull(): boolean;
    getCartVacancySize(): number;
  }

  class CartService implements ICartService {
    files: IFile[];
    lastModified: Moment;
    lastModifiedFiles: IFile[];

    private static GDC_CART_KEY = "gdc-cart-items";
    private static GDC_CART_UPDATE = "gdc-cart-updated";
    private static MAX_SIZE: number = 10000;

    /* @ngInject */
    constructor(private $window: IGDCWindowService,
                private notify: INotifyService) {
      var local_files = $window.localStorage.getItem(CartService.GDC_CART_KEY);
      var local_time = $window.localStorage.getItem(CartService.GDC_CART_UPDATE);

      this.lastModified = local_time ? $window.moment(local_time) : $window.moment();
      this.files = local_files ? JSON.parse(local_files) : [];
    }

    getMaxSize(): number {
      return CartService.MAX_SIZE;
    }

    isFull(): boolean {
      return this.files.length >= CartService.MAX_SIZE;
    }

    getCartVacancySize(): number {
      return this.getMaxSize() - this.getFiles().length;
    }

    getFiles(): IFile[] {
      return this.files;
    }

    getSelectedFiles(): IFile[] {
      return _.where(this.getFiles(), {selected: true});
    }

    isInCart(fileId: string): boolean {
      return _.some(this.files, { "file_id": fileId });
    }

    areInCart(files: IFile[]): boolean {
      return _.every(files, (f) => this.isInCart(f.file_id));
    }

    add(file: IFile): void {
      this.addFiles([file]);
    }

    addFiles(files: IFile[]): void {
      var addedFiles:IFile[] = [];
      var alreadyIn:IFile[] = [];
      _.forEach(files, (file) => {
        if (!this.isInCart(file.file_id)) {
          file.selected = true;
          file.projectIds = _.unique(_.map(file.participants, (participant) => {
            return participant.project.project_id;
          }));
          file.annotationIds = _.map(file.annotations, (annotation) => {
            return annotation.annotation_id;
          });
          this.files.push(file);
          addedFiles.push(file);
        } else {
          alreadyIn.push(file);
        }
      });
      this._sync();
      this.lastModifiedFiles = addedFiles;
      this.notify.config({ duration: 5000 });
      this.notify.closeAll();
      this.notify({
          message: "",
          messageTemplate: this.buildAddedMsg({"added": addedFiles, "alreadyIn": alreadyIn }),
          container: "#notification",
          classes: "alert-success"
      });
    }

    buildAddedMsg(addedAndAlreadyIn: Object): string {
      var added = addedAndAlreadyIn["added"];
      var alreadyIn = addedAndAlreadyIn["alreadyIn"];

      var message = "<span>Added ";
      if (added.length === 1) {
        message += "file <b>" + added[0].file_name + "</b>";
      } else {
        message += "<b>" + added.length + "</b> files";
      }
      message += " to the cart.";
      if(alreadyIn.length > 0) {
        message += "<br /><b>" + alreadyIn.length + "</b> files already in cart, not added.";
      }
      if(added.length !== 0) {
        message += "<br /> <a data-ng-click='undoClicked(\"added\")'><i class='fa fa-undo'></i> Undo</a>";
      }
      return message + "</span>";

    }

    buildRemovedMsg(removedFiles: IFile[]): string {
      var message = "<span>Removed ";
      if (removedFiles.length === 1) {
        message += "file <b>" + removedFiles[0].file_name + "</b>";
      } else {
        message += "<b>" + removedFiles.length + "</b> files";
      }
      message += " from the cart.";
      if(removedFiles.length !== 0) {
        message += "<br /> <a data-ng-click='undoClicked(\"removed\")'><i class='fa fa-undo'></i> Undo</a>";
      }
      return message + "</span>";
    }

    removeAll(): void {
      this.notify.closeAll();
      this.notify({
        message: "",
        messageTemplate: this.buildRemovedMsg(this.files),
        container: "#notification",
        classes: "alert-warning"
      });
      this.lastModifiedFiles = this.files;
      this.files = [];
      this._sync();
    }

    remove(fileIds: string[]): void {
      var remaining = _.reject(this.files, function (hit: IFile) {
        return fileIds.indexOf(hit.file_id) !== -1;
      });
      this.lastModifiedFiles = _.difference(this.files, remaining);
      this._sync();
      this.notify.closeAll();
      this.notify({
        message: "",
        messageTemplate: this.buildRemovedMsg(this.lastModifiedFiles),
        container: "#notification",
        classes: "alert-warning"
      });
      this.files = remaining;
      this._sync();
    }

    removeFiles(files: IFile[]): void {
      var ids: string[] = _.pluck(files, "file_id");
      this.remove(ids);
    }

    getFileUrls(): string[] {
      return _.pluck(this.getSelectedFiles(), "file_url");
    }

    getFileIds(): string[] {
      return _.pluck(this.getSelectedFiles(), "file_id");
    }

    undoAdded(): void {
      this.removeFiles(this.lastModifiedFiles);
    }

    undoRemoved(): void {
      this.addFiles(this.lastModifiedFiles);
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
        "cgNotify"
      ])
      .service("CartService", CartService);
}

