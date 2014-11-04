module ngApp.components.header.controllers {
  export interface IHeaderController {
    isCollapsed: boolean;
    toggleCollapsed(): void;
    collapse(): void;
    currentLang: string;
    languages: any;
    setLanguage(): void;
  }

  class HeaderController implements IHeaderController {
    isCollapsed: boolean = true;
    currentLang: string = "en";
    languages: any = {
      "en": "English",
      "de": "German",
      "fr": "French"
    };

    /* @ngInject */
    constructor(private gettextCatalog) {
    }

    collapse(): void {
      this.isCollapsed = true;
    }

    toggleCollapsed(): void {
      this.isCollapsed = !this.isCollapsed;
    }

    setLanguage() {
      this.gettextCatalog.setCurrentLanguage(this.currentLang);
    }

  }

  angular
      .module("header.controller", [])
      .controller("HeaderController", HeaderController);
}
