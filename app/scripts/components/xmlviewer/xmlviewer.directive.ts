module ngApp.components.xmlviewer {

  interface XMLViewerScope extends ng.IScope {
    xml: string;
  }

  interface ILoadViewerService extends ng.IWindowService {
    LoadXMLString: any;
  }

  function XMLViewer($window: ILoadViewerService): ng.IDirective {

    return {
      restrict: "EA",
      scope: {
        xml: "="
      },
      link: function($scope: XMLViewerScope) {
        $window.LoadXMLString("xmlViewer", $scope.xml);
      }
    };
  }

  angular
      .module("components.xmlviewer", [])
      .directive("xmlViewer", XMLViewer);
}
