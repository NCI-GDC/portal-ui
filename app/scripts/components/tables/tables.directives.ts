module ngApp.components.tables.directives {


  interface ITableDirectiveScope extends ng.IScope {
     filtersRevealed:boolean;
  }

  /* @ngInject */
  function ArrangeColumns(): ng.IDirective {

    return {
      restrict: "EA",
      scope: {
        list:"=",
        order:"="
      },
      replace: true,
      templateUrl: "components/tables/templates/arrange-columns.html",
      link:function(scope:any){
        scope.models = {};
        scope.onMoved = function($index){
          scope.list.splice($index,1);
        }
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
  
  function SortTable(): ng.IDirective {
    return {
      restrict: "EA",
      scope: {
        sortColumns: "=",
        paging: "=",
        page: "@"
      },
      replace: true,
      templateUrl: "components/tables/templates/sort-table.html",
      controller: "TableSortController as tsc"
    }
  }




  angular.module("tables.directives", ["tables.controllers"])
      .directive("exportTable", ExportTable)
      .directive("sortTable", SortTable)
      .directive("arrangeColumns", ArrangeColumns);
}

