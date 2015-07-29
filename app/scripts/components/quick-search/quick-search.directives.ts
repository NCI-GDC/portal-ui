module ngApp.components.quickSearch.directives {
  enum KeyCode {
    Space = 32,
    Enter = 13,
    Esc = 27,
    Left = 37,
    Right = 39,
    Up = 38,
    Down = 40,
    Tab = 9
  }

  /* @ngInject */
  function QuickSearch($modal: any, $window: ng.IWindowService, $modalStack): ng.IDirective {
    return {
      restrict: "A",
      controller: function($scope) {
        var modalInstance;

        $scope.$on("$stateChangeStart", () => {
          if (modalInstance) {
            modalInstance.close();
          }
        });

        this.openModal = () => {
          // Modal stack is a helper service. Used to figure out if one is currently
          // open already.
          if ($modalStack.getTop()) {
            return;
          }

          modalInstance = $modal.open({
            templateUrl: "components/quick-search/templates/quick-search-modal.html",
            backdrop: true,
            keyboard: true,
            animation: false,
            size: "lg"
          });
        };
      },
      link: function($scope, $element, attrs, ctrl) {
        $element.on("click", function() {
          ctrl.openModal();
        });

        angular.element($window.document).on("keypress", (e) => {
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

  /* @ngInject */
  function QuickSearchDropdown(): ng.IDirective {
    return {
      restrict: "E",
      templateUrl: "components/quick-search/templates/quick-search-dropdown.html",
      scope: true
    };
  }

  /* @ngInject */
  function QuickSearchInput(QuickSearchService: IQuickSearchService, FacetService,
                            $compile: ng.ICompileService, $modalStack): ng.IDirective {

    return {
      restrict: "E",
      replace: true,
      templateUrl: "components/quick-search/templates/quick-search-input.html",
      link: function($scope, element) {
        $scope.results = [];

        function setBioSpecimen(result) {
          if (result._type !== "case") {
            return;
          }

          function findMatch(obj) {
            for (var key in obj) {
              if (obj.hasOwnProperty(key)) {
                if (_.isString(obj[key])) {
                  if (obj[key].toLowerCase().indexOf($scope.searchQuery.toLowerCase()) === 0) {
                    result.bioSpecimen = obj;
                    return;
                  }
                } else if (_.isArray(obj[key])) {
                  _.forEach(obj[key], (item) => {
                    findMatch(item);
                  });
                }
              }
            }
          }

          _.forEach(result.samples, (sample) => {
            if (!result.bioSpecimen) {
              findMatch(sample);
            }
          });
        }

        $scope.keyboardListener = function(e: any) {
          function selectItem(dir) {
            var newIndex;

            _.forEach($scope.results.hits, (elem, index) => {
              if (_.isEqual(elem, $scope.selectedItem)) {
                if (dir === "down" && index + 1 < $scope.results.hits.length) {

                  newIndex = index + 1;
                } else if (dir === "up" && index - 1 >= 0) {
                  newIndex = index - 1;
                } else {
                  newIndex = index;
                }
              }
            });

            $scope.selectedItem.selected = false;
            $scope.results.hits[newIndex].selected = true;
            $scope.selectedItem = $scope.results.hits[newIndex];
          }

          var key = e.which || e.keyCode
          switch (key) {
            case KeyCode.Enter:
              e.preventDefault();
              if (!$scope.selectedItem) {
                return;
              }

              QuickSearchService.goTo($scope.selectedItem._type, $scope.selectedItem._id);
              break;
            case KeyCode.Up:
              e.preventDefault();
              selectItem("up");
              break;
            case KeyCode.Down:
              e.preventDefault();
              selectItem("down");
              break;
            case KeyCode.Esc:
              $modalStack.dismissAll();
              break;
            case KeyCode.Tab:
              e.preventDefault();
              break;
          }
        };

        $scope.itemHover = function(item: any) {
          $scope.selectedItem.selected = false;
          item.selected = true;
          $scope.selectedItem = item;
        };

        $scope.goTo = function(entity: string, id: string) {
          QuickSearchService.goTo(entity, id);
        };

        $scope.search = function() {
          $scope.searchQuery = $scope.searchQuery.trim();

          if (!$scope.searchQuery || $scope.searchQuery.length < 2) {
            $scope.results = [];
            $scope.selectedItem = null;
            $scope.displayItem = null;
            return;
          }

          var params = {
            query: $scope.searchQuery,
            fields: [
              "project_id",
              "name",
              "disease_type",
              "primary_site",
              "project.project_id",
              "project.name",
              "project.disease_type",
              "project.primary_site",
              "aliquot_ids",
              "submitter_aliquot_ids",
              "analyte_ids",
              "submitter_analyte_ids",
              "case_id",
              "submitter_id",
              "portion_ids",
              "submitter_portion_ids",
              "sample_ids",
              "submitter_sample_ids",
              "file_id",
              "file_name",
              "file_size",
              "data_type",
              "clinical.gender",
              "samples.sample_id",
              "samples.submitter_id",
              "samples.sample_type",
              "samples.portions.portion_id",
              "samples.portions.submitter_id",
              "samples.portions.analytes.analyte_id",
              "samples.portions.analytes.submitter_id",
              "samples.portions.analytes.analyte_type",
              "samples.portions.analytes.aliquots.aliquot_id",
              "samples.portions.analytes.aliquots.submitter_id"
            ]
          };

          $scope.activeQuery = true;

          FacetService.searchAll(params)
          .then((res) => {
            $scope.activeQuery = false;

            var data = res.data;

            data.hits = _.map(data.hits, (hit) => {
              setBioSpecimen(hit);
              return hit;
            });

            $scope.results = _.assign({}, data);

            if (!$scope.results.hits.length) {
              $scope.selectedItem = null;
              return;
            }

            $scope.results.hits[0].selected = true;
            $scope.selectedItem = $scope.results.hits[0];
          });
        };

        element.after($compile("<quick-search-dropdown></quick-search-dropdown>")($scope));
      }
    };
  }

  class Highlight {
    constructor($rootScope: ng.IScope) {
      return function (value: string, query: string) {
        if (!value) {
          return "";
        }

        var regex = new RegExp("[" + query.replace(/\-/g, "\\-") + "]{" + query.length + "}", "i");

        if (!_.isArray(value)) {
          value = [value];
        }

        var html = "";
        // Only ever show the top matched term in the arrays returned.
        var term = _.filter(value, (item) => {
          var matchedText = item.match(regex);

          if (matchedText) {
            matchedText = matchedText[0];

            return matchedText.toLowerCase() === query.toLowerCase();
          }

          return false;
        }).sort((a, b) => {
          return a.match(regex).length - b.match(regex).length;
        })[0];

        if (term) {
          var matchedText = term.match(regex);
          matchedText = matchedText[0];
          var boldedQuery = "<span class='bolded'>" + matchedText + "</span>";
          html = term.replace(regex, boldedQuery);
        }

        return html;
      };
    }
  }

  angular
    .module("quickSearch.directives", [
      "ui.bootstrap.modal",
      "facets.services",
      "quickSearch.services"
    ])
    .filter("highlight", Highlight)
    .directive("quickSearchDropdown", QuickSearchDropdown)
    .directive("quickSearchInput", QuickSearchInput)
    .directive("quickSearch", QuickSearch);
}
