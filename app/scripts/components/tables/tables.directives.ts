module ngApp.components.tables.directives {

  import IGDCWindowService = ngApp.models.IGDCWindowService;

  interface ITableDirectiveScope extends ng.IScope {
     filtersRevealed:boolean;
  }

  /* @ngInject */
  function ArrangeColumns($window, UserService): ng.IDirective {

    return {
      restrict: "EA",
      scope: {
        title: "@",
        headings:"=",
        defaultHeadings: "=",
        saved: "="
      },
      replace: true,
      templateUrl: "components/tables/templates/arrange-columns.html",
      link:function($scope) {
        $scope.UserService = UserService;

        function saveSettings() {
          var save = _.map($scope.headings, h => _.pick(h, 'id', 'hidden', 'sort', 'order'));
          $window.localStorage.setItem($scope.title + '-col', angular.toJson(save));
        }

        var defaults = $scope.defaultHeadings;

        $scope.headings = ($scope.saved || []).length ?
          _.map($scope.saved, s => _.merge(_.find($scope.headings, {id: s.id}), s)) :
          $scope.headings;

        $scope.restoreDefaults = function() {
          $scope.headings = _.cloneDeep(defaults);
          saveSettings();
        }

        $scope.toggleVisibility = function (item) {
          item.hidden = !item.hidden;
          saveSettings();
        };

        $scope.sortOptions = {
          orderChanged: saveSettings
        };
      }
    };
  }

  function ExportTable(): ng.IDirective {
    return {
      restrict: "EA",
      scope: {
        text: "@",
        size: "@",
        headings: "=",
        endpoint: "@",
        expand: "="
      },
      replace: true,
      templateUrl: "components/tables/templates/export-table.html",
      controller: "ExportTableController as etc"
    };
  }

  function ReportsExportTable(): ng.IDirective {
    return {
      restrict: "EA",
      scope: {
        text: "@",
        size: "@",
        headings: "=",
        endpoint: "@",
        expand: "="
      },
      replace: true,
      templateUrl: "components/tables/templates/reports-export-table.html",
      controller: "ExportTableController as etc"
    };
  }

  function SortTable(): ng.IDirective {
    return {
      restrict: "EA",
      scope: {
        paging: "=",
        page: "@",
        headings: "=",
        title: "@",
        update: "=",
        data: "=",
        saved: "="
      },
      replace: true,
      templateUrl: "components/tables/templates/sort-table.html",
      controller: "TableSortController as tsc"
    }
  }

  function GDCTable(): ng.IDirective {
    return {
      restrict: "E",
      scope: {
        heading: "@",
        data: "=",
        config: "=",
        paging: "=",
        page: "@",
        sortColumns: "=",
        id: "@",
        endpoint: "@",
        clientSide: "="
      },
      replace: true,
      templateUrl: "components/tables/templates/gdc-table.html",
      controller: "GDCTableController as gtc"
    }
  }

  angular.module("tables.directives", ["tables.controllers"])
      .directive("exportTable", ExportTable)
      .directive("reportsExportTable", ReportsExportTable)
      .directive("sortTable", SortTable)
      .directive("gdcTable", GDCTable)
      .directive("arrangeColumns", ArrangeColumns);
}
