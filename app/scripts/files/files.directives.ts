module ngApp.files.directives {

  function DownloadButton($log: ng.ILogService): ng.IDirective {
    return {
      restrict: "AE",
      scope: {
        files:"="
      },
      controller:function($element,$scope, FilesService,UserService,$modal){
        $element.on("click", function(a) {
          var files = $scope.files;
          if (!_.isArray(files)) {
            files = [files];
          }
          if (UserService.userCanDownloadFiles(files)) {
            var file_ids = _.pluck(files, "file_id").concat($scope.files.related_ids);
            FilesService.downloadFiles(file_ids);
          } else {
            var template = UserService.currentUser ?
                "core/templates/request-access-to-download-single.html" :
                "core/templates/login-to-download-single.html";

            $log.log("File not authorized.");
            $modal.open({
              templateUrl: template,
              controller: "LoginToDownloadController as wc",
              backdrop: "static",
              keyboard: false,
              scope: $scope,
              backdropClass: "warning-backdrop",
              size: "lg"
            });
          }
        });
      }
    }
  }

  angular
    .module("files.directives", ["restangular", "components.location", "user.services", "core.services", "ui.bootstrap"])
    .directive("downloadButton", DownloadButton);
}