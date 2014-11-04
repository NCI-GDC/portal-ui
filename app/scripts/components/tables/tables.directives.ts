module ngApp.components.tables.directives {

  /* @ngInject */
  function SelectColumns(): ng.IDirective {
    return {
      restrict: "EA",
      scope: {
      },
      replace: true,
      templateUrl: "components/tables/templates/select-columns.html",
      link: function ($scope: ng.IScope) {
        //TODO
      }
    };
  }

  function ExportTable(): ng.IDirective {
    return {
      restrict: "EA",
      scope: {
      },
      replace: true,
      templateUrl: "components/tables/templates/export-table.html",
      link: function ($scope: ng.IScope) {
        //TODO
      }
    };
  }

  angular.module("components.tables.directives", [])
      .directive("selectColumns", SelectColumns)
      .directive("exportTable", ExportTable);
}

