module ngApp.annotations.services {
  import IAnnotation = ngApp.annotations.models.IAnnotation;
  import IAnnotations = ngApp.annotations.models.IAnnotations;

  export interface IAnnotationsService {
    getAnnotation(id: string, params?: Object): ng.IPromise<IAnnotation>;
    getAnnotations(params?: Object): ng.IPromise<IAnnotations>;
  }

  class AnnotationsService implements IAnnotationsService {
    private ds: restangular.IElement;

    /* @ngInject */
    constructor(Restangular: restangular.IService) {
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
      return this.ds.get("", params).then((response): IAnnotations => {
        return response["data"];
      });
    }
  }

  angular
      .module("annotations.services", ["restangular"])
      .service("AnnotationsService", AnnotationsService);
}
