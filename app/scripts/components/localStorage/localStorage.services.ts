module ngApp.components.localStorage.services {
	
	class LocalStorageService implements ILocalStorage {
	
		constructor(private $window: ngApp.core.models.IGDCWindowService,
					private $location: ng.ILocationService){}
					
		private LocalStorageArray_Added: Array<string> = new Array<string>();
		private LocalStorageArray_Removed: Array<string> = new Array<string>();
					
		hasLocalStorage(): boolean {
			return 'localStorage' in this.$window && this.$window['localStorage'] !== null;
		}
		
		cartAddedQuery(obj: string): void {
			if(this.hasLocalStorage()){
				//this.$location.search()['filters']
				var newObj = JSON.parse(obj);
				this.LocalStorageArray_Added.push(newObj);
				this.$window.localStorage.setItem("cartAddedQuery", JSON.stringify(this.LocalStorageArray_Added));
			}
		}
		
		cartRemovedQuery(obj: string): void {
		  //{"op": "is", "content":{"field": "participant_id", "value": __participant_id__}}
		}
	}
	
	angular
      .module("localStorage.services", [])
      .service("LocalStorageService", LocalStorageService);
	
}