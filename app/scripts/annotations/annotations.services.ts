module ngApp.annotations.services {
  import IAnnotation = ngApp.annotations.models.IAnnotation;
  import IAnnotations = ngApp.annotations.models.IAnnotations;
  import ILocationService = ngApp.components.location.services.ILocationService;
  import ICoreService = ngApp.core.services.ICoreService;

  export interface IAnnotationsService {
    getAnnotation(id: string, params?: Object): ng.IPromise<IAnnotation>;
    getAnnotations(params?: Object): ng.IPromise<IAnnotations>;
  }

  class AnnotationsService implements IAnnotationsService {
    private ds: restangular.IElement;

    /* @ngInject */
    constructor(Restangular: restangular.IService, private LocationService: ILocationService,
                private CoreService: ICoreService) {
      this.ds = Restangular.all("annotations");
    }

    getAnnotation(id: string, params: Object = {}): ng.IPromise<IAnnotation> {
      if (params.hasOwnProperty("fields")) {
        params["fields"] = params["fields"].join();
      }

      return this.ds.get(id, params).then((response): IAnnotation => {
        return response["data"];
      });
    }

    getAnnotations(params: Object = {}): ng.IPromise<IAnnotations> {
      if (params.hasOwnProperty("fields")) {
        params["fields"] = params["fields"].join();
      }

      if (params.hasOwnProperty("facets")) {
        params["facets"] = params["facets"].join();
      }

      var paging = angular.fromJson(this.LocationService.pagination()["annotations"]);

      // Testing is expecting these values in URL, so this is needed.
      paging = paging || {
        size: 10,
        from: 1
      };

      var defaults = {
        size: paging.size,
        from: paging.from,
        sort: paging.sort,
        filters: this.LocationService.filters()
      };

      if (!defaults.sort) {
        delete defaults.sort;
      }

      this.CoreService.setSearchModelState(false);

      return this.ds.get("", angular.extend(defaults, params)).then((response): IAnnotations => {
        return response["data"];
      });
    }
  }

  angular
      .module("annotations.services", ["restangular", "components.location", "core.services"])
      .service("AnnotationsService", AnnotationsService);
}
