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
    login(): void;
    logout(): void;
  }

  class HeaderController implements IHeaderController {
    isCollapsed: boolean = true;
    currentLang: string = "en";
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
                private $cookieStore: ng.cookies.ICookieStoreService,
                private $window: ng.IWindowService) {
      this.addedLanguages = !!_.keys(gettextCatalog.strings).length;
    }

    login(): void {
      this.$cookieStore.put("gdc-token", {
        "username": "kelly",
        "password": "1234",
        "projects": [
            "KIRC",
            "UCEC",
            "STAD"
        ],
        "token": "32r23ef23f13f23g13fdavgrghq423g3g12g3g"
      });
      this.$window.location.reload();
    }

    logout(): void {
      this.$cookieStore.remove("gdc-token");
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
