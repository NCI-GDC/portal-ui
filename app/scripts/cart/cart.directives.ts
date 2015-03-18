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
  
  /** This directive, which can be placed anywhere, removes any unauthorized files from the cart **/  
  function RemoveUnauthorizedFilesButton() {
    return {
      restrict:"AE",
      templateUrl:"cart/templates/remove-unauthorized-files.button.html",
      replace: true,
      controller:function($scope,$element,UserService,CartService,FilesService){
         //todo
        $scope.$watch(function(){
          return CartService.getUnauthorizedFiles();
        },function(f){
          $scope.files = f;
        },true);
        
        $scope.remove = function() {
              CartService.removeFiles($scope.files);
        }
         
      }
    }
  }
  
  
  
  function DownloadButtonAllCart() {
    return {
      restrict:"AE",
      controller:function($scope,FilesService,UserService,CartService,$modal,$element){
        $element.on('click',function checkCartForClosedFiles() {
          
          var scope = $scope;
          var isLoggedIn = UserService.currentUser;
          
          function isSelected(a){return a.selected};
          
          var authorizedInCart = CartService.getAuthorizedFiles().filter(isSelected);
          var unauthorizedInCart = CartService.getUnauthorizedFiles().filter(isSelected);
          

          scope.meta = {
            unauthorized: unauthorizedInCart,
            authorized: authorizedInCart
          };

          if (unauthorizedInCart.length === 0) {
            download();
          } else {
            if (isLoggedIn) {
              showRequestAccessModal();
            } else {
              showLoginModal();
            }
          }

          //FIXME clean up
          function download() {
            var file_ids = []
            _.forEach(authorizedInCart, (f) => {

              if (f.hasOwnProperty('related_ids')) {
                file_ids = file_ids.concat(f.related_ids)
              }
              file_ids.push(f.file_id)
            });

            FilesService.downloadFiles(file_ids);
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
              if (a && authorizedInCart.length > 0) {
                download();
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
              if (a && authorizedInCart.length > 0) {
                download();
              }
            });
          }
        })
      
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
              this.CartService.addFiles(data.hits);
          });

        };
        $scope.CartService = CartService;
      }
    }
  }
  
  
  /** Directive which can be placed anywhere, that displays a pie chart of the contents of the cart **/
  function CartDisplayingPieChart() {
    return {
      restrict:"AE",
      template:'<div pie-chart ng-if=chartData data-data=chartData data-config=chartConfig> </div>',
      controller:function(CartService,UserService,$scope){
        $scope.$watch(function () {
        return {
          l:CartService.getFiles().length,
          u:UserService.currentUser
          };
        }, function () {
          updateChartData();
        }, true);

      function updateChartData() {
        
        var accessCount = _.countBy(CartService.getFiles(), function (f) {
          return UserService.userCanDownloadFiles([f])
        });
        var data = [
          {
            access: 'open',
            count: accessCount['true'] || 0,
          },
          {
            access: 'protected',
            count: accessCount['false'] || 0,
          }
        ]

        $scope.chartConfig = {
          legend: {
            open: '%!% file(s) you are authorized to download',
            protected: '%!% file(s) you are not authorized to download'
          }
        }

        if (_.find(data, function (a) {
              return a.count > 0;
            })) {
          $scope.chartData = data.map(function (a) {
            return {
              key: a.access,
              value: a.count
            }
          })
        } else {
          $scope.chartData = undefined;
        }
      }
      
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
    .directive("addToCartFiltered", AddToCartFiltered)
    .directive("downloadButtonAllCart", DownloadButtonAllCart)
    .directive("cartDisplayingPieChart", CartDisplayingPieChart)
    .directive("removeUnauthorizedFilesButton", RemoveUnauthorizedFilesButton);
}

