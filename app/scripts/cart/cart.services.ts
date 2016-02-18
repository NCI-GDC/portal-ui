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
    lastModified: Moment;
    getFiles(): ng.IPromise<IFile>;
    getFileIds(): string[];
    addQuery(query: Object): void;
    add(file: IFile): void;
    addFiles(files: IFile[], displayAddingNotification: boolean): void;
    isInCart(fileId: string): boolean;
    areInCart(files: IFile[]): boolean;
    removeAll(): void;
    remove(fileIds: string[]): void;
    removeFiles(files: IFile[]): void;
    buildAddedMsg(added: Array<Object>, alreadyIn: Array<Object>): string;
    buildRemovedMsg(removedFiles: IFile[]): string;
    undoAdded(): void;
    undoRemoved(): void;
    getMaxSize(): number;
    isFull(): boolean;
    getCartVacancySize(): number;
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

    private static GDC_CART_QUERY = "gdc-cart-query";

    /* @ngInject */
    constructor(private $window: IGDCWindowService,
                private notify: INotifyService,
                private UserService,
                private $rootScope,
                private gettextCatalog,
                private FilesService: IFilesService,
                private $filter: ng.IFilterService,
                private $timeout: ng.ITimeoutService) {
      //var local_files = $window.localStorage.getItem(CartService.GDC_CART_KEY);
      var local_time = $window.localStorage.getItem(CartService.GDC_CART_UPDATE);

      this.lastModified = local_time ? $window.moment(local_time) : $window.moment();
      this.files = [];
      //this.files = local_files ? JSON.parse(local_files) : [];

    }

    addQuery(query: Object): void {
      var oldQuery = JSON.parse(this.$window.localStorage.getItem(CartService.GDC_CART_QUERY)) || {"op": "or", content: []};
      var newQuery = {"op": "or", content: oldQuery.content.concat(query)};
      this.$window.localStorage.setItem(CartService.GDC_CART_QUERY, JSON.stringify(newQuery));
      this.$rootScope.$broadcast("cart-update");
      this._sync();
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

    getFiles(): ng.IPromise<IFile> {
      var filters = JSON.parse(this.$window.localStorage.getItem(CartService.GDC_CART_QUERY));
      return this.FilesService.getFiles({
            fields: ["access",
                     "file_name",
                     "file_id",
                     "file_size",
                     "data_type",
                     "data_format",
                     "annotations.annotation_id",
                     "cases.case_id",
                     "cases.project.project_id",
                     "cases.project.name"
                     ],
            filters: filters,
            size: 20,
            from: 0
          }).then((data): IFile => {
            return data;
          });
    }

    //getFiles(): IFile[] {
      //return this.files;
    //}

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

    isInCart(fileId: string): boolean {
      return _.some(this.files, { "file_id": fileId });
    }

    areInCart(files: IFile[]): boolean {
      return _.every(files, (f) => this.isInCart(f.file_id));
    }

    add(file: IFile): void {
      this.addFiles([file]);
    }

    addFiles(files: IFile[], displayAddingNotification: boolean = true): void {
      if (displayAddingNotification) {
        var addingMsgPromise = this.$timeout(() => {
          this.notify({
            message: "",
            messageTemplate: "<span data-translate>Adding <strong>" + files.length + "</strong> files to cart</span>",
            container: "#notification",
            classes: "alert-info"
          });
        }, 1000);
      }

      this.lastModifiedFiles = [];
      var alreadyIn:IFile[] = [];
      _.forEach(files, (file) => {
        if (!this.isInCart(file.file_id)) {
            var cartItem = _.pick(file,
            'access', 'file_name', 'file_id', 'file_size', 'data_type', 'data_format'
            );
            cartItem.annotationIds = file.annotationIds || _.pluck(file.annotations, 'annotation_id');
            cartItem.caseIds = file.caseIds || _.map(file.cases, c => c.case_id);
            cartItem.projects = file.projects || _.unique(_.map(file.cases, p => {
              return {
                project_id: p.project.project_id,
                name: p.project.name
              };
            }), 'project_id');
            cartItem.related_ids = file.related_ids || _.pluck(file.related_files, "file_id")
            this.lastModifiedFiles.push(cartItem);
        } else {
          alreadyIn.push(file);
        }
      });
      this.files = this.files.concat(this.lastModifiedFiles);
      if (addingMsgPromise) {
        this.$timeout.cancel(addingMsgPromise);
      }
      this.$rootScope.$broadcast("cart-update");
      this._sync();
      this.notify.closeAll();
      this.notify.config({ duration: 5000 });
      this.notify({
        message: "",
        messageTemplate: this.buildAddedMsg(this.lastModifiedFiles, alreadyIn),
        container: "#notification",
        classes: "alert-success"
      });
    }

    sizeWarning() {
      var cartAvailable = this.getCartVacancySize(),
          template = ["Only", this.$filter("number")(cartAvailable)];

      if (cartAvailable !== this.getMaxSize()) {
        if (cartAvailable > 1) {
          template.push("more");
          template.push("files");
        } else if (cartAvailable === 1) {
          template.push("more");
          template.push("file");
        } else {
          template = ["No more files"];
        }
      } else {
        template.push("files");
      }

      template.push("can be added to the cart.");

      template = "<span>" + this.gettextCatalog.getString(template.join(" ")) + "</span>";

      this.notify.config({ duration: 5000 });
      this.notify.closeAll();
      this.notify({
        message: "",
        messageTemplate: template,
        container: "#notification",
        classes: "alert-warning"
      });
    }

    buildAddedMsg(added: Array<Object>, alreadyIn: Array<Object>): string {
      var message = this.gettextCatalog.getPlural(added.length,
                    "<span>Added <strong>" + _.get(_.first(added), "file_name") + "</strong> to the cart.",
                    "<span>Added <strong>" + added.length + "</strong> files to the cart.");

      if (alreadyIn.length) {
        message += this.gettextCatalog.getPlural(alreadyIn.length,
                   added.length === 0 ? "<br />The file was already in cart, not added." : "<strong>" + _.get(_.first(added), "file_name") + "</strong> already in cart, not added",
                   "<br /><strong>" + alreadyIn.length + "</strong> files were already in cart, not added");
      }

      if (added.length !== 0) {
        message += "<br /> <a data-ng-click='undoClicked(\"added\")'><i class='fa fa-undo'></i> Undo</a>";
      }
      return message + "</span>";
    }

    buildRemovedMsg(removedFiles: IFile[]): string {
      var message = this.gettextCatalog.getPlural(removedFiles.length,
                    "<span>Removed <strong>" + _.get(_.first(removedFiles), "file_name") + "</strong> from the cart.",
                    "<span>Removed <strong>" + removedFiles.length + "</strong> files from the cart.");

      if (removedFiles.length !== 0) {
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
      return _.pluck(this.files, "file_id");
    }

    undoAdded(): void {
      this.removeFiles(this.lastModifiedFiles);
    }

    undoRemoved(): void {
      this.addFiles(this.lastModifiedFiles, false);
    }

    _sync(): void {
      this.lastModified = this.$window.moment();
      this.$window.localStorage.setItem(CartService.GDC_CART_UPDATE, this.lastModified.toISOString());
      //this.$window.localStorage.setItem(CartService.GDC_CART_KEY, JSON.stringify(this.files));
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
