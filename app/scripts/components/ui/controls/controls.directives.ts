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

        const scope = $scope;

        function _initListeners() {
          var _timeOutHandle = null;

          $element.focus(
            () => {
              scope.$evalAsync(() => {
                scope.uiControl.isOpen = true;
                $element.find('#' + $scope.uiControl.id).focus();
              });

              if (_timeOutHandle) {
                clearTimeout(_timeOutHandle);
                _timeOutHandle = null;
              }
            });

          /*$element.blur(() => {
              _timeOutHandle = setTimeout(() => {

                scope.$evalAsync(() => {
                  scope.uiControl.isOpen = false;
                });

              }, 500)
            });*/

            // if (typeof scope[$attrs.isLoadingIndicatorFlag] === 'undefined') {
            //   $scope[$attrs.isLoadingIndicatorFlag] = false;
            // }

            scope.$watch(() => {
              return  scope[$attrs.isLoadingIndicatorFlag];
            }, (isLoading) => {
              scope.uiControl.isLoading = isLoading;
            });

        }

        function _init() {
          scope.uiControl = {
            id: 'split-control-' + (new Date().getTime()),
            isOpen: false,
            isLoading: false,
            controlLabelText: $attrs.controlLabelText || 'Action Label',
            srLabel: $attrs.srLabel || 'Split Control',
            shouldSplitControl: $attrs.noSplit === 'true' ? false : true,
            iconClasses: $attrs.iconClasses || false
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
      link: () => {
      }
    };
  }


  angular.module("ui.control.directives", [])
    .directive("splitControl", SplitControl)
    .directive("splitControlOption", SplitControlOption);
}