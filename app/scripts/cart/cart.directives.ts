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
        disabled: boolean = false;
        this.remove = function() {
          CartService.remove([{file_id: this.file.file_id,
                               file_name: this.file.file_name }]);
          this.disabled = true;
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
          this.retrievingFiles = true;
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
              fields: ["file_name", "file_id"],
              expand: [],
              filters: filters,
              size: CartService.getCartVacancySize()
            }).then((data) => {
              this.retrievingFiles = this.files.length ? false : true;
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
                this.retrievingFiles = this.filteredRelatedFiles ? false: true;
              } else {
                this.retrievingFiles = false;
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
          CartService.addFiles(this.filteredRelatedFiles.hits);
        };

        this.addRelatedFiles = function() {
          var uuid = this.row.case_id;
          CartService.addFiles(this.files);
        };

        this.removeRelatedFiles = function() {
          CartService.remove(this.inBoth);
        };

        this.calculateFileCount = function() {
          this.inBoth = this.files.reduce((acc, f) => {
            if (CartService.getFiles().find(cartF => cartF.file_id === f.file_id)){
              return acc.concat(f);
            }
            return acc;
          }, []);
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
          CartService.remove($scope.files);
        }

      }
    }
  }

  function DownloadManifestCart(CartService, $uibModal, config: IGDCConfig) {
    return {
      restrict:"AE",
      scope: true,
      link: ($scope, $element, $attrs) => {
        $element.on('click', () => {
          $scope.active = false;

          const reportStatus = _.isFunction($scope.$parent.reportStatus) ?
            _.partial($scope.$parent.reportStatus, $scope.$id) :
            () => {};

          const inProgress = () => {
            $scope.active = true;
            reportStatus($scope.active);
            $attrs.$set('disabled', 'disabled');
          };
          const done = () => {
            $scope.active = false;
            reportStatus($scope.active);
            $element.removeAttr('disabled');
          };
          const files = [].concat(CartService.getFiles());
          const params = { ids: files.map(f => f.file_id) };
          const url = config.api + '/manifest?annotations=true&related_files=true';

          const checkProgress = $scope.download(params, url, () => $element, 'POST');
          checkProgress(inProgress, done);
        });
      }
    };
  }

  function DownloadMetadataFiles(CartService, $uibModal, config: IGDCConfig) {
    return {
      restrict:"AE",
      scope: true,
      link: ($scope, $element, $attrs) => {
        $element.on('click', () => {

          $scope.active = false;

          const reportStatus = _.isFunction($scope.$parent.reportStatus)
            ? _.partial($scope.$parent.reportStatus, $scope.$id)
            : () => {};

          const inProgress = () => {
            $scope.active = true;
            reportStatus($scope.active);
            $attrs.$set('disabled', 'disabled');
          };
          const done = () => {
            $scope.active = false;
            reportStatus($scope.active);
            $element.removeAttr('disabled');
          };
          const files = [].concat(CartService.getFiles());
          const params = { ids: files.map(f => f.file_id) };
          const url = config.api + '/data/metadata_files';
          const checkProgress = $scope.download(params, url, () => $element, 'POST');
          checkProgress(inProgress, done);
        });
      }
    };
  }

  function DownloadButtonAllCart(UserService, CartService, $uibModal, config: IGDCConfig) {
    return {
      restrict:"AE",
      scope: true,
      link: ($scope, $element, $attrs) => {
        const scope = $scope;
        scope.active = false;

        const reportStatus = _.isFunction(scope.$parent.reportStatus) ?
          _.partial(scope.$parent.reportStatus, scope.$id) :
          () => {};
        const inProgress = () => {
          scope.active = true;
          reportStatus(scope.active);
          $attrs.$set('disabled', 'disabled');
        };
        const done = () => {
          scope.active = false;
          reportStatus(scope.active);
          $element.removeAttr('disabled');
        };
        const url = config.api + '/data?annotations=true&related_files=true';
        const download = (files) => {
          if ((files || []).length > 0) {
            const params = { ids: files.map(f => f.file_id) };
            const checkProgress = scope.download(params, url, () => $element, 'POST');
            checkProgress(inProgress, done);
          }
        };

        $element.on('click', () => {
          const authorizedInCart = CartService.getAuthorizedFiles()
          const unauthorizedInCart = CartService.getUnauthorizedFiles();
          const files = [].concat(authorizedInCart);
          // "meta" is referenced in the html templates used below.
          scope.meta = {
            unauthorized: unauthorizedInCart,
            authorized: authorizedInCart
          };

          if (unauthorizedInCart.length) {
            if (UserService.currentUser) {
              // Makes sure the user session has not expired.
              UserService.loginPromise().then(() => {
                // Session is still active.
                const modalInstance = $uibModal.open({
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
                  if (a) {
                    download(files);
                  }
                });
              }, (response) => {
                console.log('User session has expired.', response);

                const modalInstance = $uibModal.open({
                  templateUrl: "core/templates/session-expired.html",
                  controller: "LoginToDownloadController",
                  controllerAs: "wc",
                  backdrop: true,
                  keyboard: true,
                  scope: scope,
                  size: "lg",
                  animation: false
                });

                modalInstance.result.then((a) => {
                  UserService.logout();
                });
              });

            } else {
              // User is NOT logged in.
              const modalInstance = $uibModal.open({
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
                if (a) {
                  download(files);
                }
              });
            }
          }
          else {
            download(files);
          }
        });
      }
    };
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
    .directive("downloadMetadataFiles", DownloadMetadataFiles)
    .directive("addToCartAllButton", AddToCartAllButton)
    .directive("addToCartFiltered", AddToCartFiltered)
    .directive("downloadButtonAllCart", DownloadButtonAllCart)
    .directive("downloadManifestCart", DownloadManifestCart)
    .directive("removeUnauthorizedFilesButton", RemoveUnauthorizedFilesButton)
    .directive("removeSingleCart", RemoveSingleCart);
}
