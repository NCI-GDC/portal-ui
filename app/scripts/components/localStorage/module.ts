module ngApp.components.localStorage {
	
	export interface ILocalStorage {
		addToStorage(jsonObj: string): void;
		removeFromStorage(jsonObj: string): void;
	}

	angular.module("components.localStorage", [
    	"localStorage.services"
  	]);
}



  
