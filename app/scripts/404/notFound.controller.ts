module ngApp.notFound.controllers {
  import ICoreService = ngApp.core.services.ICoreService;

  export interface INotFoundController {
  }

  class NotFoundController implements INotFoundController {
    /* @ngInject */
    constructor(private CoreService: ICoreService) {
      CoreService.setPageTitle("404 - Not Found");
    }
  }

  angular
      .module("notFound.controller", [
        "core.services"
      ])
      .controller("NotFoundController", NotFoundController);
}
