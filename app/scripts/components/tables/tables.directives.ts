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

  function TableFiltersDropdown(): ng.IDirective {
    return {
      restrict: "EA",
      scope: {
        filters:"="
      },
      replace: true,
      templateUrl: "components/tables/templates/table-filters-dropdown.html",
      link: function ($scope: ng.IScope, elem) {
        $scope.filtersRevealed = false;

        $('body').on('click',function(e){
          var targetIsMenu = $(e.target).parents('.filter-dropdown-group')[0];
          if (!targetIsMenu) {
            $scope.filtersRevealed = false;
            $scope.$apply();
          }
        })
      }
    };
  }

  angular.module("components.tables.directives", [])
      .directive("selectColumns", SelectColumns)
      .directive("exportTable", ExportTable)
      .directive("tableFiltersDropdown", TableFiltersDropdown);
}

