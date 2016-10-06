module ngApp.components.clipboardButton.directive {

  function ClipboardButton($timeout) {
    return {
      restrict: "E",
      templateUrl: "components/clipboard-button/templates/clipboard-button.html",
      scope: {
        targetId:"@",
        targetContent: "=",
      },
      link: (scope, element, attrs) => {
        scope.tooltipText = 'Copy to clipboard';

        element.on('mouseenter', () => {
          let tooltip = $(`#${scope.targetId} .clipboard-button-tooltip`);
          tooltip.css('zIndex', 9999);
          $timeout(() => tooltip.css('opacity', 1));
        });

        element.on('mouseleave', () => {
          let tooltip = $(`#${scope.targetId} .clipboard-button-tooltip`);
          tooltip.css('opacity', 0);
          
          $timeout(() => {
            tooltip.css('zIndex', -100);
            scope.tooltipText = 'Copy to clipboard';
          }, 250);
        });

        element.on('click', () => {
          scope.tooltipText = 'Copied!';
        });
      }
    };
  }

  angular.module("clipboardButton.directive", [])
    .directive("clipboardButton", ClipboardButton);
}
