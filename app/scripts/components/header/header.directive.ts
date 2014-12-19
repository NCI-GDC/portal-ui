module ngApp.components.header.directives {

  import IHeaderController = ngApp.components.header.controllers.IHeaderController;

  function header(): ng.IDirective {
    return {
      restrict: "E",
      templateUrl: "components/header/templates/header.html",
      controller: "HeaderController as hc"
    };
  }

  angular
      .module("header.directives", [])
      .directive("ngaHeader", header);
}
