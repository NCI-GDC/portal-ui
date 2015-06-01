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

  function SelectAllCart(): ng.IDirective {
    return {
      restrict: "AE",
      replace: true,
      scope: {
        paging: "="
      },
      templateUrl: "cart/templates/select-all.html",
      controller: function($scope, CartService: ICartService) {
        $scope.files = CartService.getFiles();

        function getVisible() {
          var p = $scope.paging;
          var visible = $scope.files.slice(p.from - 1, p.from + p.count - 1);
          return visible;
        }

        $scope.CartService = CartService;
        $scope.selectAll = function(visibleOnly) {
          var visible = getVisible();
          var iteratee = visibleOnly ? visible : $scope.files;
          _.each(iteratee,(file: IFile): void => {
              file.selected = true;
          });
        };

        $scope.deselectAll = function(visibleOnly) {
          var visible = getVisible();
          var iteratee = visibleOnly ? visible : $scope.files;
          _.each(iteratee, (file: IFile): void => {
            file.selected = false;
          });
        };

        $scope.all = function(visibleOnly) {
          var visible = getVisible();
          var iteratee = visibleOnly ? visible : $scope.files;
          return _.every(iteratee, {selected: true});
        };
      }
    }
  }

  function SelectSingleCart(): ng.IDirective {
    return {
      restrict: "AE",
      replace: true,
      scope: {
        file: "="
      },
      templateUrl: "cart/templates/select-single.html",
      controller: function($scope, CartService) {
        $scope.CartService = CartService;
      }
    };
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
      controller: function($scope: IAddToCartScope, CartService: ICartService, LocationService: ILocationService,
                           FilesService: IFilesService, UserService: IUserService) {
  	     console.log($scope);
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

        $scope.addAll = function(){
          var filters = LocationService.filters();
          filters = UserService.addMyProjectsFilter(filters, "participants.project.project_id");

          if ($scope.paging.total >= CartService.getMaxSize()) {
            CartService.sizeWarning();
            return;
          }

          FilesService.getFiles({
            fields: SearchTableFilesModel.fields,
            expand: SearchTableFilesModel.expand,
            filters: filters,
            size: $scope.paging.total,
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
      scope: {
        selectedOnly: "@"
      },
      controller:function($scope,FilesService,UserService,CartService,$modal,$element){
        $element.on('click',function checkCartForClosedFiles() {
          var scope = $scope;
          var isLoggedIn = UserService.currentUser;
          function isSelected(a){return a.selected};
          var authorizedInCart = CartService.getAuthorizedFiles();
          var unauthorizedInCart = CartService.getUnauthorizedFiles();

          if ($scope.selectedOnly) {
            authorizedInCart = authorizedInCart.filter(isSelected);
            unauthorizedInCart = unauthorizedInCart.filter(isSelected);
          }

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
        row: "="
      },
      templateUrl: "cart/templates/add-to-cart-button-filtered.html",
      controller:function($scope: ng.IScope, CartService: ICartService, LocationService: ILocationService,
                          FilesService: IFilesService,
                          ParticipantsService){
        $scope.files = [];
        var content = LocationService.filters().content;
        $scope.areFiltersApplied = content && _.find(content, (item) => {
          return item.content.field.indexOf("files.") === 0;
        });

        $scope.$on("$locationChangeSuccess", () => {
          var content = LocationService.filters().content;
          $scope.areFiltersApplied = content && _.find(content, (item) => {
            return item.content.field.indexOf("files.") === 0;
          });
        });

        $scope.getFiles = function() {
          $scope.retreivingFiles = true;
          var filters = LocationService.filters();

          if (!filters.content) {
            filters.op = "and";
            filters.content = [];
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
                "annotations.annotation_id"
              ],
              expand: [
                "files"
              ]
            }).then((data) => {

              if ($scope.areFiltersApplied) {
                $scope.retreivingFiles = $scope.filteredRelatedFiles ? false: true;
              } else {
                $scope.retreivingFiles = false;
              }

              $scope.files = data.files;
            });
          }
        };

        $scope.addFilteredRelatedFiles = function()  {
          CartService.addFiles($scope.filteredRelatedFiles.hits);
        };

        $scope.addRelatedFiles = function() {
          CartService.addFiles($scope.files);
        };

        $scope.CartService = CartService;
      }
    }
  }


  /** Directive which can be placed anywhere, that displays a pie chart of the contents of the cart **/
  function CartDisplayingPieChart($filter: ng.IFilterService) {
    return {
      restrict:"AE",
      template:'<div pie-chart ng-if=chartData data-data=chartData data-config=chartConfig> </div>',
      controller:function(CartService,UserService,$scope){
        $scope.$watch(function () {
          return {
            l: CartService.getFiles().length,
            u: UserService.currentUser
          };
        }, function () {
          updateChartData();
        }, true);

        function updateChartData() {
          var files = CartService.getFiles();
          var accessCount = _.countBy(files, function (f) {
            return UserService.userCanDownloadFiles([f]);
          });

          var data = [
            {
              access: 'open',
              count: accessCount['true'] || 0,
              state: {
                name: "search.files",
                params: {
                  filters: $filter("makeFilter")([
                    {
                      name: "files.file_id",
                      value: _.pluck(_.filter(files, (file) => {
                        return file.access === "open";
                      }), "file_id")
                    },
                    {
                      name: "files.access",
                      value: "open"
                    }
                  ], true)
                }
              }
            },
            {
              access: 'protected',
              count: accessCount['false'] || 0,
              state: {
                name: "search.files",
                params: {
                  filters: $filter("makeFilter")([
                    {
                      name: "files.file_id",
                      value: _.pluck(_.filter(files, (file) => {
                        return file.access === "protected";
                      }), "file_id")
                    },
                    {
                      name: "files.access",
                      value: "protected"
                    }
                  ], true)
                }
              }
            }
          ];

          $scope.chartConfig = {
            legend: {
              open: '%!% ' + $filter("translate")("file(s) you are authorized to download"),
              protected: '%!% ' + $filter("translate")("file(s) you are not authorized to download")
            }
          };

          if (_.find(data, function (a) {
                return a.count > 0;
              })) {
            $scope.chartData = data.map(function (a) {
              var ret = {
                key: a.access,
                value: a.count
              };

              if (a.state) {
                ret.state = a.state;
              }
              return ret;
            });
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
    .directive("removeUnauthorizedFilesButton", RemoveUnauthorizedFilesButton)
    .directive("selectSingleCart", SelectSingleCart)
    .directive("removeSingleCart", RemoveSingleCart)
    .directive("selectAllCart", SelectAllCart);
}

