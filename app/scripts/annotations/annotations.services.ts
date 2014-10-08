module ngApp.annotations.services {
  import IAnnotation = ngApp.annotations.models.IAnnotation;
  import Annotation = ngApp.annotations.models.Annotation;
  import IAnnotations = ngApp.annotations.models.IAnnotations;
  import Annotations = ngApp.annotations.models.Annotations;

  export interface IAnnotationsService {
    getAnnotation(id: string): ng.IPromise<Annotation>;
    getAnnotations(params?: Object): ng.IPromise<Annotations>;
  }

  class AnnotationsService implements IAnnotationsService {
    private ds: restangular.IElement;

    /* @ngInject */
    constructor(Restangular: restangular.IService) {
      this.ds = Restangular.all("annotations");
    }

    getAnnotation(id: string, params: Object = {}): ng.IPromise<Annotation> {
      return this.ds.get(id, params).then(function (response) {
        return new Annotation(response);
      });
    }

    getAnnotations(params: Object = {}): ng.IPromise<Annotations> {
      return this.ds.get("", params).then(function (response) {
        return new Annotations(response);
      });
    }
  }

  angular
      .module("annotations.services", ["annotations.models", "restangular"])
      .service("AnnotationsService", AnnotationsService);
}
