module ngApp.components.tables.services {

    import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;
    import TableiciousColumnDefinition = ngApp.components.tables.directives.tableicious.TableiciousColumnDefinition;
    import TableiciousEntryDefinition = ngApp.components.tables.directives.tableicious.TableiciousEntryDefinition;

    export interface ITableService {
        objectWithMatchingIdInArrayIsEnabled (array:any[], id:string) : Boolean
    }


    class TableService implements ITableService {

        /**
         * If, in a given array, there is a member and that member has a property called ID and that property is equal to @id, return true if that member also has a truthy enabled property.
         * @param array
         * The array to search for the enabled member.
         * @param id
         * The ID of the member whose enabled property will be returned.
         * @returns enabled:boolean
         * If the member is enabled or not.
         */
        objectWithMatchingIdInArrayIsEnabled (array:any[], id:string):boolean {
            var column = _.find(array,function(_column:any){
                return _column.id === id;
            });
            return column && column.enabled;
        }

        /**
         * Takes an object that may have another object nested inside it at index @key.
         * If there is, extend the original object with values from that key and return it.
         * @param object
         * An object to be extended if its property at index @key is an object.
         * @param key
         * The index of the object to check for a possible object
         * @returns {Object}
         * The new object with properties (if any) added.
         */
        flattenObjectAtKey(object:Object, key:string):Object {
            return _.extend(object,object[key]);
        }


        /**
         * Takes an object and converts it into an array of objects.
         * Arrays are easier to ng-repeat through than objects.
         *
         * Each object has an ID and a value property.
         * i.e, {a:1,b:2} -> [{id:'a',val:1},{id:'b',val:2}]
         * @param object
         * The object to turn into an array
         * @returns {any[]}
         * The object as an array.
         */
        objectToArray(object:Object):any[] {
            return _.keys(object).map(function(key){
              return {
                id:key,
                val:object[key]
              }
            })
        }

        /**
         * Takes an array of values that are possibly objects and flattens each one with @flattenObjectAtKey.
         * @param array
         * The array containing elements to be flattened.
         * @param key
         * The key where the entries that need expanding are.
         * @returns {any}
         * The flattened array.
         */
        flattenArrayAtKey(array:any[],key:string):any[] {
            return array.map((elem)=>{
                return this.flattenObjectAtKey(elem,key);
            });
        }


        /**
         * Goes through an array of Tableicious column definitions.
         * If any columns are nested in other columns as children, promote those to the top level of the collection.
         * @param headings
         * @returns {any}
         */
        expandHeadings(headings:TableiciousColumnDefinition[]):TableiciousColumnDefinition[]{
            if (!headings) {
                throw new Error("You have not defined any headings.");
            }
            return headings.reduce(function(a,b){
                function addChildrenOfNode(node){
                    a.push(node);
                    if (node.parent) {
                        node.nestingLevel = node.parent.nestingLevel + 1;
                    } else {
                        node.nestingLevel = 0;
                    }

                    if (node.children) {
                        node.children.forEach(function(heading){
                            heading.parent = node;
                            addChildrenOfNode(heading);
                        });
                    }
                }
                if (b) {
                    addChildrenOfNode(b);
                }
                return a;
            },[]).map(function(heading){
                heading.parent = undefined;
                return heading;
            });
        }


        /**
         * Returns the appropriate width for a heading in columns.
         */
        getHeadingRowSpan(heading:TableiciousColumnDefinition):number {
            return heading.children ? 1 : 2;
        }

        /**
         * Returns the appropriate height for a heading in rows.
         */
        getHeadingColSpan(heading):number {
            return heading.children ? heading.children.length : 1;
        }

        /**
         * Given an array of objects each having a "val" and an "id" property, returns the
         * val of an object whose ID matches `valueId`
         */
        getValueFromRow(row: TableiciousEntryDefinition[],valueId: string): string{
            var tuple  = _.find(row,function(x: any){
                return x.id === valueId;
            });

            return tuple && tuple.val;
        }

        /**
         * Finds a nested value in an array of tuples.
         * @param str
         * The string representing the path into the data.
         * @param row
         * An array representing one entry in a table.
         * @param delimiter
         */
        delimitedStringToValue(str,row:TableiciousEntryDefinition[],delimiter = '.'): string{

            var result = undefined;
            var split = str.split(delimiter);
            var getValueFromRow = this.getValueFromRow;

            split.forEach((pathSeg)=>{
                if (result) {
                    result = result[pathSeg];
                } else {
                    result = getValueFromRow(row, pathSeg);
                }
            });

            return result;

        }


        /**
         * Returns the ultimate text value for an entry in a table based on the heading defintion and the whole row.
         */
        getTemplate(scope, $filter: ng.IFilterService) {
            var result;
            var heading = scope.heading;
            var id = heading.id;
            var row = scope.$parent.datum;
            var field = {
                val: this.getValueFromRow(row, heading.id),
                id: heading.id
            };
            var template = heading.template;

            if (heading.template) {
                try {
                    result = heading.template(field,row,scope, $filter);
                } catch (e) {
                    result = '--';
                }
            } else {
                result = this.delimitedStringToValue(id, row);
            }

            return result;
        }

            /**
         * Returns the ultimate text value for an entry in a table based on the heading defintion and the whole row.
         */
        getIcon(scope, $filter: ng.IFilterService) {
            var heading = scope.heading;
            var row = scope.$parent.datum;
            var field = {
                val: this.getValueFromRow(row, heading.id),
                id: heading.id
            }

            var result;

            var id = heading.id;

            if (heading.icon) {
                try {
                    result = heading.icon(field,row,scope, $filter);
                } catch (e) {
                    result = '--';
                }
            } else {
                result = '--';
            }

            return result;
        }

        /**
         * Given a heading, determines if that heading should be displayed or not.
         * Gets passed $scope since usually you will want a reference to UserService or
         * another service for this function.
         */
        getHeadingEnabled(heading:TableiciousColumnDefinition,$scope){
            if (_.isFunction(heading.enabled)){
                return heading.enabled($scope);
            } else {
                return true;
            }
        }

        getSref(scope, $filter) {
            var heading = scope.heading;
            var row = scope.$parent.datum;
            var field = {
                val: this.getValueFromRow(row, heading.id),
                id: heading.id
            }

            var result = undefined;

            try {
                result = heading.sref ? heading.sref(field,row,scope,$filter) : field.val;
                if (result.filters) {
                    result = result.state + "?filters=" + angular.fromJson(result.filters);
                } else {
                    result = result.state;
                }
            } catch (e) {
                result = '--';
            }

            return result;
        }

        getFieldClass(elem,row,scope,heading){
            if (heading.fieldClass){
                if (_.isFunction(heading.fieldClass)){
                    return heading.fieldClass(elem,row,scope);
                } else {
                    return heading.fieldClass;
                }
            }
        }

        getHeadingClass(heading){
            if (heading.headingClass){
                if (_.isFunction(heading.headingClass)){
                    return heading.headingClass();
                } else {
                    return heading.headingClass;
                }
            }
        }


    }

angular
    .module("tables.services",[])
    .service("TableService", TableService);
}
