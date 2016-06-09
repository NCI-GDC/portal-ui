module ngApp.components.summaryCard.controllers {

  import IFacetService = ngApp.components.facets.services.IFacetService;
  import ILocationService = ngApp.components.location.services.ILocationService;

  interface ISummaryCardController {
    addFilters(item: any): void;
    clearFilters(): void;
  }

  class SummaryCardController implements ISummaryCardController {

    /* @ngInject */
    constructor(
      private $scope,
      private LocationService: ILocationService,
      private FacetService: IFacetService
    ) {}

    addFilters(item: any) {
      var config = this.$scope.config;
      var filters = this.FacetService.ensurePath(this.LocationService.filters());

      if (!config.filters ||
        (!config.filters[item[config.displayKey]] && !config.filters.default)) {
        return;
      }

      var params = config.filters[item[config.displayKey]]
        ? config.filters[item[config.displayKey]].params
        : { filters: config.filters.default.params.filters(item[config.displayKey]) };

      const newFilter = angular.fromJson(params.filters).content[0].content;
      this.FacetService.addTerm(newFilter.field, newFilter.value[0]);
    }

    clearFilters(): void {
      this.FacetService.removeFacet(this.$scope.config.filterKey);
    }
  }

  angular
      .module("summaryCard.controller", [
        "location.services"
      ])
      .controller("SummaryCardController", SummaryCardController);
}
