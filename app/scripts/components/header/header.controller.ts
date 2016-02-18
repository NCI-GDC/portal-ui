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
    cartSize: number = 0;

    /* @ngInject */
    constructor(private gettextCatalog, private CartService: ICartService,
                private $scope: ng.IScope,
                private $state: ng.ui.IStateService,
                private UserService: IUserService, private $modal: any,
                private $window: ng.IWindowService) {
      this.addedLanguages = !!_.keys(gettextCatalog.strings).length;

      CartService.getFiles().then((data) => {
        this.cartSize = (data.pagination || {total: 0}).total;
      });

      $scope.$on("gdc-user-reset", () => {
        CartService.getFiles().then((data) => {
          this.cartSize = (data.pagination || {total: 0}).total;
        });
      });

      $scope.$on("undo", () => {
        CartService.getFiles().then((data) => {
          this.cartSize = (data.pagination || {total: 0}).total;
        });
      });

      $scope.$on("cart-update", () => {
        CartService.getFiles().then((data) => {
          this.cartSize = (data.pagination || {total: 0}).total;
        });
      });

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
      return this.cartSize;
    }

  }

  angular
      .module("header.controller", ["cart.services", "user.services"])
      .controller("HeaderController", HeaderController);
}
