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
    shouldShowOption(option: string): boolean;
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
                private UserService: IUserService, private $uibModal: any,
                private $window: ng.IWindowService) {
      this.addedLanguages = !!_.keys(gettextCatalog.strings).length;
      this.cookieEnabled = navigator.cookieEnabled;
    }

    getToken(): void {
      this.UserService.getToken();
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

    shouldShowOption(option: string): boolean {
      var showOption = true,
          currentState = _.get(this.$state, 'current.name', '').toLowerCase();

      switch(option.toLowerCase()) {
        case 'quick-search':
          if (currentState === 'home') {
            showOption = false;
          }
          break;
        case 'my-projects':
          if (currentState === 'home') {
            showOption = false;
          }
          break;
        default:
          break;
      }

      return showOption;
    }

  }

  angular
      .module("header.controller", ["cart.services", "user.services"])
      .controller("HeaderController", HeaderController);
}
