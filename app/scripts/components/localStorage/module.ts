module ngApp.components.localStorage {
	
	export interface ILocalStorage {
		cartAddedQuery(jsonObj: string): void;
		cartRemovedQuery(uuid: string): void;
		cartAddedFiles(fileId: string): void;
		cartRemovedFiles(fileId: string): void;
		
	}

	angular.module("components.localStorage", [
    	"localStorage.services"
  	]);
}



  
