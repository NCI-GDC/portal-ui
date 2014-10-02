/* @ngInject */
function exceptionDecorator($provide: ng.auto.IProvideService) {
  $provide.decorator("$exceptionHandler",
     /* @ngInject */
    ($delegate, $log) => {
      return function(exception: string, cause: string) {
        // TODO: do whatever you want with errors
        $log.debug("ERROR:" + exception);
        $delegate(exception, cause);
      };
    }
  );
}

angular
    .module("ngApp")
    .config(exceptionDecorator);

