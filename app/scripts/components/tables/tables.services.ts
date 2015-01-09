module ngApp.components.tables.services {

    export interface ITableService {
        objectWithMatchingIdInArrayIsEnabled (array:any[], id:string) : Boolean
    }

    class TableService implements ITableService {

        objectWithMatchingIdInArrayIsEnabled (array:any[], id:string) : Boolean {
            var column = _.find(array,function(_column:any){
                return _column.id === id;
            });
            return column && column.enabled;
        }
    }

angular
    .module("tables.services",[])
    .service("TableService", TableService);
}
