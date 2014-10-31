module ngApp.cart.controllers {
  import ICartService = ngApp.cart.services.ICartService;
  import IFiles = ngApp.files.models.IFiles;
  import IFile = ngApp.files.models.IFile;
  import ICoreService = ngApp.core.services.ICoreService;

  export interface ICartController {
    files: IFiles;
    totalSize: number;
  }

  class CartController implements ICartController {
    totalSize: number = 0;

    /* @ngInject */
    constructor(public files: IFiles, private CoreService: ICoreService, private CartService: ICartService) {
      CoreService.setPageTitle("Cart " + "(" + this.files.hits.length + ")");
      // TODO remove when Search is hooked up to CartService
      this.CartService.add({
        uuid: "uuid",
        id: "id",
        filename: "filename",
        files: [],
        metadata: {},
        metadataXML: {},
        barcode: "barcode",
        format: "format",
        checksum: "checksum",
        published: "published",
        uploaded: "uploaded",
        modified: "modified",
        size: 1,
        state: "state",
        access: true,
        participants: [],
        dataType: "dataType",
        dataSubType: "dataSubType",
        experimentStrategy: "experimentStrategy",
        programStatus: true,
        platform: "platform",
        revision: "revision",
        version: "version",
        level: 1,
        submitter: "submitter",
        submittedSince: "submittedSince",
        url: "url"
      });
      this.totalSize = this.getTotalSize();
    }

    getTotalSize(): number {
      return _.reduce(this.files.hits, function (sum, hit) {
        return sum + hit.size;
      }, 0);
    }

    // click handlers
    handleRemoveAllClick(): void {
      this.CartService.removeAll();
    }
  }

  angular
      .module("cart.controller", ["cart.services", "core.services"])
      .controller("CartController", CartController);
}

