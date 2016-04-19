module ngApp.files.directives {
  import IUserService = ngApp.components.user.services.IUserService;
  import ICartService = ngApp.cart.services.ICartService;

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
        const url = config.api + '/files';

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

        const isLoggedIn = UserService.currentUser;
        const authorizedInCart = CartService.getAuthorizedFiles();
        const unauthorizedInCart = CartService.getUnauthorizedFiles();

        const fileIds = CartService.getFileIds();
        const filters = {'content': [{'content': {'field': 'files.file_id', 'value': fileIds}, 'op': 'in'}], 'op': 'and'};
        const params = _.merge({
          attachment: true,
          filters: filters,
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

        this.onClick = () => {
          const checkProgress = $scope.download(params, url, () => $element, 'POST');
          checkProgress(inProgress, done);
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
        const url = config.api + '/data?annotations=true&related_files=true';

        const clickHandler = () => {
          const files = [].concat($scope.files);

          if (UserService.userCanDownloadFiles(files)) {
            const params = { ids: files.map(f => f.file_id) };
            const checkProgress = $scope.download(params, url, () => $element, 'POST');

            checkProgress(inProgress, done);
          } else {
            $log.log('Files not authorized.');
            const template = UserService.currentUser ?
              'core/templates/request-access-to-download-single.html' :
              'core/templates/login-to-download-single.html';

            $uibModal.open({
              templateUrl: template,
              controller: 'LoginToDownloadController',
              controllerAs: 'wc',
              backdrop: true,
              keyboard: true,
              animation: false,
              size: 'lg'
            });
          }
        };

        $element.on('click', clickHandler);
      }
    };
  }

  function BAMSlicingButton($log: ng.ILogService, FilesService, UserService, $uibModal): ng.IDirective {
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
        var files = $scope.files;
        $scope.active = false;
        $element.on("click", function(a) {

          if (!_.isArray(files)) {
            files = [files];
          }
          if (UserService.userCanDownloadFiles(files)) {
            $scope.active = true;
            $attrs.$set("disabled", "disabled");
            var turnSpinnerOff = function() {
              $scope.active = false;
              $element.removeAttr("disabled");
            };
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
          } else {
            var template = UserService.currentUser ?
                "core/templates/request-access-to-download-single.html" :
                "core/templates/login-to-download-single.html";

            $log.log("File not authorized.");
            $uibModal.open({
              templateUrl: template,
              controller: "LoginToDownloadController",
              controllerAs: "wc",
              backdrop: true,
              keyboard: true,
              animation: false,
              size: "lg"
            });
          }
        });
      }
    }
  }

  angular
    .module("files.directives", ["restangular", "components.location", "user.services", "core.services", "ui.bootstrap", "files.controller"])
    .directive("downloadButton", DownloadButton)
    .directive("downloadMetadataButton", DownloadMetadataButton)
    .directive("bamSlicingButton", BAMSlicingButton);
}
