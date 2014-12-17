module ngApp.components.user.controllers {

  interface ILoginController {
    username: string;
    ok(): void;
    cancel(): void;
  }

  class LoginController implements ILoginController {
    username: string = "";

    /* @ngInject */
    constructor(private $modalInstance) {}

    ok(): void {
      this.$modalInstance.close({
        username: this.username
      });
    }

    cancel(): void {
      this.$modalInstance.dismiss("cancel");
    }
  }

  angular.module("user.controllers", [])
      .controller("LoginController", LoginController);
}

