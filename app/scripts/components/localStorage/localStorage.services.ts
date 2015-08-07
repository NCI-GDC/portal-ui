module ngApp.components.localStorage.services {
	
	class LocalStorageService implements ILocalStorage {
	
		constructor(private $window: ngApp.core.models.IGDCWindowService,
					private $location: ng.ILocationService){}
					
		private LocalStorageArray_Added: Array<string> = new Array<string>();
		private LocalStorageArray_Removed: Array<any> = new Array<any>();
		private cartAddedUUIDs: Array<string> = new Array<string>();
		private cartRemovedUUIDs: Array<string> = new Array<string>();
					
		hasLocalStorage(): boolean {
			return 'localStorage' in this.$window && this.$window['localStorage'] !== null;
		}
		
		cartAddedQuery(obj: string): void {
			if(this.hasLocalStorage()){
				var tmp = JSON.parse(obj);
				//this.LocalStorageArray_Added.push("");
				var newObj = {"op": "OR", content: tmp.content[0].content.value};
				this.$window.localStorage.removeItem("cartAddedQuery");
				this.$window.localStorage.setItem("cartAddedQuery", JSON.stringify(newObj));
			}
		}
		
		cartRemovedQuery(uuid: string): void {
		  
		  if(this.hasLocalStorage()){
				var newObj = {"op": "is", "content":{"field": "participant_id", "value": uuid}};
				this.LocalStorageArray_Removed.push(newObj);
				var filter = {"op": "OR", content: this.LocalStorageArray_Removed};
				this.$window.localStorage.setItem("cartRemovedQuery", JSON.stringify(filter));
			}
		}
		
		cartAddedFiles(uuid: string): void{
			this.cartAddedUUIDs.push(uuid);
			this.$window.localStorage.removeItem("cartAddedFiles");
			this.$window.localStorage.setItem("cartAddedFiles", JSON.stringify(this.cartAddedUUIDs));
		}
		cartRemovedFiles(uuid: string): void{
			this.cartRemovedUUIDs.push(uuid);
			this.$window.localStorage.removeItem("cartRemovedFiles");
			this.$window.localStorage.setItem("cartRemovedFiles", JSON.stringify(this.cartRemovedUUIDs));
		}
		
		
		
	}
	
	angular
      .module("localStorage.services", [])
      .service("LocalStorageService", LocalStorageService);
	
}