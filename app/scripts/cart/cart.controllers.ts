module ngApp.cart.controllers {
  import ICartService = ngApp.cart.services.ICartService;
  import IFiles = ngApp.files.models.IFiles;
  import IFile = ngApp.files.models.IFile;
  import ICoreService = ngApp.core.services.ICoreService;
  import IUserService = ngApp.components.user.services.IUserService;
  import IPagination = ngApp.components.tables.pagination.models.IPagination;

  export interface ICartController {
    files: IFile[];
    lastModified: Moment;
    selected(): IFile[];
    selectedSize(): number;
    getTotalSize(): number;
    removeSelected(): void;
    remove(id: string): void;
    selectAll(): void;
    deselectAll(): void;
    all(): boolean;
    isUserProject(file: IFile): boolean;
    getFileIds(): string[];
    getRelatedFileIds(): string[];
    processPaging: boolean;
    pagination: IPagination;
    displayedFiles: IFile[];
    setDisplayedFiles(newPaging?: IPagination): void;
    setGraphData(): void;
  }

  class CartController implements ICartController {
    lastModified: Moment;
    pagination: any = {};
    processPaging: boolean = true;
    displayedFiles: IFile[];

    /* @ngInject */
    constructor(private $scope: ng.IScope, public files: IFile[], private CoreService: ICoreService,
                private CartService: ICartService, private UserService: IUserService, private $modal, private $filter, private $window, private Restangular) {
      CoreService.setPageTitle("Cart", "(" + this.files.length + ")");
      this.lastModified = this.CartService.lastModified;

      this.pagination = {
        from: 1,
        size: 10,
        count: 10,
        page: 1,
        pages: Math.ceil(files.length / 10),
        total: files.length,
        sort: ""
      };

      this.setDisplayedFiles();
      this.setGraphData();


      $scope.$on("gdc-user-reset", () => {
        this.files = CartService.getFiles();
        this.setDisplayedFiles();
        this.setGraphData();
      });
      $scope.$on("cart-paging-update", (event: any, newPaging: any) => {
        this.setDisplayedFiles(newPaging);
      });

      $scope.$on("undo", () => {
        this.setDisplayedFiles();
        this.setGraphData();
      });

    }

    setGraphData(): void {
      var numberFilesGraph = [];
      var sizeFilesGraph = [];

      if (!this.UserService.currentUser) {
        numberFilesGraph.push({
          "label": "Protected Files",
          "value": _.filter(this.files, (file: IFile) => { return file.data_access === 'protected'; }).length
        });
        numberFilesGraph.push({
          "label": "Open Files",
          "value": _.filter(this.files, (file: IFile) => { return file.data_access !== 'protected'; }).length
        });

        var sizeProtected = 0,
            sizeOpen = 0;

        _.each(_.filter(this.files, (file: IFile) => { return file.data_access === 'protected'; }), (file: IFile) => {
          sizeProtected += file.file_size;
        });

        _.each(_.filter(this.files, (file: IFile) => { return file.data_access !== 'protected'; }), (file: IFile) => {
          sizeOpen += file.file_size;
        });

        sizeFilesGraph.push({
          "label": "Protected Files",
          "value": sizeProtected
        });
        sizeFilesGraph.push({
          "label": "Open Files",
          "value": sizeOpen
        });
      } else {
        numberFilesGraph.push({
          "label": "Protected Files in My Projects",
          "value": _.filter(this.files, (file: IFile) => {
            return file.data_access === 'protected' && this.isUserProject(file);
          }).length
        });
        numberFilesGraph.push({
          "label": "Open Files in My Projects",
          "value": _.filter(this.files, (file: IFile) => {
            return file.data_access !== 'protected' && this.isUserProject(file);
          }).length
        });
        numberFilesGraph.push({
          "label": "Protected Files not in My Projects",
          "value": _.filter(this.files, (file: IFile) => {
            return file.data_access === 'protected' && !this.isUserProject(file);
          }).length
        });
        numberFilesGraph.push({
          "label": "Open Files not in My Projects",
          "value": _.filter(this.files, (file: IFile) => {
            return file.data_access !== 'protected' && !this.isUserProject(file);
          }).length
        });

        var sizeProtectedProjects = 0,
            sizeOpenProjects = 0,
            sizeProtectedNotProjects = 0,
            sizeOpenNotProjects = 0;

        _.each(_.filter(this.files, (file: IFile) => {
            return file.data_access === 'protected' && this.isUserProject(file);
          }), (file: IFile) => {
          sizeProtectedProjects += file.file_size;
        });
        _.each(_.filter(this.files, (file: IFile) => {
            return file.data_access !== 'protected' && this.isUserProject(file);
          }), (file: IFile) => {
          sizeOpenProjects += file.file_size;
        });
        _.each(_.filter(this.files, (file: IFile) => {
            return file.data_access === 'protected' && !this.isUserProject(file);
          }), (file: IFile) => {
          sizeProtectedNotProjects += file.file_size;
        });
        _.each(_.filter(this.files, (file: IFile) => {
            return file.data_access !== 'protected' && !this.isUserProject(file);
          }), (file: IFile) => {
          sizeOpenNotProjects += file.file_size;
        });

        sizeFilesGraph.push({
          "label": "Protected Files in My Projects",
          "value": sizeProtectedProjects
        });
        sizeFilesGraph.push({
          "label": "Open Files in My Projects",
          "value": sizeOpenProjects
        });
        sizeFilesGraph.push({
          "label": "Protected Files not in My Projects",
          "value": sizeProtectedNotProjects
        });
        sizeFilesGraph.push({
          "label": "Open Files not in My Projects",
          "value": sizeOpenNotProjects
        });
      }

      this.numberFilesGraph = numberFilesGraph;
      this.sizeFilesGraph = sizeFilesGraph;
    }

    setDisplayedFiles(newPaging: IPagination = this.pagination): void {
      this.files = this.CartService.getFiles();
      this.pagination.from = newPaging.from;
      this.pagination.size = newPaging.size;
      this.pagination.count = this.pagination.size;
      this.pagination.pages = Math.ceil(this.files.length / this.pagination.size);
      this.pagination.total = this.files.length;

      // Used to check if files are deleted and the overall count can't reach the page
      // we are on.
      while(this.pagination.from > this.pagination.total) {
        this.pagination.page--;
        this.pagination.from -= this.pagination.size;
      }

      // Safe fallback
      if (this.pagination.page < 0 || this.pagination.from < 1) {
        this.pagination.page = 1;
        this.pagination.from = 1;
      }

      this.displayedFiles = _.assign([], this.files).splice(this.pagination.from - 1, this.pagination.size);
    }

    selected(): IFile[] {
      return this.CartService.getSelectedFiles();
    }

    selectedSize(): number {
      return this.getSelectedSize();
    }

    getTotalSize(): number {
      return _.reduce(this.files, function (sum: number, hit: IFile) {
        return sum + hit.file_size;
      }, 0);
    }

    getFileIds(): string[] {
      return _.pluck(this.files, "file_id");
    }

    getRelatedFileIds(): string[] {
      return _.reduce(this.files, function(ids, file) {
        return ids.concat(file.related_ids);
      }, []);
    }

    getSelectedSize(): number {
      return _.reduce(this.selected(), function (sum: number, hit: IFile) {
        return sum + hit.file_size;
      }, 0);
    }

    remove(id: string) {
      this.CartService.remove([id]);
      this.lastModified = this.CartService.lastModified;
      this.setDisplayedFiles();
      this.setGraphData();
    }

    removeAll() {
      this.CartService.removeAll();
      this.lastModified = this.CartService.lastModified;
      this.setDisplayedFiles();
      this.setGraphData();
    }

    removeSelected(): void {
      var ids: string[] = _.pluck(this.selected(), "file_id");
      this.CartService.remove(ids);
      this.lastModified = this.CartService.lastModified;
      this.setDisplayedFiles();
      this.setGraphData();
    }

    selectAll(): void {
      this.files.forEach((file: IFile): void => {
        file.selected = true;
      });
    }

    deselectAll(): void {
      this.files.forEach((file: IFile): void => {
        file.selected = false;
      });
    }

    all(): boolean {
      return _.every(this.files, {selected: true});
    }

    isUserProject(file: IFile): boolean {
      return this.UserService.isUserProject(file);
    }
    
    checkCartForClosedFiles() {

      var $window = this.$window;
      var $filter = this.$filter;
      var $modal = this.$modal;
      var scope = this.$scope;
      var ids = this.getFileIds();
      

      var isLoggedIn = this.UserService.currentUser;
      
      var protectedInCart = _.filter(this.CartService.files,function(a){return a.access === 'protected'});
      var openInCart = _.filter(this.CartService.files,function(a){return a.access !== 'protected'});
      var all = this.files;
      var unauthorizedInCart;
      var authorizedInCart;
      
      if (isLoggedIn) {
          var projects = currentUser.projects;
          unauthorizedInCart = protectedInCart.filter(function(a){
            return !_.contains(projects,a.project_id);
          })
          authorizedInCart = openInCart.concat(protectedInCart.filter(function(a){
            return _.contains(projects,a.project_id);
          }))
      } else {
         unauthorizedInCart = protectedInCart;
         authorizedInCart = openInCart;
      }
      
      scope.meta = {
        protected: protectedInCart,
        open: openInCart,
        unauthorized: unauthorizedInCart,
        authorized:authorizedInCart,
        all: all
      }

      if (protectedInCart.length < 1) {
        download();
      } else {
        if (isLoggedIn) {
          if (unauthorizedInCart.length < 1) {
            download();
          } else {
            showRequestAccessModal();
          }
        } else {
          showLoginModal();
        }
      }

      
      
      function download(_ids){
        _ids = _ids || ids;
        var x = $filter('makeDownloadLink')(_ids);  
        $window.location = x;
      }
      
      function showLoginModal() {
        var modalInstance = $modal.open({
          templateUrl: "core/templates/login-to-download.html",
          controller: "LoginToDownloadController as wc",
          backdrop: "static",
          keyboard: false,
          scope: scope,
          backdropClass: "warning-backdrop",
          size: "lg"
        });
        
        modalInstance.result.then((a) => {
          if (a && openInCart.length > 0) {
            openIds = openInCart.map(function(a){return a.file_id});
            download(openIds);
          }
        });
        
      }
      
      function showRequestAccessModal() {
        
         var modalInstance = $modal.open({
          templateUrl: "core/templates/request-access-to-download.html",
          controller: "LoginToDownloadController as wc",
          backdrop: "static",
          keyboard: false,
          scope: scope,
          backdropClass: "warning-backdrop",
          size: "lg"
        });
        
        modalInstance.result.then((a) => {
          var available = openInCart.concat(protectedInCart);
          if (a && available.length > 0) {
            availIds = available.map(function(a){return a.file_id});
            download(availIds);
          }
        });
      
      }
    }

  }



  angular
      .module("cart.controller", ["cart.services", "core.services", "user.services"])
      .controller("LoginToDownloadController",function($scope,$modalInstance, $window){
    
        console.log("Login to download.", $scope);
        var meta = $scope.$parent.meta;
          
          this.cancel = function(a){
            $modalInstance.close(false);
          }
          
          this.goAuth = function() {
            $modalInstance.close(true);
          }
  
      })
    
      .controller("CartController", CartController);
}

