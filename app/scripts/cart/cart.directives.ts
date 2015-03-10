module ngApp.cart.directives {
  import IUserService = ngApp.components.user.services.IUserService;
  import ICartService = ngApp.cart.services.ICartService;
  import IFilesService = ngApp.files.services.IFilesService;
  import ILocationService = ngApp.components.location.services.ILocationService;
  import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;
  import IFile = ngApp.files.models.IFile;

  interface IAddToCartScope extends ng.IScope {
    CartService: ICartService;
    addToCart(files: IFile[]): void;
    removeFromCart(files: IFile[]): void;
  }

  function AddToCartSingle(): ng.IDirective {
    return {
      restrict: "AE",
      scope:{
        file: "=",
      },
      templateUrl: "cart/templates/add-to-cart-button-single.html",
      controller: function($scope: IAddToCartScope, CartService: ICartService) {
        $scope.CartService = CartService;
        $scope.addToCart = function(files: IFile[]) {
          CartService.addFiles(files)
        };
        $scope.removeFromCart = function(files: IFile[]) {
          CartService.removeFiles(files);
        };
      }
    }
  }

  function AddToCartAll(SearchTableFilesModel: TableiciousConfig): ng.IDirective {
    return {
      restrict: "AE",
      scope:{
        paging: "=",
        files: "=",
        removeAllInSearchResult: "&",
        addAllOnly: "@"
      },
      compile: function(element, attrs) {
        if(!attrs.addAllOnly)
          attrs.addAllOnly = false;
      },
      templateUrl: "cart/templates/add-to-cart-button-all.html",
      controller: function($scope: IAddToCartScope, CartService: ICartService, LocationService: ILocationService,
                           FilesService: IFilesService, UserService: IUserService) {

        $scope.CartService = CartService;
        $scope.addToCart = function(files: IFile[]) {
          CartService.addFiles(files)
        };

        $scope.removeAll = function(){
          $scope.removeAllInSearchResult();
        };

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
              field: "files.file_id",
              value: _.pluck(CartService.getFiles(), "file_id")
            },
            op: "in"
          });

          FilesService.getFiles({
            fields:[
              "file_id"
            ],
            filters: filters,
            size: size,
            from: 0
          }).then((data) => {
            CartService.remove(_.pluck(data.hits, "file_id"));
          });
        }

        $scope.addAll = function(){
          var filters = LocationService.filters();
          filters = UserService.addMyProjectsFilter(filters, "participants.project.project_id");
          var size: number = ($scope.paging.total >= CartService.getMaxSize()) ? CartService.getMaxSize() : $scope.paging.total;
          FilesService.getFiles({
            fields: SearchTableFilesModel.fields,
            filters: filters,
            size: size,
            from: 0
          }).then((data) => this.CartService.addFiles(data.hits));
        }
      }
    }
  }

  function AddToCartFiltered(SearchTableFilesModel: TableiciousConfig): ng.IDirective {
    return {
      restrict:"AE",
      scope:{
        files: "=",
        participant: "=",
        row: "="
      },
      templateUrl: "cart/templates/add-to-cart-button-filtered.html",
      controller:function($scope: ng.IScope, CartService: ICartService, LocationService: ILocationService,
                          FilesService: IFilesService){
        
        $scope.retreivingFilteredFiles = true;

        $scope.getFilteredRelatedFiles = function() {
          $scope.retreivingFilteredFiles = true;
          var filters = LocationService.filters();

          if (!filters.content) {
            filters.op = "and";
            filters.content = [];
          }

          var barcode = _.find($scope.row,function(elem){return elem.id === "participant_id"}).val;

          filters.content.push({
            content: {
              field: "participants.participant_id",
              value: [
                barcode
              ]
            },
            op: "in"
          });

          FilesService.getFiles({
            fields: SearchTableFilesModel.fields,
            filters: filters,
            size: CartService.getCartVacancySize()
          }).then((data) => {
            $scope.retreivingFilteredFiles = false;
            $scope.filteredRelatedFiles = data;
          });
        };

        $scope.addFilteredRelatedFiles = function()  {
          CartService.addFiles($scope.filteredRelatedFiles.hits);
        };

        $scope.addRelatedFiles = function() {
          var barcode = _.find($scope.row,function(elem){return elem.id === "participant_id"}).val;
          var filters = {
            "op": "and",
            "content": [{
              "op": "in",
              "content": {
                "field": "participants.participant_id",
                "value": barcode
              }
            }]
          };

          FilesService.getFiles({
            fields: SearchTableFilesModel.fields,
            filters: filters,
            size: CartService.getCartVacancySize()
          }).then((data) => {
            if (!CartService.areInCart(data.hits)) {
              this.CartService.addFiles(data.hits);
            }
          });

        };

        $scope.CartService = CartService;
      }
    }
  }

  angular.module("cart.directives", [
      "user.services",
      "location.services",
      "files.services",
      "search.table.files.model"
    ])
    .directive("addToCartSingle", AddToCartSingle)
    .directive("addToCartAll", AddToCartAll)
    .directive("addToCartFiltered", AddToCartFiltered);
}

