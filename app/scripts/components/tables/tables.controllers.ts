module ngApp.components.tables.controllers {
  import ILocationService = ngApp.components.location.services.ILocationService;
  import ITableColumn = ngApp.components.tables.models.ITableColumn;
  import IPagination = ngApp.components.ui.pagination.models.IPagination;

  interface ITableSortController {
    updateSorting(): void;
    paging: IPagination;
  }

  interface ITableScope extends ng.IScope {
    paging: IPagination;
    page: string;
    sortColumns: ITableColumn[];
  }

  class TableSortController implements ITableSortController {
    paging: IPagination;

    /* @ngInject */
    constructor(private $scope: ITableScope, private LocationService: ILocationService) {
      this.paging = $scope.paging;
      var currentSorting = $scope.paging.sort;

      // We need to manually check the URL and parse any active sorting down
      if (currentSorting) {
        currentSorting = currentSorting.split(",");

        _.each(currentSorting, (sort: string) => {
          var sortField = sort.split(":");

          var sortObj = _.find($scope.sortColumns, (col: any) => { return col.key === sortField[0]; });

          // Update the internal sorting object to have sorting from URL values applied
          if (sortObj) {
            sortObj.sort = true;
            sortObj.order = sortField[1];
          }
        });
      }
    }

    updateSorting(): void {
      var pagination = this.LocationService.pagination();
      this.paging.sort = _.filter(this.$scope.sortColumns, (col: any) => { return col.sort; });

      var sortString = "";

      _.each(this.paging.sort, (col: any, index: number) => {
        if (!col.order) {
          col.order = "asc";
        }

        sortString += col.key + ":" + col.order;

        if (index < (this.paging.sort.length - 1)) {
          sortString += ",";
        }
      });

      this.paging.sort = sortString;

      pagination[this.$scope.page] = this.paging;
      this.LocationService.setPaging(pagination);
    }
  }

  angular.module("tables.controllers", ["location.services"])
      .controller("TableSortController", TableSortController);
}
