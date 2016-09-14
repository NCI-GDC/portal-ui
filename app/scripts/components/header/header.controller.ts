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
    bannerDismissed: boolean;
  }

  class HeaderController implements IHeaderController {
    bannerDismissed: boolean;
    isCollapsed: boolean = true;
    currentLang: string = "en";
    addedLanguages: boolean = false;
    languages: any = {
      "en": "English",
      "fr": "French",
      "es": "Spanish"
    };
    notifications: Array<Object> = [];

    /* @ngInject */
    constructor(
      private gettextCatalog,
      private CartService: ICartService,
      private $state: ng.ui.IStateService,
      private UserService: IUserService,
      private $uibModal: any,
      private $window: ng.IWindowService,
      private $rootScope,
      private $uibModalStack,
      private Restangular: restangular.IService
    ) {
      this.addedLanguages = !!_.keys(gettextCatalog.strings).length;
      this.cookieEnabled = navigator.cookieEnabled;
      this.bannerDismissed = false;
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

    shouldShowOption(option: string): boolean {
      var showOption = true,
          currentState = _.get(this.$state, 'current.name', '').toLowerCase();

      switch(option.toLowerCase()) {
        case 'quick-search':
          if (currentState === 'home') {
            showOption = false;
          }
          break;
        default:
          break;
      }

      return showOption;
    }

    dismissBanner() {
      this.bannerDismissed = true;
      this.$rootScope.$emit('hideBanner');
    }

    showBannerModal() {
      if (!this.$uibModalStack.getTop()) {
        this.$uibModal.open({
          templateUrl: "core/templates/modal.html",
          controller: "WarningController",
          controllerAs: "wc",
          backdrop: "static",
          keyboard: false,
          backdropClass: "warning-backdrop",
          animation: false,
          size: "lg",
          windowClass: "banner-modal",
          resolve: {
            warning: () => `
              <div>
                <h2 class="banner-title">
                  Can't find your data?
                  <span class="banner-title-link">
                    You may be looking for the
                    <a href="https://gdc-portal.nci.nih.gov/legacy-archive/search/f" target="_blank">GDC Legacy Archive</a>.
                  </span>
                </h2>
                <div>
                  Data in the GDC Data Portal
                  has been harmonized using GDC Bioinformatics Pipelines whereas data in the
                  GDC Legacy Archive is an unmodified copy of data that was previously stored
                  in CGHub and in the TCGA Data Portal hosted by the TCGA Data Coordinating Center (DCC).
                  Certain previously available data types and formats are not currently supported by
                  the GDC Data Portal and are only distributed via the GDC Legacy Archive.
                  <br>
                  <br>
                  Check the <a href="https://gdc-docs.nci.nih.gov/Data/Release_Notes/Data_Release_Notes/" target="_blank">Data Release Notes</a> for additional details.
                </div>
              </div>
            `,
            header: null
          }
        });
      }
    }

  }

  angular
      .module("header.controller", ["cart.services", "user.services"])
      .controller("HeaderController", HeaderController);
}
