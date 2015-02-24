module ngApp.components.header.controllers {

  import ICartService = ngApp.cart.services.ICartService;
  import ICoreService = ngApp.core.services.ICoreService;
  import IUserService = ngApp.components.user.services.IUserService;

  export interface IHeaderController {
    isCollapsed: boolean;
    toggleCollapsed(): void;
    collapse(event: any): void;
    currentLang: string;
    languages: any;
    addedLanguages: boolean;
    setLanguage(): void;
    getNumCartItems(): number;
    logout(): void;
    loginQuery: string;
  }

  class HeaderController implements IHeaderController {
    isCollapsed: boolean = true;
    currentLang: string = "en";
    loginQuery: string = "";
    addedLanguages: boolean = false;
    languages: any = {
      "en": "English",
      "fr": "French",
      "es": "Spanish"
    };

    /* @ngInject */
    constructor(private gettextCatalog, private CartService: ICartService,
                private $state: ng.ui.IStateService,
                private UserService: IUserService, private $modal: any,
                private $window: ng.IWindowService) {
      this.addedLanguages = !!_.keys(gettextCatalog.strings).length;

      if ($window.location.port) {
        this.loginQuery = "?next=:" + $window.location.port;
      }
    }

    logout(): void {
      this.UserService.logout();
      this.$window.location.reload();
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
      return this.CartService.getFiles().length;
    }

  }

  angular
      .module("header.controller", ["cart.services", "user.services"])
      .controller("HeaderController", HeaderController);
}
