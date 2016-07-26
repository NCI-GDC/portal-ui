module ngApp.files.directives {
  import IUserService = ngApp.components.user.services.IUserService;
  import ICartService = ngApp.cart.services.ICartService;

  const hasControlledFiles = (files) => files.some((f) => f.access !== 'open');

  function DownloadMetadataButton(): ng.IDirective {
    return {
      restrict: "E",
      replace: true,
      scope: {
        filename: '@',
        textNormal: '@',
        textInProgress: '@',
        styleClass: '@',
        icon: '@'
      },
      template: '<button tabindex="0" data-ng-class="[styleClass || \'btn btn-primary\']" data-downloader ng-click="ctrl.onClick()"> \
              <i class="fa {{icon || \'fa-download\'}}" ng-class="{\'fa-spinner\': active, \'fa-pulse\': active}" /> \
              <span ng-if="textNormal"><span ng-if="! active">&nbsp;{{ ::textNormal }}</span> \
              <span ng-if="active">&nbsp;{{ ::textInProgress }}</span></span></button>',
      controllerAs: 'ctrl',
      controller: function($scope: ng.IScope, $attrs, $element, $uibModal, CartService: ICartService, UserService: IUserService, config: IGDCConfig) {
        this.onClick = () => {
          const url = config.auth_api + '/files';

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

          const isLoggedIn = UserService.currentUser;
          const authorizedInCart = CartService.getAuthorizedFiles();
          const unauthorizedInCart = CartService.getUnauthorizedFiles();

          const fileIds = CartService.getFileIds();
          const filters = {'content': [{'content': {'field': 'files.file_id', 'value': fileIds}, 'op': 'in'}], 'op': 'and'};

          const params = _.merge({
            attachment: true,
            filters: filters,
            fields: 'cases.project.project_id',
            expand: [
              'annotations',
              'archive',
              'associated_entities',
              'center',
              'analysis',
              'analysis.input_files',
              'analysis.metadata',
              'analysis.metadata_files',
              'analysis.downstream_analyses',
              'analysis.downstream_analyses.output_files',
              'reference_genome',
              'index_file'
            ],
            format: 'JSON',
            pretty: true,
            size: fileIds.length,
          }, $scope.filename ? {filename: $scope.filename} : {});

          const checkProgress = $scope.download(params, url, () => $element, 'POST');
          checkProgress(inProgress, done, true);
        };
        $scope.active = false;
      }

    };
  }

  function DownloadButton($log: ng.ILogService, UserService, $uibModal, config: IGDCConfig): ng.IDirective {
    const hasAccess = (files) => files.every((f) => UserService.isUserProject(f));

    return {
      restrict: "E",
      replace: true,
      scope: {
        files:"=",
        copy: "@",
        dlcopy: "@",
        classes: "@",
        icon: "@"
      },
      template: "<a ng-class=\"[classes || 'btn btn-primary']\" data-downloader>" +
                "<i class=\"fa {{icon || 'fa-download'}}\" ng-class=\"{'fa-spinner': active, 'fa-pulse': active}\"></i>" +
                "<span ng-if=\"copy\"><span ng-if=\"!active\">&nbsp;{{copy}}</span><span ng-if=\"active\">&nbsp;{{dlcopy}}</span></span></a>",
      link: ($scope, $element, $attrs) => {
        $scope.active = false;
        const inProgress = () => {
          $scope.active = true;
          $attrs.$set('disabled', 'disabled');
        };
        const done = () => {
          $scope.active = false;
          $element.removeAttr('disabled');
        };
        const url = config.auth_api + '/data?annotations=true&related_files=true';
        const download = (files) => {
          if ((files || []).length > 0) {
            const params = { ids: files.map(f => f.file_id) };
            const checkProgress = $scope.download(params, url, () => $element, 'POST');
            checkProgress(inProgress, done, true);
          }
        };
        const showModal = (template) => {
          return $uibModal.open({
            templateUrl: template,
            controller: 'LoginToDownloadController',
            controllerAs: 'wc',
            backdrop: true,
            keyboard: true,
            animation: false,
            size: 'lg'
          });
        };

        $element.on('click', () => {
          const files = [].concat($scope.files);

          if (hasControlledFiles(files)) {
            if (UserService.currentUser) {
              // Makes sure the user session has not expired.
              UserService.loginPromise().then(() => {
                // Session is still active.
                if (hasAccess(files)) {
                  download(files);
                } else {
                  showModal('core/templates/request-access-to-download-single.html');
                }
              }, (response) => {
                $log.log('User session has expired.', response);

                showModal('core/templates/session-expired.html').result.then((a) => {
                  UserService.logout();
                });
              });
            } else {
              showModal('core/templates/login-to-download-single.html');
            }
          } else {
            download(files);
          }
        });
      }
    };
  }

  function DownloadManifestButton(FilesService, config: IGDCConfig, LocationService): ng.IDirective {

    return {
      restrict: "E",
      replace: true,
      scope: {
        projectId: "=",
        size: "=",
        copy: "@",
        dlcopy: "@",
        classes: "@",
        icon: "@"
      },
      templateUrl: "files/templates/download-manifest-button.html",
      link: ($scope, $element, $attrs) => {

        const togglePopover = shouldBeOpen => $scope.$apply(() => {
          $scope.open = shouldBeOpen;
          if (shouldBeOpen) {
            setTimeout(() => {
              $('.popover').mouseleave(() => {
                $scope.$apply(() => $scope.open = false)
              });
            });
          }
        });

        $element.on('mouseenter', () => togglePopover(true));

        $element.on('mouseleave', _.debounce(() => {
          if ($('.popover#hover').length === 0) togglePopover(false);
        }, 700));

        $scope.active = false;

        const inProgress = () => {
          $scope.active = true;
          $attrs.$set('disabled', 'disabled');
        };

        const done = () => {
          $scope.active = false;
          $element.removeAttr('disabled');
        };

        $element.on('click', () => {
          const url = config.auth_api + '/files'

          const params = {
            return_type: 'manifest',
            size: $scope.size,
            attachment: true,
            format: 'TSV',
            fields: [ 'file_id' ],
            filters: $scope.projectId // on project page
              ? {
                  op: 'in',
                  content: {
                    field: 'cases.project.project_id',
                    value: $scope.projectId
                  }
                }
              : LocationService.filters()
          };

          const checkProgress = $scope.download(params, url, () => $element, 'POST');
          checkProgress(inProgress, done);
        });
      }
    };
  }

  function BAMSlicingButton($log: ng.ILogService, UserService, $uibModal): ng.IDirective {
    const hasAccess = (files) => files.every((f) => UserService.isUserProject(f));

    return {
      restrict: "E",
      replace: true,
      scope: {
        files:"=",
        copy: "@",
        dlcopy: "@",
        classes: "@",
        icon: "@"
      },
      template: "<a ng-class=\"[classes || 'btn btn-primary']\">" +
                "<i class=\"fa {{icon || 'fa-download'}}\" ng-class=\"{'fa-spinner': active, 'fa-pulse': active}\"></i>" +
                "<span ng-if=\"copy\"><span ng-if=\"!active\">&nbsp;{{copy}}</span><span ng-if=\"active\">&nbsp;{{dlcopy}}</span></span></a>",
      link: function($scope, $element, $attrs){
        $scope.active = false;
        const inProgress = () => {
          $scope.active = true;
          $attrs.$set('disabled', 'disabled');
        };
        const turnSpinnerOff = () => {
          $scope.active = false;
          $element.removeAttr('disabled');
        };
        const bamSlice = (files) => {
          inProgress();

          var bamModal = $uibModal.open({
            templateUrl: "files/templates/bam-slicing.html",
            controller: "BAMSlicingController",
            controllerAs: "bamc",
            backdrop: true,
            keyboard: true,
            animation: false,
            size: "lg",
            resolve: {
              file: function() {
                return _.first(files);
              },
              completeCallback: function() {
                return turnSpinnerOff;
              }
            }
          });
          bamModal.result.then(turnSpinnerOff, function(reason) {
            if (reason !== 'slicing') {
              turnSpinnerOff();
            }
          });
        };
        const showModal = (template) => {
          return $uibModal.open({
            templateUrl: template,
            controller: 'LoginToDownloadController',
            controllerAs: 'wc',
            backdrop: true,
            keyboard: true,
            animation: false,
            size: 'lg'
          });
        };

        $element.on("click", (a) => {
          const files = [].concat($scope.files);

          if (hasControlledFiles(files)) {
            if (UserService.currentUser) {
              // Makes sure the user session has not expired.
              UserService.loginPromise().then(() => {
                // Session is still active.
                if (hasAccess(files)) {
                  bamSlice(files);
                } else {
                  showModal('core/templates/request-access-to-download-single.html');
                }
              }, (response) => {
                $log.log('User session has expired.', response);

                showModal('core/templates/session-expired.html').result.then((a) => {
                  UserService.logout();
                });
              });
            } else {
              showModal('core/templates/login-to-download-single.html');
            }
          } else {
            bamSlice(files);
          }
        });
      }
    }
  }

  angular
    .module("files.directives", [
      "restangular", "components.location", "user.services",
      "core.services", "ui.bootstrap", "files.controller", "files.services"
    ])
    .directive("downloadButton", DownloadButton)
    .directive("downloadMetadataButton", DownloadMetadataButton)
    .directive("downloadManifestButton", DownloadManifestButton)
    .directive("bamSlicingButton", BAMSlicingButton);
}
