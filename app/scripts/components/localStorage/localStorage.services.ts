module ngApp.components.localStorage.services {

  class LocalStorageService implements ILocalStorage {

    constructor(private $window: ngApp.core.models.IGDCWindowService,
          private $location: ng.ILocationService) {}

    private LocalStorageArray_Added: Array<any> = new Array<any>();
    private LocalStorageArray_Removed: Array<any> = new Array<any>();
    private cartAddedUUIDs: Array<string> = new Array<string>();
    private cartRemovedUUIDs: Array<string> = new Array<string>();

    hasLocalStorage(): boolean {
      return 'localStorage' in this.$window && this.$window['localStorage'] !== null;
    }

    cartAddedQuery(obj: string): void {
      if(this.hasLocalStorage()) {
        this.$window.localStorage.removeItem("cartAddedQuery");
        //We can used the parsed value if we only
        //want the filters from the array and not the entire
        //json object

        //var tmp = JSON.parse(obj);
        //tmp.content[0].content.value

        //Push the current filter to the content list
        //this.LocalStorageArray_Added.push();
        var newObj = {"op": "OR", content: [JSON.parse(obj)]};

        this.$window.localStorage.setItem("cartAddedQuery", JSON.stringify(newObj));
      }
    }

    cartRemovedQuery(uuid: string): void {
      if(this.hasLocalStorage()) {
        this.$window.localStorage.removeItem("cartRemovedQuery");

        var contentList = {"op": "is", "content":{"field": "participant_id", "value": uuid}};
        this.LocalStorageArray_Removed.push(contentList);
        var filter = {"op": "OR", content: this.LocalStorageArray_Removed};
        this.$window.localStorage.setItem("cartRemovedQuery", JSON.stringify(filter));
      }
    }

    cartAddedFiles(uuid: string): void {
      this.cartAddedUUIDs.push(uuid);
      this.$window.localStorage.removeItem("cartAddedFiles");
      this.$window.localStorage.setItem("cartAddedFiles", JSON.stringify(this.cartAddedUUIDs));
    }

    cartRemovedFiles(uuid: string): void {
      this.cartRemovedUUIDs.push(uuid);
      this.$window.localStorage.removeItem("cartRemovedFiles");
      this.$window.localStorage.setItem("cartRemovedFiles", JSON.stringify(this.cartRemovedUUIDs));
    }
  }

  angular
      .module("localStorage.services", [])
      .service("LocalStorageService", LocalStorageService);
}
