module ngApp.files.directives {

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
    .directive("bamSlicingButton", BAMSlicingButton);
}
