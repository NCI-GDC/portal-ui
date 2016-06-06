module ngApp.cart.services {

  import IFiles = ngApp.files.models.IFiles;
  import IFile = ngApp.files.models.IFile;
  import IFilesService = ngApp.files.services.IFilesService;
  import ILocalStorageService = ngApp.core.services.ILocalStorageService;
  import ITabs = ngApp.search.services.ITabs;
  import ITab = ngApp.search.services.ITab;
  import IGDCWindowService = ngApp.core.models.IGDCWindowService;
  import INotifyService = ng.cgNotify.INotifyService;

  export interface IQueryCartService {
    files: IFiles;
    pushAddedQuery(query: Object): void;
    pushRemovedQuery(query: Object): void;
    addFile(): void;
    isInCart(fileId: string): boolean;
  }

  class QueryCartService implements IQueryCartService {
    private static GDC_CART_ADDED_QUERY: string = "gdc-cart-added-query";
    private static GDC_CART_REMOVED_QUERY: string = "gdc-cart-removed-query";
    private static GDC_CART_ADDED_FILES: string = "gdc-cart-added-files";
    private static GDC_CART_REMOVED_FILES: string = "gdc-cart-removed-files";

    public files: IFiles;
    /* @ngInject */
    constructor(private $window: IGDCWindowService,
                private $q: ng.IQService,
                private FilesService: IFilesService,
                private LocalStorageService: ILocalStorageService) {
                this.files = { hits: [],
                              pagination: { total: 0 }
                            };
                this.getFiles();
    }

    pushAddedQuery(query: Object): void {
      var oldQuery = this.LocalStorageService.getItem(QueryCartService.GDC_CART_ADDED_QUERY, {"op": "or", content: []});
      // if user clicked add all and the query is empty
      var newQuery = {"op": "or", content: Object.keys(query).length ? oldQuery.content.concat(query) : []};
      this.LocalStorageService.setItem(QueryCartService.GDC_CART_ADDED_QUERY, newQuery);
      this.getFiles();
    }

    pushRemovedQuery(query: Object): void {
      var oldQuery = this.LocalStorageService.getItem(QueryCartService.GDC_CART_REMOVED_QUERY, {"op": "or", content: []});
      var newQuery = {"op": "or", content: oldQuery.content.concat(query)};
      this.LocalStorageService.setItem(QueryCartService.GDC_CART_REMOVED_QUERY, newQuery);
      this.getFiles();
    }

    pushAddedFiles(fileIds: string[]): void {
      var oldFileIds = this.LocalStorageService.getItem(QueryCartService.GDC_CART_ADDED_FILES, []);
      this.LocalStorageService.setItem(QueryCartService.GDC_CART_ADDED_FILES, oldFileIds.concat(fileIds));
      this.getFiles();
    }

    pushRemovedFiles(fileIds: string[]): void {
      var oldFileIds = this.LocalStorageService.getItem(QueryCartService.GDC_CART_REMOVED_FILES, []);
      this.LocalStorageService.setItem(QueryCartService.GDC_CART_REMOVED_FILES, oldFileIds.concat(fileIds));
      this.getFiles();
    }

    isInCart(fileId: string): boolean {
      //todo: better way to do this that includes the files defined by addedQuery
      var fileIds = this.LocalStorageService.getItem(QueryCartService.GDC_CART_ADDED_FILES, []);
      return fileIds.find(f => f === fileId) ? true : false;
    }

    getFiles(): ng.IPromise<IFile> {
      var addedQuery = this.LocalStorageService.getItem(QueryCartService.GDC_CART_ADDED_QUERY);
      var removedQuery = this.LocalStorageService.getItem(QueryCartService.GDC_CART_REMOVED_QUERY);
      //incomplete
      var filters = removedQuery ? {"op":"and","content":[addedQuery, removedQuery]} : addedQuery;
      if (filters) {
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
              filters: filters.content.length ? filters : '', // empty content gives api error so send no filter
              size: 20,
              from: 0
            }).then((data): IFile => {
              this.files = data;
              return data;
            });
      } else {
        // if there was no filter sending an empty query to ES returns everything
        // so don't send a request but return an empty promise
        return this.$q((resolve) => {
          var data = {hits: [], pagination: { total: 0}}
          this.files = data;
          resolve(data)
        });
      }
    }
  }

  export interface ICartService {
    files: IFile[];
    lastModified: Moment;
    getFiles(): IFile[];
    getFileIds(): string[];
    add(file: IFile): void;
    addFiles(files: IFile[], displayAddingNotification: boolean): void;
    isInCart(fileId: string): boolean;
    areInCart(files: IFile[]): boolean;
    removeAll(): void;
    remove(files: IFile[]): void;
    buildAddedMsg(added: Array<Object>, alreadyIn: Array<Object>): string;
    buildRemovedMsg(removedFiles: IFile[]): string;
    undoAdded(): void;
    undoRemoved(): void;
    getMaxSize(): number;
    isFull(): boolean;
    getCartVacancySize(): number;
    getAuthorizedFiles(): IFile[];
    getUnauthorizedFiles(): IFile[];
    reloadFromLocalStorage(): void;
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
                private notify: INotifyService,
                private UserService,
                private LocalStorageService: ILocalStorageService,
                private $rootScope,
                private gettextCatalog,
                private $filter: ng.IFilterService,
                private $timeout: ng.ITimeoutService,
                private $uibModal,
                private $uibModalStack
              ) {
      this.reloadFromLocalStorage();
    }

    reloadFromLocalStorage(): void {
      var localTime = this.LocalStorageService.getItem(CartService.GDC_CART_UPDATE);
      this.lastModified = localTime ? this.$window.moment(localTime) : this.$window.moment();
      this.files = this.LocalStorageService.getItem(CartService.GDC_CART_KEY, []);
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
      return this.files.filter( (file) => {
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
      if (navigator.cookieEnabled) {
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

        files.forEach(file => {
          if (!this.isInCart(file.file_id)) {
              this.lastModifiedFiles.push(file);
          } else {
            alreadyIn.push(file);
          }
        });

        this.files = this.files.concat(this.lastModifiedFiles);

        if (addingMsgPromise) {
          this.$timeout.cancel(addingMsgPromise);
        }

        this._sync();
        this.notify.closeAll();

        this.notify.config({ duration: 5000 });
        this.notify({
          message: "",
          messageTemplate: this.buildAddedMsg(this.lastModifiedFiles, alreadyIn),
          container: "#notification",
          classes: "alert-success"
        });
      } else {
        this.$timeout(() => {
          if (!this.$uibModalStack.getTop()) {
            var modalInstance = this.$uibModal.open({
              templateUrl: "core/templates/enable-cookies.html",
              controller: "WarningController",
              controllerAs: "wc",
              backdrop: "static",
              keyboard: false,
              backdropClass: "warning-backdrop",
              animation: false,
              resolve: { warning: null }
            });
          }
        });
      }
    }

    sizeWarning() {
      var cartAvailable = this.getCartVacancySize()
      var template = [
        "The cart is limited to " + this.$filter("number")(this.getMaxSize()) + " files.",
        !this.files.length
          ? "Please narrow down your search criteria to be able to add files to your cart."
          : this.files.length < this.getMaxSize()
            ? this.$filter("number")(cartAvailable) + getRemaining() + "can be added to the cart."
            : "You cannot add anymore files to the cart."
      ];

      function getRemaining() {
        return cartAvailable > 1 ? " more files " : " more file ";
      }

      var messageTemplate = "<span>" + this.gettextCatalog.getString(template.join(" ")) + "</span>";

      this.notify.config({ duration: 5000 });
      this.notify.closeAll();
      this.notify({
        message: "",
        messageTemplate: messageTemplate,
        container: "#notification",
        classes: "alert-warning"
      });
    }

    buildAddedMsg(added: Array<Object>, alreadyIn: Array<Object>): string {
      var message = this.gettextCatalog.getPlural(added.length,
                    "<span>Added <strong class='word-break-all'>" + _.get(_.first(added), "file_name", "1 file") + "</strong> to the cart.",
                    "<span>Added <strong>" + added.length + "</strong> files to the cart.");

      if (alreadyIn.length) {
        message += this.gettextCatalog.getPlural(alreadyIn.length,
                   added.length === 0 ? "<br />The file was already in cart, not added." : "<strong class='word-break-all'>" + _.get(_.first(added), "file_name") + "</strong> already in cart, not added",
                   "<br /><strong>" + alreadyIn.length + "</strong> files were already in cart, not added");
      }

      if (added.length !== 0) {
        message += "<br /> <a data-ng-click='undoClicked(\"added\")'><i class='fa fa-undo'></i> Undo</a>";
      }
      return message + "</span>";
    }

    buildRemovedMsg(removedFiles: IFile[]): string {
      var message = this.gettextCatalog.getPlural(removedFiles.length,
                    "<span>Removed <strong class='word-break-all'>" + _.get(_.first(removedFiles), "file_name", "1 file") + "</strong> from the cart.",
                    "<span>Removed <strong>" + removedFiles.length + "</strong> files from the cart.");

      if (removedFiles.length !== 0) {
        message += "<br /> <a data-ng-click='undoClicked(\"removed\")'><i class='fa fa-undo'></i> Undo</a>";
      }
      return message + "</span>";
    }

    removeAll(): void {
      this.remove(this.files);
    }

    remove(filesToRemove: IFile[]): void {
      if (navigator.cookieEnabled) {
        var partitioned = this.files.reduce((acc, f) => {
          var fileToRemove = _.find(filesToRemove, f2r => f2r.file_id === f.file_id);
          return fileToRemove
            ? { remaining: acc.remaining, removed: acc.removed.concat(fileToRemove) }
            : { remaining: acc.remaining.concat(f), removed: acc.removed};
        } , { remaining: [], removed: [] });

        this.lastModifiedFiles = partitioned.removed;
        this.notify.closeAll();

        this.notify({
          message: "",
          messageTemplate: this.buildRemovedMsg(this.lastModifiedFiles),
          container: "#notification",
          classes: "alert-warning"
        });

        this.files = partitioned.remaining;
        this._sync();
      } else {
        this.$timeout(() => {
          if (!this.$uibModalStack.getTop()) {
            var modalInstance = this.$uibModal.open({
              templateUrl: "core/templates/enable-cookies.html",
              controller: "WarningController",
              controllerAs: "wc",
              backdrop: "static",
              keyboard: false,
              backdropClass: "warning-backdrop",
              animation: false,
              resolve: { warning: null }
            });
          }
        });
      }
    }

    getFileIds(): string[] {
      return _.pluck(this.files, "file_id");
    }

    undoAdded(): void {
      this.remove(this.lastModifiedFiles);
    }

    undoRemoved(): void {
      this.addFiles(this.lastModifiedFiles, false);
    }

    _sync(): void {
      this.$rootScope.$broadcast("cart-update");
      this.lastModified = this.$window.moment();

      var filesArray = this.files.map(f => {
        return {
          access: f.access,
          file_id: f.file_id,
          file_size: f.file_size,
          projects: f.projects || _.map(f.cases, c => c.project.project_id)
        }
      });

      this.LocalStorageService.setItem(CartService.GDC_CART_UPDATE, this.lastModified.toISOString());
      // if cookies disabled this will return false
      return this.LocalStorageService.setItem(CartService.GDC_CART_KEY, filesArray);
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
        "ngApp.core",
        "ngApp.files",
        "cgNotify"
      ])
      .service("CartState", State)
      .service("QueryCartService", QueryCartService)
      .service("CartService", CartService);
}
