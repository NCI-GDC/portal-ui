module ngApp.components.summaryCard.controllers {

  interface ISummaryCardController {
    addFilters(item: any): void;
    clearFilters(): void;
  }

  class SummaryCardController implements ISummaryCardController {

    /* @ngInject */
    constructor(
      private $scope,
      private LocationService: ILocationService
    ) {}

    addFilters(item: any) {
      var config = this.$scope.config;
      var filters = this.ensurePath(this.LocationService.filters());

      if (!config.filters ||
        (!config.filters[item[config.displayKey]] && !config.filters.default)) {
        return;
      }

      var params = config.filters[item[config.displayKey]]
        ? config.filters[item[config.displayKey]].params
        : { filters: config.filters.default.params.filters(item[config.displayKey]) };

      var newFilter = JSON.parse(params.filters).content[0]; // there is always just one

      filters.content = filters.content.some(filter => _.isEqual(filter, newFilter))
        ? filters.content.filter(filter => !_.isEqual(filter, newFilter))
        : filters.content.concat(newFilter);

      this.LocationService.setFilters(filters.content.length ? filters : null);
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

    ensurePath(filters: Object): Object {
      if (!filters.content) {
        filters = {op: "and", content: []};
      }
      return filters;
    }
  }

  angular
      .module("summaryCard.controller", [
        "location.services"
      ])
      .controller("SummaryCardController", SummaryCardController);
}
