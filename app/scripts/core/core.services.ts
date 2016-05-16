module ngApp.core.services {

  export interface ICoreService {
    setPageTitle(title: string, id?: string): void;
    setLoadedState(state: boolean): void;
    setSearchModelState(state: boolean): void;
    xhrSent(): void;
    xhrDone(): void;
    activeRequests: boolean;
    finishedRequests: number;
    requestCount: number;
  }

  class CoreService implements ICoreService {
    activeRequests: boolean = false;
    finishedRequests: number = 0;
    requestCount: number = 0;

    /* @ngInject */
    constructor(private $rootScope: ngApp.IRootScope,
                private $state: ng.ui.IStateService,
                private ngProgressLite: ng.progressLite.INgProgressLite,
                private gettextCatalog) {
      this.setLoadedState(true);
    }

    setLoadedState(state: boolean) {
      var wrapper = angular.element(document.getElementById("wrapper"));
      var flippedState = !state;

      wrapper.attr("aria-busy", flippedState.toString());
      this.$rootScope.loaded = state;
    }

    setPageTitle(title: string, id?: string): void {
      // TODO - this could probably be done when the function is called
      var formattedTitle: string = this.gettextCatalog.getString(title);
      formattedTitle = id ? formattedTitle + " - " + id : formattedTitle;
      this.$rootScope.pageTitle = formattedTitle;
    }

    xhrSent() {
      if (!this.activeRequests) {
        this.activeRequests = true;
        this.ngProgressLite.start();
      }
      this.requestCount++;
    }

    xhrDone() {
      this.finishedRequests++;
      if (this.finishedRequests === this.requestCount) {
        this.activeRequests = false;
        this.finishedRequests = 0;
        this.requestCount = 0;
        this.ngProgressLite.done();
      }
    }

    setSearchModelState(state: boolean): void {
      this.$rootScope.modelLoaded = state;
    }

  }

  export interface ILocalStorageService {
    removeItem(item: string);
    getItem(item: string, defaultResponse?: any);
    setItem(key: string, item: any);
  }

  class LocalStorageService implements ILocalStorageService {
    /* @ngInject */
    constructor(
      private $window,
      private $uibModal,
      private $uibModalStack,
      private $timeout
    ) {}

    removeItem(item: string) {
      try {
        this.$window.localStorage.removeItem(item);
      } catch (e) {
        console.log(e);
      }
    }

    getItem(item: string, defaultResponse?: any) {
      var result;
      try {
        try {
          result = JSON.parse(this.$window.localStorage.getItem(item)) || defaultResponse || {};
        } catch (e) {
          result = this.$window.localStorage.getItem(item) || defaultResponse || {};
        }
      } catch (e) {
        console.log(e);
        result = defaultResponse || {};
      }
      return result;
    }

    setItem(key: string, item: any) {
      var success = true;
      try {
        // always stringify so can always parse
        this.$window.localStorage.setItem(key, JSON.stringify(item));
      } catch (e) {
        console.log(e);

        success = false;

        if (key !== 'gdc-facet-config') {
          this.$timeout(() => {
            if (!this.$uibModalStack.getTop()) {
              var modalInstance = this.$uibModal.open({
                templateUrl: "core/templates/enable-cookies.html",
                controller: "WarningController",
                controllerAs: "wc",
                backdrop: "static",
                keyboard: false,
                backdropClass: "warning-backdrop",
                animation: false,
                resolve: { warning: null }
              });
            }
          });
        }
      }

      return success;
    }
  }

  var dataNames = [
    'Raw sequencing data',
    'Gene expression',
    'Simple nucleotide variation',
    'Copy number variation',
    'Structural rearrangement',
    'DNA methylation',
    'Clinical',
    'Biospecimen'
  ];

  var expNames = [
    "Genotyping Array",
    "Gene Expression Array",
    "Exon Array",
    "miRNA Expression Array",
    "Methylation Array",
    "CGH Array",
    "MSI-Mono-Dinucleotide Assay",
    "WGS",
    "WGA",
    "WXS",
    "RNA-Seq",
    "miRNA-Seq",
    "ncRNA-Seq",
    "WCS",
    "CLONE",
    "POOLCLONE",
    "AMPLICON",
    "CLONEEND",
    "FINISHING",
    "ChIP-Seq",
    "MNase-Seq",
    "DNase-Hypersensitivity",
    "Bisulfite-Seq",
    "EST",
    "FL-cDNA",
    "CTS",
    "MRE-Seq",
    "MeDIP-Seq",
    "MBD-Seq",
    "Tn-Seq",
    "FAIRE-seq",
    "SELEX",
    "RIP-Seq",
    "ChIA-PET",
    "DNA-Seq",
    "Total RNA-Seq",
    "VALIDATION",
    "OTHER"
  ];

  angular
      .module("core.services", [ "gettext", "ui.bootstrap" ])
      .value("DataCategoryNames", dataNames)
      .value("ExperimentalStrategyNames", expNames)
      .service("CoreService", CoreService)
      .service("LocalStorageService", LocalStorageService);
}
