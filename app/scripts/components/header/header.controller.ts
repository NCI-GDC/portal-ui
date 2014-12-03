module ngApp.components.header.controllers {

  import ICartService = ngApp.cart.services.ICartService;

  export interface IHeaderController {
    isCollapsed: boolean;
    toggleCollapsed(): void;
    collapse(event: any): void;
    currentLang: string;
    languages: any;
    addedLanguages: boolean;
    setLanguage(): void;
    getNumCartItems(): number;
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
    constructor(private gettextCatalog, private CartService: ICartService) {
      this.addedLanguages = !!_.keys(gettextCatalog.strings).length;
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
      .module("header.controller", ["cart.services"])
      .controller("HeaderController", HeaderController);
}
