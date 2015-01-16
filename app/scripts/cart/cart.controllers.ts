module ngApp.cart.controllers {
  import ICartService = ngApp.cart.services.ICartService;
  import IFiles = ngApp.files.models.IFiles;
  import IFile = ngApp.files.models.IFile;
  import ICoreService = ngApp.core.services.ICoreService;
  import IUserService = ngApp.components.user.services.IUserService;
  import IPagination = ngApp.components.ui.pagination.models.IPagination;

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
    processPaging: boolean;
    pagination: IPagination;
    displayedFiles: IFile[];
    setDisplayedFiles(newPaging?: IPagination): void;
  }

  class CartController implements ICartController {
    lastModified: Moment;
    pagination: any = {};
    processPaging: boolean = true;
    displayedFiles: IFile[];

    /* @ngInject */
    constructor(private $scope: ng.IScope, public files: IFile[], private CoreService: ICoreService,
                private CartService: ICartService, private UserService: IUserService) {
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

      $scope.$on("gdc-user-reset", () => {
        this.files = CartService.getFiles();
        this.setDisplayedFiles();
      });
      $scope.$on("cart-paging-update", (event: any, newPaging: any) => {
        this.setDisplayedFiles(newPaging);
      });

      $scope.$on("undo", () => {
        this.setDisplayedFiles();
      });

    }

    setDisplayedFiles(newPaging: IPagination = this.pagination): void {
      this.files = this.CartService.getFiles();
      this.pagination.from = newPaging.from;
      this.pagination.size = newPaging.size;
      this.pagination.count = this.pagination.size;
      this.pagination.pages = Math.ceil(this.files / this.pagination.size);
      this.pagination.total = this.files.length;

      // Used to check if files are deleted and the overall count can't reach the page
      // we are on.
      while(this.pagination.from * (this.pagination.page - 1) > this.pagination.total) {
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
      return _.pluck(this.files, "file_uuid");
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
    }

    removeAll() {
      this.CartService.removeAll();
      this.lastModified = this.CartService.lastModified;
      this.setDisplayedFiles();
    }

    removeSelected(): void {
      var ids: string[] = _.pluck(this.selected(), "file_uuid");
      this.CartService.remove(ids);
      this.lastModified = this.CartService.lastModified;
      this.setDisplayedFiles();
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
      return this.UserService.currentUser.projects.indexOf(file.archive.disease_code) !== -1;
    }

  }



  angular
      .module("cart.controller", ["cart.services", "core.services", "user.services", "location.services"])
      .controller("CartController", CartController)
      .directive("addToCartSingle",function(){
        return {
          restrict:"AE",
          scope:{
            file:"=",
          },
          templateUrl:'cart/templates/add-to-cart-button-single.html',
          controller:function($scope, CartService){
            $scope.CartService = CartService;
            $scope.addToCart = function(files){
              //debugger;
              CartService.addFiles(files)
            };
          }
        }
      })
      .directive("addToCartAll",function(){
        return {
          restrict:"AE",
          scope:{
            files:"=",
            removeAllInSearchResult:"&"
          },
          templateUrl:'cart/templates/add-to-cart-button-all.html',
          controller:function($scope, CartService,LocationService,FilesService){

            $scope.CartService = CartService;
            $scope.addToCart = function(files){
              CartService.addFiles(files)
            };

            $scope.removeAll = function(){
              $scope.removeAllInSearchResult();
            }

            $scope.removeAllInSearchResult = function() {
              // Query ES using the current filter and the file uuids in the Cart
              // If an id is in the result, then it is both in the Cart and in the current Search query
              var filters = LocationService.filters();
              var size: number = CartService.getFiles().length;
              if (!filters.content) {
                filters.op = "and";
                filters.content = [];
              }
              filters.content.push({
                content: {
                  field: "files.file_uuid",
                  value: _.pluck(CartService.getFiles(), "file_uuid")
                },
                op: "is"
              });
              FilesService.getFiles({
                fields:[
                  "file_uuid"
                ],
                filters: filters,
                size: size,
                from: 0
              }).then((data) => {
                CartService.remove(_.pluck(data.hits, "file_uuid"));
              });
            }

            $scope.addAll = function(){

              console.log("SearchController::addAll");
              var filters = LocationService.filters();
              var size: number = ($scope.files.length >= this.CartService.getMaxSize()) ? this.CartService.getMaxSize() : this.files.length;
              //var size: number = ($scope.files.pagination.total >= this.CartService.getMaxSize()) ? this.CartService.getMaxSize() : this.files.pagination.total;
              FilesService.getFiles({
                fields: [
                  "data_access",
                  "data_format",
                  "data_level",
                  "data_subtype",
                  "data_type",
                  "file_extension",
                  "file_name",
                  "file_size",
                  "file_uuid",
                  "platform",
                  "updated",
                  "archive.disease_code",
                  "archive.revision",
                  "participants.bcr_patient_uuid"
                ],
                filters: filters,
                size: size
              }).then((data) => this.CartService.addFiles(data.hits));

            }
          }
        }
      })
      .directive("addToCartFiltered",function(){
        return {
          restrict:"AE",
          scope:{
            files:"=",
            participant:"=",
            row:"="
          },
          templateUrl:'cart/templates/add-to-cart-button-filtered.html',
          controller:function($scope, CartService,LocationService,FilesService){

            $scope.getFilteredRelatedFiles = function() {
              var filters = LocationService.filters();

              if (!filters.content) {
                filters.op = "and";
                filters.content = [];
              }

              //debugger;
              var barcode = _.find($scope.row,function(elem){return elem.id === "bcr_patient_uuid"}).val;

              filters.content.push({
                content: {
                  field: "participants.bcr_patient_uuid",
                  value: [
                    barcode
                  ]
                },
                op: "is"
              });

              FilesService.getFiles({
                fields: [
                  "data_access",
                  "data_format",
                  "data_level",
                  "data_subtype",
                  "data_type",
                  "file_extension",
                  "file_name",
                  "file_size",
                  "file_uuid",
                  "platform",
                  "updated",
                  "archive.disease_code",
                  "archive.revision",
                  "participants.bcr_patient_uuid"
                ],
                filters: filters,
                size: 100
              }).then((data) => {
                $scope.filteredRelatedFiles = data;
                console.log("Set filtered related files...", $scope.filteredRelatedFiles);
                //$scope.$apply();
              });
            }

            $scope.addFilteredRelatedFiles = function()  {

              //console.info("Filter add to cart",$scope);

              CartService.addFiles($scope.filteredRelatedFiles.hits);
            }

            $scope. addRelatedFiles  = function(){
                //this.addToCart(participant.files);
               CartService.addFiles($scope.files);
            }

            $scope.CartService = CartService;


            $scope.removeAll = function(){
              $scope.removeAllInSearchResult();
            }
          }
        }
      })

}

