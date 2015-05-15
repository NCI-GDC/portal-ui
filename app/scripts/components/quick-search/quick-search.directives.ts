module ngApp.components.quickSearch.directives {

  function QuickSearch($modal: any, $window: ng.IWindowService, $modalStack): ng.IDirective {
    return {
      restrict: "A",
      controller: function($scope) {
        var modalInstance;
        var docElem = angular.element($window.document);
        var modalElem = angular.element("#quick-search-modal");

        $scope.$on("$stateChangeStart", () => {
          if (modalInstance) {
            modalInstance.close();
          }
        });

        this.openModal = () => {
          if (!(modalElem.data("bs.modal") || {}).isShown) {

            modalInstance = $modal.open({
              templateUrl: "components/quick-search/templates/quick-search-modal.html",
              controller: "QuickSearchModalController as qsmc",
              backdrop: "static",
              size: "lg",
              keyboard: true
            });

            modalInstance.opened.then(() => {
              // Apparently the Modal should support this by default but I'm running
              // into cases where it is not.
              docElem.on("click", (e) => {
                if (angular.element(e.target).find("#quick-search-modal").length) {
                  e.preventDefault();
                  modalInstance.close();
                }
              });
            });
          }
        };
      },
      link: function($scope, $element, attrs, ctrl) {
        $element.on("click", function() {
          ctrl.openModal();
        });

        angular.element($window.document).on("keypress", (e) => {
          // Modal stack is a helper service. Used to figure out if one is currently
          // open already.
          if ($modalStack.getTop()) {
            return;
          }

          var modalElem = angular.element("#quick-search-modal");
          var validSpaceKeys = [
            0, // Webkit
            96 // Firefox
          ];

          if (e.ctrlKey && validSpaceKeys.indexOf(e.which) !== -1) {
            e.preventDefault();
            ctrl.openModal();
          }
        });
      }
    };
  }

  function MatchedTerm($sce): ng.IDirective {
    return {
      restrict: "E",
      templateUrl: "components/quick-search/templates/matched-term.html",
      scope: {
        term: "=",
        query: "="
      },
      link: function($scope) {
        var boldedQuery = "<span class='bolded'>" + $scope.query + "</span>";
        $scope.term = $sce.trustAsHtml($scope.term.replace(new RegExp($scope.query, "g"), boldedQuery));
      }
    };
  }

  angular
    .module("quickSearch.directives", [
      "ui.bootstrap.modal"
    ])
    .directive("matchedTerm", MatchedTerm)
    .directive("quickSearch", QuickSearch);
}
