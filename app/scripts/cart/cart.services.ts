module ngApp.cart.services {

  import IFiles = ngApp.files.models.IFiles;
  import IFile = ngApp.files.models.IFile;
  import IFilesService = ngApp.files.services.IFilesService;
  import ITabs = ngApp.search.services.ITabs;
  import ITab = ngApp.search.services.ITab;
  import IGDCWindowService = ngApp.core.models.IGDCWindowService;
  import INotifyService = ng.cgNotify.INotifyService;

  export interface ICartService {
    files: IFile[];
    projectsMap: {};
    lastModified: Moment;
    getFiles(): IFile[];
    getSelectedFiles(): IFile[];
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
    selectFile(file: IFile): void;
    getAuthorizedFiles(): IFile[];
    getUnauthorizedFiles(): IFile[];
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
                private notify: INotifyService, private UserService, private $rootScope,
                private LZString, private gettextCatalog) {
      var local_files = LZString.decompress($window.localStorage.getItem(CartService.GDC_CART_KEY));
      var local_time = LZString.decompress($window.localStorage.getItem(CartService.GDC_CART_UPDATE));

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

    getFile(fileId: string) {
      return _.find(this.getFiles(), { "file_id": fileId });
    }

    getAuthorizedFiles(): IFile[] {
      return this.files.filter((file)=>{
        return this.UserService.userCanDownloadFile(file);
      });
    }

    getUnauthorizedFiles(): IFile[] {
      return this.files.filter((file)=>{
        return !this.UserService.userCanDownloadFile(file);
      });
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
          var projectIds = file.projects;
          var annotationIds = file.annotationIds;
          var participantIds = file.participantId;
          // We are not loading a file in from an undo action
          if (file.participants) {
             projectIds = _.unique(_.map(file.participants, (participant) => {
              return participant.project.project_id;
            }));
            annotationIds = _.map(file.annotations, (annotation) => {
              return annotation.annotation_id;
            });
            participantIds = _.map(file.participants, (participant) => {
              return participant.participant_id;
            });
          }

          var fileNeededFieldsOnly = {
            'selected': true,
            'access': file.access || '--',
            'file_name': file.file_name || '--',
            'file_id': file.file_id || '--',
            'annotationIds': annotationIds,
            'participantNum': participantIds ? participantIds.length : 0,
            'participantId': participantIds ? participantIds : [],
            'projects': projectIds,
            'data_type': file.data_type || '--',
            'data_format': file.data_format || '--',
            'file_size': file.file_size || 0,
            'date_added_to_cart':Date.now(),
            'related_ids': file.related_ids || _.pluck(file.related_files, "file_id")
          };
          this.files.push(fileNeededFieldsOnly);
          addedFiles.push(fileNeededFieldsOnly);
        } else {
          alreadyIn.push(fileNeededFieldsOnly);
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

    sizeWarning() {
      var template = "<span>" + this.gettextCatalog.getString("Only") + " " +
                     this.getCartVacancySize() + " "  +
                     this.gettextCatalog.getString("more files can be added") +
                     " " + this.gettextCatalog.getString("to the cart") + ".</span>";

      this.notify.config({ duration: 5000 });
      this.notify.closeAll();
      this.notify({
        message: "",
        messageTemplate: template,
        container: "#notification",
        classes: "alert-warning"
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
      if (alreadyIn.length > 0) {
        message += "<br /><b>" + alreadyIn.length + "</b> files already in cart, not added.";
      }
      if (added.length !== 0) {
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

      this.$rootScope.$broadcast("cart-update");
    }

    removeFiles(files: IFile[]): void {
      var ids: string[] = _.pluck(files, "file_id");
      this.remove(ids);
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

    _sync(): void {
      this.lastModified = this.$window.moment();
      this.$window.localStorage.setItem(CartService.GDC_CART_UPDATE, LZString.compress(this.lastModified.toISOString()));
      this.$window.localStorage.setItem(CartService.GDC_CART_KEY, LZString.compress(JSON.stringify(this.files)));
    }

    selectFile(file: IFile) {
      var fileInCart = this.getFile(file.file_id);

      if (fileInCart) {
        fileInCart.selected = !fileInCart.selected;
      }
    }

  }

  export interface ICartState {
    tabs: ITabs;
    setActive(section: string, s: string): void;
  }

  class State implements ICartState {
    tabs: ITabs = {
      summary: {
        active: false
      },
      items: {
        active: false
      }
    };

    setActive(section: string, tab: string) {
      if (section && tab) {
        _.each(this[section], function (section: ITab) {
          section.active = false;
        });

        this[section][tab].active = true;
      }
    }
  }

  angular
      .module("cart.services", [
        "ngApp.files",
        "cgNotify"
      ])
      .service("CartState", State)
      .service("CartService", CartService);
}

