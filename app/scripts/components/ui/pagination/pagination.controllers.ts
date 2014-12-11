module ngApp.components.ui.pagination.controllers {
  import ILocationService = ngApp.components.location.services.ILocationService;
  import IPagination = ngApp.components.ui.pagination.models.IPagination;

  interface IPagingController {
    setCount(event: any, size: number): void;
    refresh(page: string): void;
  }

  interface IPagingScope extends ng.IScope {
    page: string;
    paging: IPagination;
  }

  class PagingController implements IPagingController {
    /* @ngInject */
    constructor(private $scope: IPagingScope, private LocationService: ILocationService) {}

    setCount(event: any, size: number) {
      this.$scope.paging.size = size;
      this.refresh();
    }

    refresh() {
      var pagination = this.LocationService.pagination(),
          current = this.$scope.paging;

      current.size = isNaN(current.size) || current.size <= 10 ? 10 : current.size;
      current.from = (current.size * (current.page - 1)) + 1;

      var obj = {
        from: current.from,
        size: current.size
      };

      pagination[this.$scope.page] = obj;

      this.LocationService.setPaging(pagination);
    }
  }

  angular.module("pagination.controllers", ["location.services"])
      .controller("PagingController", PagingController);
}
