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

  function RemoveSingleCart(): ng.IDirective {
    return {
      restrict: "A",
      replace: true,
      scope: {
        file: "="
      },
      templateUrl: "cart/templates/remove-single.html",
      controller: function($scope, CartService: ICartService) {
        $scope.remove = function(id: string) {
          CartService.remove([id]);
          $scope.$emit("cart-update");
        }
      }
    };
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
        if (!attrs.addAllOnly) {
          attrs.addAllOnly = false;
        }
      },
      templateUrl: "cart/templates/add-to-cart-button-all.html",
      controller: function($scope: IAddToCartScope,
                           CartService: ICartService,
                           LocationService: ILocationService,
                           FilesService: IFilesService,
                           UserService: IUserService,
                           $timeout: ng.ITimeoutService,
                           notify: INotifyService) {
        $scope.CartService = CartService;

        $scope.removeAll  = function() {
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
        };

        $scope.addAll = function() {
          var filters = LocationService.filters();
          filters = UserService.addMyProjectsFilter(filters, "participants.project.project_id");
          if ($scope.paging.total >= CartService.getCartVacancySize()) {
            CartService.sizeWarning();
            return;
          }

          var addingMsgPromise = $timeout(() => {
            notify({
              message: "",
              messageTemplate: "<span data-translate>Adding <strong>" + $scope.paging.total + "</strong> files to cart</span>",
              container: "#notification",
              classes: "alert-info"
            });
          }, 1000);

          FilesService.getFiles({
            fields: ["access",
                     "file_name",
                     "file_id",
                     "file_size",
                     "data_type",
                     "data_format",
                     "annotations.annotation_id",
                     "participants.participant_id",
                     "participants.project.project_id",
                     "participants.project.name"
                     ],
            filters: filters,
            sort: "",
            size: $scope.paging.total,
            from: 0
          }).then((data) => {
            this.CartService.addFiles(data.hits, false);
            $timeout.cancel(addingMsgPromise);
          });
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

          var authorizedInCart = CartService.getAuthorizedFiles();
          var unauthorizedInCart = CartService.getUnauthorizedFiles();

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

              if (f.hasOwnProperty('related_ids') && f.related_ids) {
                file_ids = file_ids.concat(f.related_ids)
              }
              file_ids.push(f.file_id)
            });

            FilesService.downloadFiles(file_ids);
          }

          function showLoginModal() {
            var modalInstance = $modal.open({
              templateUrl: "core/templates/login-to-download.html",
              controller: "LoginToDownloadController",
              controllerAs: "wc",
              backdrop: true,
              keyboard: true,
              scope: scope,
              size: "lg",
              animation: false
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
              controller: "LoginToDownloadController",
              controllerAs: "wc",
              backdrop: true,
              keyboard: true,
              scope: scope,
              size: "lg",
              animation: false
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
        row: "="
      },
      templateUrl: "cart/templates/add-to-cart-button-filtered.html",
      controller:function($scope: ng.IScope, CartService: ICartService, LocationService: ILocationService,
                          FilesService: IFilesService,
                          ParticipantsService) {
        $scope.files = [];
        
        function areFiltersApplied(content): boolean {
          return content && _.some(content, (item) => {
            var content = item.hasOwnProperty('content') ? item.content : item;
            return content.field.indexOf("files.") === 0;
          });
        }
        
        function getContent(): any[] {
          LocationService.filters().content;
          return content && !Array.isArray(content) ? [content] : content;
        }
        
        var content = getContent();
        $scope.areFiltersApplied = areFiltersApplied(content);

        $scope.$on("$locationChangeSuccess", () => {
          var content = getContent();
          $scope.areFiltersApplied = areFiltersApplied(content);
        });

        $scope.getFiles = function() {
          $scope.retreivingFiles = true;
          var filters = LocationService.filters();
          if (filters.op !== "and") {
            filters = {op: "and", content: [filters]};
          }

          var uuid = $scope.row.participant_id;

          filters.content.push({
            content: {
              field: "files.participants.participant_id",
              value: [
                uuid
              ]
            },
            op: "in"
          });

          if ($scope.areFiltersApplied) {
            FilesService.getFiles({
              fields: SearchTableFilesModel.fields,
              expand: SearchTableFilesModel.expand,
              filters: filters,
              size: CartService.getCartVacancySize()
            }).then((data) => {
              $scope.retreivingFiles = $scope.files.length ? false : true;
              $scope.filteredRelatedFiles = data;
            });
          }

          if (!$scope.files.length) {
            ParticipantsService.getParticipant(uuid, {
              fields: [
                "participant_id",
                "submitter_id",
                "annotations.annotation_id",
                "project.project_id",
                "project.name",
                'files.access',
                'files.file_name',
                'files.file_id',
                'files.file_size',
                'files.data_type',
                'files.data_format'
              ]
            }).then((data) => {
              if ($scope.areFiltersApplied) {
                $scope.retreivingFiles = $scope.filteredRelatedFiles ? false: true;
              } else {
                $scope.retreivingFiles = false;
              }
              var fs = _.map(data.files, f => {
                f.participants = [{
                  participant_id:data.participant_id,
                  project: {
                    project_id: data.project.project_id,
                    name: data.project.name
                  }
                }];
              });
              $scope.files = data.files;
              $scope.calculateFileCount();
            });
          }
        };

        $scope.addFilteredRelatedFiles = function()  {
          CartService.addFiles($scope.filteredRelatedFiles.hits);
        };

        $scope.addRelatedFiles = function() {
          CartService.addFiles($scope.files);
        };

        $scope.removeRelatedFiles = function() {
          CartService.remove($scope.inBoth);
        };

        $scope.calculateFileCount = function() {
          $scope.inBoth = _.intersection(_.pluck(CartService.getFiles(), "file_id"),
                                         _.pluck($scope.files, "file_id"));
        }

        $scope.CartService = CartService;
      }
    }
  }

  angular.module("cart.directives", [
      "user.services",
      "location.services",
      "files.services",
      "search.table.files.model",
      "cgNotify"
    ])
    .directive("addToCartSingle", AddToCartSingle)
    .directive("addToCartAll", AddToCartAll)
    .directive("addToCartFiltered", AddToCartFiltered)
    .directive("downloadButtonAllCart", DownloadButtonAllCart)
    .directive("removeUnauthorizedFilesButton", RemoveUnauthorizedFilesButton)
    .directive("removeSingleCart", RemoveSingleCart);
}

