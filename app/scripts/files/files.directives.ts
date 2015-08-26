module ngApp.files.directives {

  function DownloadButton($log: ng.ILogService, FilesService, UserService, $modal): ng.IDirective {
    return {
      restrict: "E",
      replace: true,
      scope: {
        files:"=",
        copy: "@",
        dlcopy: "@"
      },
      template: '<a class="btn btn-primary">' +
	              '<i class="fa fa-download" ng-class="{\'fa-spinner\': active, \'fa-pulse\': active}"></i>' +
	              '<span ng-if="copy"><span ng-if="!active"> {{copy}}</span><span ng-if="active"> {{dlcopy}}</span></span></a>',
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

            FilesService.downloadFiles(_.pluck(files, "file_id"), (complete)=>{

              if(complete){
                $scope.active = false;
                $element.removeAttr("disabled");
              }
            });

          } else {
            var template: string = "core/templates/login-to-download-single.html";
            if (UserService.currentUser) {
              template = "core/templates/request-access-to-download-single.html";
            } else if (!UserService.hasDbGap()) {
              template = "core/templates/dbgap-warning.html";
            }

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
    .module("files.directives", ["restangular", "components.location", "user.services", "core.services", "ui.bootstrap"])
    .directive("downloadButton", DownloadButton);
}
