module ngApp.components.summaryCard.controllers {

  interface ISummaryCardController {
    addFilters(item: any, state: string): void;
    clearFilters(): void;
  }

  class SummaryCardController implements ISummaryCardController {

    /* @ngInject */
    constructor(private $scope,
                public LocationService: ILocationService,
                private $state: ng.ui.IStateService) {}

    addFilters(item: any, state: string) {
      var params: {};
      var config = this.$scope.config;

      if (!config.filters || (!config.filters[item[config.displayKey]] &&
          !config.filters.default)) {
        return;
      }

      if (config.filters[item[config.displayKey]]) {
        var filters = config.filters[item[config.displayKey]];
        params = filters.params;
      } else {
        params = {
          filters: config.filters.default.params.filters(item[config.displayKey])
        };
      }

      this.$state.go(state, { filters: params.filters }, { inherit: false });
    }

    clearFilters() {
      var filters = this.LocationService.filters();

      filters.content = _.reject(filters.content, (filter) => {
        return filter.content.field === this.$scope.config.filterKey;
      });

      if (filters.content.length) {
        this.LocationService.setFilters(filters);
        return;
      }

      this.LocationService.clear();
    }
  }

  angular
      .module("summaryCard.controller", [
        "location.services"
      ])
      .controller("SummaryCardController", SummaryCardController);
}
