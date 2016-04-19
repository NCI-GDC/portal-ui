module ngApp.components.ui.control.directives {

  export type IUIControl = {
    id: string;
    isOpen: boolean;
    isLoading: boolean;
    controlLabelText: string;
    srLabel: string;
    shouldSplitControl: boolean;
    iconClasses: string;
  };

  interface ISplitControlScope extends ng.IScope {
    uiControl: IUIControl;
  }

  function SplitControl() : ng.IDirective {
    return {
      restrict: "EA",
      scope: true,
      replace: true,
      transclude: true,
      templateUrl: "components/ui/controls/templates/split-control-button.html",
      controller: function () {
        // Included for extensibility
      },
      link: ($scope: ISplitControlScope, $element: ng.IAugmentedJQuery, $attrs: ng.IAttributes) => {
        var loadingState = false;
        var childStates = {};

        function _initListeners() {
          $element.keydown(function(e) {
            if(e.which == 13) { // enter key
              $element.find('#' + $scope.uiControl.id).click();
            }
          });

          $scope.$watch(() => loadingState, (isLoading) => {
            $scope.uiControl.isLoading = isLoading;
          });
        }

        function _init() {
          $scope.uiControl = {
            id: 'split-control-' + (new Date().getTime()),
            isLoading: false,
            controlLabelText: $attrs.controlLabelText || 'Action Label',
            srLabel: $attrs.srLabel || 'Split Control',
            shouldSplitControl: $attrs.noSplit === 'true' ? false : true,
            iconClasses: $attrs.iconClasses || false,
            btnType: $attrs.btnType || 'primary'
          };
          $scope.reportStatus = (id, status) => {
            _.set(childStates, [id], status);
            loadingState = _.some(_.values(childStates), (s) => s);
          };

          _initListeners();
        }

        _init();
      }
  };
}

  function SplitControlOption() : ng.IDirective {
    return {
      restrict: "AE",
      replace: true,
      scope: true,
      transclude: true,
      require: "^splitControl",
      templateUrl: "components/ui/controls/templates/split-control-option.html",
      link: (scope, element, attributes, controller, transclude) => {
        const myId = scope.id;
        var loadingState = false;
        var childStates = {};

        scope.reportStatus = (id, status) => {
          _.set(childStates, [id], status);
          loadingState = _.some(_.values(childStates), (s) => s);
        };

        scope.$watch(() => loadingState, (isLoading) => {
          scope.$parent.$parent.reportStatus(myId, isLoading);
        });

        transclude(scope.$new(), (clone) => {
          element.append(clone);
        });
      }
    };
  }

  angular.module("ui.control.directives", [])
    .directive("splitControl", SplitControl)
    .directive("splitControlOption", SplitControlOption);
}
