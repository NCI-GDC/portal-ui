/* @ngInject */
function exceptionDecorator($provide: ng.auto.IProvideService) {
  $provide.decorator("$exceptionHandler",
    /* @ngInject */
    ($delegate,
     $injector,
     $log: ng.ILogService,
     $window: ng.IWindowService) => {
      return function (exception: any, cause: string) {
        // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
        function uuid4() {
          return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0,
                v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
          });
        }

        // TODO: do whatever you want with errors
        var post = {
          "event_id": uuid4(),
          "url": $window.location.href,
          "date": +new Date(),
          "exception": {
            "message": exception.message,
            "stack": exception.stack
          },
          "cause": cause
        };

        $log.debug("ERROR", post);
        var Restangular: restangular.IService = $injector.get("Restangular");
        // Restangular.all('errors').post(post);
        $delegate(exception, cause);
      };
    }
  );
}

angular
    .module("ngApp")
    .config(exceptionDecorator);
