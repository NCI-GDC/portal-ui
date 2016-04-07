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
          $element.keydown(function(e){
              if(e.which == 13){ // enter key
                  e.preventDefault();
                  $element.find('#' + $scope.uiControl.id).click();
              }
          });

          scope.$watch(() => {
            return  scope[$attrs.isLoadingIndicatorFlag];
          }, (isLoading) => {
            scope.uiControl.isLoading = isLoading;
          });
        }

        function _init() {
          scope.uiControl = {
            id: 'split-control-' + (new Date().getTime()),
            isLoading: false,
            controlLabelText: $attrs.controlLabelText || 'Action Label',
            srLabel: $attrs.srLabel || 'Split Control',
            shouldSplitControl: $attrs.noSplit === 'true' ? false : true,
            iconClasses: $attrs.iconClasses || false,
            btnType: $attrs.btnType || 'primary'
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
