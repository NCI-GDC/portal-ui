module ngApp.annotations.services {
  import IAnnotation = ngApp.annotations.models.IAnnotation;
  import IAnnotations = ngApp.annotations.models.IAnnotations;
  import ILocationService = ngApp.components.location.services.ILocationService;

  export interface IAnnotationsService {
    getAnnotation(id: string, params?: Object): ng.IPromise<IAnnotation>;
    getAnnotations(params?: Object): ng.IPromise<IAnnotations>;
  }

  class AnnotationsService implements IAnnotationsService {
    private ds: restangular.IElement;

    /* @ngInject */
    constructor(Restangular: restangular.IService, private LocationService: ILocationService) {
      this.ds = Restangular.all("annotations");
    }

    getAnnotation(id: string, params: Object = {}): ng.IPromise<IAnnotation> {
      if(params.hasOwnProperty("fields")) {
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
      var defaults = {
        size: 10,
        from: 1,
        filters: this.LocationService.filters()
      };

      return this.ds.get("", angular.extend(defaults, params)).then((response): IAnnotations => {
        return response["data"];
      });
    }
  }

  angular
      .module("annotations.services", ["restangular", "components.location"])
      .service("AnnotationsService", AnnotationsService);
}
