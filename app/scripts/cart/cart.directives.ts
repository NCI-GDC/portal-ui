module ngApp.cart.directives {
  import IUserService = ngApp.components.user.services.IUserService;
  import ICartService = ngApp.cart.services.ICartService;
  import IFilesService = ngApp.files.services.IFilesService;
  import ILocationService = ngApp.components.location.services.ILocationService;
  import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;
  import IFile = ngApp.files.models.IFile;

  // remove from cart page
  function RemoveSingleCart(): ng.IDirective {
    return {
      restrict: "E",
      replace: true,
      scope: {},
      bindToController: {
        file: '='
      },
      templateUrl: "cart/templates/remove-single.html",
      controllerAs: 'ctrl',
      controller: function($scope: ng.IScope, CartService: ICartService) {
        this.remove = function() {
          CartService.remove([this.file.file_id]);
          $scope.$emit("cart-update");
        }
      }
    };
  }

  // add/remove to cart on file search page
  function AddToCartSingleIcon(): ng.IDirective {
    return {
      restrict: 'E',
      scope: {},
      bindToController: {
        file: '='
      },
      templateUrl: 'cart/templates/add-to-cart-button-single.html',
      controller: 'AddToCartSingleCtrl as ctrl'
    };
  }

  // add/remove to cart on file entity page
  function AddToCartSingleLabelled(): ng.IDirective {
    return {
      restrict: 'E',
      scope: {},
      replace: true,
      bindToController: {
        file: '='
      },
      templateUrl: 'cart/templates/add-to-cart-button-labelled.html',
      controller: 'AddToCartSingleCtrl as ctrl'
    };
  }


  // add to cart on summary
  function AddToCartAllButton(SearchTableFilesModel: TableiciousConfig) {
    return {
      restrict: 'E',
      scope: {},
      bindToController: {
      files: '=',
      filter: '@',
      size: '@'
      },
      templateUrl: "cart/templates/add-to-cart-all-button.html",
      controller: "AddToCartAllCtrl as ctrl"
    };
  }

  // add to cart dropdown on top of file search
  function AddToCartAllDropDown(SearchTableFilesModel: TableiciousConfig) {
    return {
      restrict: 'E',
      scope: {},
      bindToController: {
        files: '=',
        size: '@'
      },
      templateUrl: "cart/templates/add-to-cart-all-dropdown.html",
      controller: "AddToCartAllCtrl as ctrl"
    };
  }

  // add to cart dropdown on cases search table
  function AddToCartFiltered(SearchTableFilesModel: TableiciousConfig): ng.IDirective {
    return {
      restrict: "E",
      scope: {},
      bindToController: {
        row: "="
      },
      controllerAs: 'ctrl',
      templateUrl: "cart/templates/add-to-cart-button-filtered.html",
      controller: function($scope: ng.IScope,
                           CartService: ICartService,
                           //QueryCartService: IQueryCartService,
                           LocationService: ILocationService,
                           FilesService: IFilesService,
                           ParticipantsService) {
        this.files = [];
        this.CartService = CartService;

        function areFiltersApplied(content): boolean {
          return content && _.some(content, (item) => {
            var content = item.hasOwnProperty('content') ? item.content : item;
            return content.field.indexOf("files.") === 0;
          });
        }

        function getContent(): any[] {
          var content = LocationService.filters().content;
          return content && !Array.isArray(content) ? [content] : content;
        }

        var content = getContent();
        this.areFiltersApplied = areFiltersApplied(content);

        $scope.$on("$locationChangeSuccess", () => {
          var content = getContent();
          this.areFiltersApplied = areFiltersApplied(content);
        });

        this.getFiles = function() {
          this.retreivingFiles = true;
          var filters = LocationService.filters();
          if (filters.op !== "and") {
            filters = {op: "and", content: [filters]};
          }

          var uuid = this.row.case_id;

          filters.content.push({
            content: {
              field: "files.cases.case_id",
              value: [
                uuid
              ]
            },
            op: "in"
          });

          if (this.areFiltersApplied) {
            FilesService.getFiles({
              fields: SearchTableFilesModel.fields,
              expand: SearchTableFilesModel.expand,
              filters: filters,
              size: CartService.getCartVacancySize()
            }).then((data) => {
              this.retreivingFiles = this.files.length ? false : true;
              this.filteredRelatedFiles = data;
            });
          }

          if (!this.files.length) {
            ParticipantsService.getParticipant(uuid, {
              fields: [
                "case_id",
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
              if (this.areFiltersApplied) {
                this.retreivingFiles = this.filteredRelatedFiles ? false: true;
              } else {
                this.retreivingFiles = false;
              }
              var fs = _.map(data.files, f => {
                f.cases = [{
                  case_id: data.case_id,
                  project: {
                    project_id: data.project.project_id,
                    name: data.project.name
                  }
                }];
              });
              this.files = data.files;
              this.calculateFileCount();
            });
          }
        };

        this.addFilteredRelatedFiles = function()  {
          var filters = LocationService.filters();
          if (filters.op !== "and") {
            filters = {op: "and", content: [filters]};
          }
          var uuid = this.row.case_id;

          filters.content.push({
            content: {
              field: "files.cases.case_id",
              value: [
                uuid
              ]
            },
            op: "in"
          });
          //QueryCartService.pushAddedQuery(filters);
          CartService.addFiles(this.filteredRelatedFiles.hits);
        };

        this.addRelatedFiles = function() {
          var uuid = this.row.case_id;
          //QueryCartService.pushAddedQuery({
            //content: {
              //field: "files.cases.case_id",
              //value: [
                //uuid
              //]
            //},
            //op: "in"
          //});
          CartService.addFiles(this.files);
        };

        this.removeRelatedFiles = function() {
          CartService.remove(this.inBoth);
        };

        this.calculateFileCount = function() {
          this.inBoth = _.intersection(_.pluck(CartService.getFiles(), "file_id"),
                                         _.pluck(this.files, "file_id"));
        }
      }
    }
  }


  /** This directive, which can be placed anywhere, removes any unauthorized files from the cart **/  
  function RemoveUnauthorizedFilesButton() {
    return {
      restrict: "AE",
      templateUrl: "cart/templates/remove-unauthorized-files.button.html",
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

  function DownloadManifestCart(FilesService: IFilesService, UserService, CartService, $uibModal) {
    return {
      restrict:"AE",
      scope: true,
      link: function($scope, $element, $attrs){

        $element.on('click',function DownloadManifestFiles(){

          var scope = $scope;

          scope.active = true;
          $attrs.$set("disabled", "disabled");

          FilesService.downloadManifest(_.pluck(CartService.getFiles(), "file_id"), (complete)=>{
              scope.active = false;
              $element.removeAttr("disabled");
          });

        });
      }
    }
  }

  function DownloadButtonAllCart(FilesService, UserService, CartService, $uibModal) {
    return {
      restrict:"AE",
      scope: true,
      link: function($scope, $element, $attrs){

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

            function download() {

              $scope.active = true;
              $attrs.$set("disabled", "disabled");

              FilesService.downloadFiles(_.pluck(authorizedInCart, "file_id"), (complete)=>{
                  $scope.active = false;
                  $element.removeAttr("disabled");
              });
            }

            function showLoginModal() {
              var modalInstance = $uibModal.open({
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
                } else if(!a) {
                  //Cancel Pressed
                  $scope.active = false;
                  $element.removeAttr("disabled");
                }
              });
            }

            function showRequestAccessModal() {
              var modalInstance = $uibModal.open({
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

  angular.module("cart.directives", [
      "user.services",
      "location.services",
      "files.services",
      "search.table.files.model",
      "cgNotify"
    ])
    .directive("addToCartSingleIcon", AddToCartSingleIcon)
    .directive("addToCartSingleLabelled", AddToCartSingleLabelled)
    .directive("addToCartAllDropdown", AddToCartAllDropDown)
    .directive("addToCartAllButton", AddToCartAllButton)
    .directive("addToCartFiltered", AddToCartFiltered)
    .directive("downloadButtonAllCart", DownloadButtonAllCart)
    .directive("downloadManifestCart", DownloadManifestCart)
    .directive("removeUnauthorizedFilesButton", RemoveUnauthorizedFilesButton)
    .directive("removeSingleCart", RemoveSingleCart);
}

