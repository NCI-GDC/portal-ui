module ngApp.files.directives {

  function DownloadButton($log: ng.ILogService, FilesService, UserService, $modal): ng.IDirective {
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
            FilesService.downloadFiles(_.pluck(files, "file_id"), (complete)=>{
              if(complete){
                turnSpinnerOff();
              } else {
                //Download Failed
                turnSpinnerOff();
              }
            });
          } else {
            var template = UserService.currentUser ?
                "core/templates/request-access-to-download-single.html" :
                "core/templates/login-to-download-single.html";

            $log.log("File not authorized.");
            $modal.open({
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

  function BAMSlicingButton($log: ng.ILogService, FilesService, UserService, $modal): ng.IDirective {
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
            var bamModal = $modal.open({
              templateUrl: "files/templates/bam-slicing.html",
              controller: "BAMSlicingController",
              controllerAs: "bamc",
              backdrop: true,
              keyboard: true,
              animation: false,
              size: "lg",
              resolve: {
                fileID: function () {
                  return _.first(_.pluck(files, "file_id"));
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
            $modal.open({
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
