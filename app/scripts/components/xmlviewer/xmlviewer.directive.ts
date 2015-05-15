module ngApp.components.xmlviewer {

  import IGDCWindowService = ngApp.core.models.IGDCWindowService;

  interface XMLViewerScope extends ng.IScope {
    xml: string;
  }

  function XMLViewer($window: IGDCWindowService): ng.IDirective {

    return {
      restrict: "EA",
      scope: {
        xml: "="
      },
      link: function ($scope: XMLViewerScope) {
        $window.LoadXMLString("xmlViewer", $scope.xml);
      }
    };
  }

  angular
      .module("components.xmlviewer", [])
      .directive("xmlViewer", XMLViewer);
}
