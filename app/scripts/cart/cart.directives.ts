module ngApp.cart.directives {
  import IUserService = ngApp.components.user.services.IUserService;
  import ICartService = ngApp.cart.services.ICartService;
  import IFilesService = ngApp.files.services.IFilesService;
  import ILocationService = ngApp.components.location.services.ILocationService;

  function AddToCartSingle(): ng.IDirective {
    return {
      restrict: "AE",
      scope:{
        file: "=",
      },
      templateUrl: "cart/templates/add-to-cart-button-single.html",
      controller: function($scope: ng.IScope, CartService: ICartService) {
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

  function AddToCartAll(): ng.IDirective {
    return {
      restrict: "AE",
      scope:{
        paging: "=",
        files: "=",
        removeAllInSearchResult: "&"
      },
      templateUrl: "cart/templates/add-to-cart-button-all.html",
      controller: function($scope: ng.IScope, CartService: ICartService, LocationService: ILocationService,
                           FilesService: IFilesService) {

        $scope.CartService = CartService;
        $scope.addToCart = function(files: IFile[]) {
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
          var filters = LocationService.filters();
          var size: number = ($scope.paging.total >= this.CartService.getMaxSize()) ? this.CartService.getMaxSize() : this.paging.total;
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
            size: size,
            from: 0
          }).then((data) => this.CartService.addFiles(data.hits));
        }
      }
    }
  }

  function AddToCartFiltered(): ng.IDirective {
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

        $scope.getFilteredRelatedFiles = function() {
          var filters = LocationService.filters();

          if (!filters.content) {
            filters.op = "and";
            filters.content = [];
          }

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
            size: CartService.getCartVacancySize()
          }).then((data) => {
            $scope.filteredRelatedFiles = data;
          });
        };

        $scope.addFilteredRelatedFiles = function()  {
          CartService.addFiles($scope.filteredRelatedFiles.hits);
        };

        $scope.addRelatedFiles = function() {
          var barcode = _.find($scope.row,function(elem){return elem.id === "bcr_patient_uuid"}).val;
          var filters = {
            "op": "and",
            "content": [{
              "op": "is",
              "content": {
              "field": "participants.bcr_patient_uuid",
              "value": barcode
              }
            }]
          };

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
            size: CartService.getCartVacancySize()
          }).then((data) => {
            CartService.addFiles(data.hits);
          });

        };

        $scope.CartService = CartService;
      }
    }
  }

  angular.module("cart.directives", ["user.services", "location.services", "files.services"])
    .directive("addToCartSingle", AddToCartSingle)
    .directive("addToCartAll", AddToCartAll)
    .directive("addToCartFiltered", AddToCartFiltered);
}

