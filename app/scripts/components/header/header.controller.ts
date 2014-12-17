module ngApp.components.header.controllers {

  import ICartService = ngApp.cart.services.ICartService;
  import ICoreService = ngApp.core.services.ICoreService;
  import IUserService = ngApp.components.user.services.IUserService;
  import IUser = ngApp.components.user.models.IUser;

  export interface IHeaderController {
    isCollapsed: boolean;
    toggleCollapsed(): void;
    collapse(event: any): void;
    currentLang: string;
    currentUser: IUser;
    languages: any;
    addedLanguages: boolean;
    setLanguage(): void;
    getNumCartItems(): number;
    login(): void;
    logout(): void;
  }

  class HeaderController implements IHeaderController {
    isCollapsed: boolean = true;
    currentLang: string = "en";
    currentUser: IUser;
    addedLanguages: boolean = false;
    languages: any = {
      "en": "English",
      "fr": "French",
      "es": "Spanish"
    };

    /* @ngInject */
    constructor(private gettextCatalog, private CartService: ICartService,
                private CoreService: ICoreService, private $state: ng.ui.IStateService,
                private UserService: IUserService, private $modal) {
      this.addedLanguages = !!_.keys(gettextCatalog.strings).length;
    }

    login(): void {
      var modalInstance = this.$modal.open({
        templateUrl: "components/user/templates/login.html",
        controller: "LoginController as lc"
      });

      modalInstance.result.then((data) => {
        this.UserService.login(data.username)
          .then((user) => this.currentUser = user);
      });
    }

    logout(): void {
      this.UserService.logout()
        .then((user) => this.currentUser = user);
    }

    collapse(event: any): void {
      if (event.which === 1 || event.which === 13) {
        this.isCollapsed = true;
      }
    }

    toggleCollapsed(): void {
      this.isCollapsed = !this.isCollapsed;
    }

    setLanguage() {
      this.gettextCatalog.setCurrentLanguage(this.currentLang);
    }

    getNumCartItems(): number {
      return this.CartService.getFiles().hits.length;
    }

  }

  angular
      .module("header.controller", ["cart.services", "user.services"])
      .controller("HeaderController", HeaderController);
}
