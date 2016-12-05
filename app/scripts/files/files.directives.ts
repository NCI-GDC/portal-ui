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
            fields: [
              "state",
              "md5sum",
              "access",
              "data_format",
              "data_type",
              "data_category",
              "file_name",
              "file_size",
              "file_id",
              "platform",
              "experimental_strategy",
              "center.short_name",
              "cases.case_id",
              "cases.project.project_id",
              "annotations.annotation_id",
              "annotations.entity_id",
              "tags",
              "submitter_id",
              "archive.archive_id",
              "archive.submitter_id",
              "archive.revision",
              "associated_entities.entity_id",
              "associated_entities.entity_type",
              "associated_entities.case_id",
              "analysis.analysis_id",
              "analysis.workflow_type",
              "analysis.updated_datetime",
              "analysis.input_files.file_id",
              "analysis.metadata.read_groups.read_group_id",
              "analysis.metadata.read_groups.is_paired_end",
              "analysis.metadata.read_groups.read_length",
              "analysis.metadata.read_groups.library_name",
              "analysis.metadata.read_groups.sequencing_center",
              "analysis.metadata.read_groups.sequencing_date",
              "downstream_analyses.output_files.access",
              "downstream_analyses.output_files.file_id",
              "downstream_analyses.output_files.file_name",
              "downstream_analyses.output_files.data_category",
              "downstream_analyses.output_files.data_type",
              "downstream_analyses.output_files.data_format",
              "downstream_analyses.workflow_type",
              "downstream_analyses.output_files.file_size",
              "index_files.file_id"
            ],
            expand: [
              "metadata_files",
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
              'index_file',
              'cases',
              'cases.demographic',
              'cases.diagnoses',
              'cases.diagnoses.treatments',
              'cases.family_histories',
              'cases.exposures',
              'cases.samples',
              'cases.samples.portions',
              'cases.samples.portions.analytes',
              'cases.samples.portions.analytes.aliquots',
              'cases.samples.portions.analytes.aliquots.annotations',
              'cases.samples.portions.analytes.annotations',
              'cases.samples.portions.submitter_id',
              'cases.samples.portions.slides',
              'cases.samples.portions.annotations',
              'cases.samples.portions.center'
            ],
            format: 'JSON',
            pretty: true,
            size: fileIds.length,
          }, $scope.filename ? {filename: $scope.filename} : {});

          const checkProgress = $scope.download(params, url, () => $element, 'POST');
          checkProgress(inProgress, done, false);
        };
        $scope.active = false;
      }

    };
  }

  function DownloadButton($log: ng.ILogService, UserService, $uibModal, config: IGDCConfig): ng.IDirective {

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
                if (UserService.userCanDownloadFiles(files)) {
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
          if ($scope.active === true) return;
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
      template: "<a ng-class=\"[classes || 'btn btn-primary']\" data-downloader>" +
                "<i class=\"fa {{icon || 'fa-download'}}\" ng-class=\"{'fa-spinner': active, 'fa-pulse': active}\"></i>" +
                "<span ng-if=\"copy\"><span ng-if=\"!active\">&nbsp;{{copy}}</span><span ng-if=\"active\">&nbsp;{{dlcopy}}</span></span></a>",
      link: function($scope, $element, $attrs){
        $scope.active = false;
        const inProgress = () => {
          $scope.active = true;
          $attrs.$set('disabled', 'disabled');
        };
        const done = () => {
          $scope.active = false;
          $element.removeAttr('disabled');
        };
        const bamSlice = (files) => {
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
                return _.head(files);
              },
              completeCallback: () => done,
              inProgress: () => inProgress,
              downloader: () => $scope.download
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
