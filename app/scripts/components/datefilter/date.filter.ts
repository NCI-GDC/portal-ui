module ngApp.components.datefilter {

  import IGDCWindowService = ngApp.models.IGDCWindowService;

  class MomentDate {
    constructor($window: IGDCWindowService) {
      return function(val: string, format:string = "MM/DD/YYYY h.mm A") {
        return $window.moment(val).format(format);
      };
    }
  }

  angular.module("components.datefilter", [])
    .filter("date", MomentDate);

}
