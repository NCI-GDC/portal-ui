module ngApp.core.controllers {

  export interface ICoreController {
  }

  class CoreController implements ICoreController {
  }

  angular
      .module("core.controller", [])
      .controller("CoreController", CoreController);
}
