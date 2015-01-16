module ngApp.components.tables.services {

    import TableiciousConfig = ngApp.components.tables.directives.tableicious.TableiciousConfig;
    import TableiciousColumnDefinition = ngApp.components.tables.directives.tableicious.TableiciousColumnDefinition;

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

            if (object.hasOwnProperty(key)) {
                var subTree = object[key];

                for (var _key in subTree) {

                    object[_key] = subTree[_key];
                }
            } else {
                throw new Error("Can't flatten object at key" + key +  ". Object " + object +  " has no property with name " + key);
            }

            return object;
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
            var arrayFormatObject:any[] = [];
            for (var key in object) {
                arrayFormatObject.push({
                    id:key,
                    val:object[key]
                })
            };

            return arrayFormatObject;
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
         * Returns true if the array passed is an array of objects, and every object has the same structure.
         * @param data
         * @returns {boolean}
         */
        dataIsCongruent(data) {
            var firstHeadings = _.keys(data[0]);

            return data.every(function(datum){
                if (_.isEqual(firstHeadings, _.keys(datum))) {
                    return true;
                } else {
                    //console.warn("Warnning - some data in this set does not have the same structure: ",firstHeadings , "is not congruent with ", _.keys(datum));
                    return true;
                }
            })
        }

        /**
         * Function that outputs warnings regarding the table configuration to the console.
         * @param config
         * The table configuration.
         * @param data
         * The data that will be used.
         */
        validateConfigData(config:TableiciousConfig,data:any[]):void {

            var headingsDefinedByConfig = _.pluck(config.headings,'id');
            var headingsDefinedByData = _.keys(data[0]);

            headingsDefinedByData.forEach(function(heading){
                if (!_.contains(headingsDefinedByConfig,heading)) {
                    //console.error('Error generating table, data contains field for which no heading definition found in config: ',heading, '. This entry will be ignored.');
                }
            });

            headingsDefinedByConfig.forEach(function(heading){
                if (!_.contains(headingsDefinedByData,heading)) {
                    //console.warn('Config contains definition for entry not found in data: ',heading, '. This field will be blank.');
                }
            });
        }

        /**
         * Outputs a warning to the console if the order array will not function correctly.
         * @param orderArray
         * @param config
         */

        validateOrderObject(orderArray:string[],headings:TableiciousColumnDefinition[]){
            return headings.every(function(heading:TableiciousColumnDefinition){
                if (_.contains(orderArray,heading.id)) {
                    return true;
                } else {
                    //console.error("No order specified for heading: ",heading.id);
                }

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
                    a.push(node)
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
                addChildrenOfNode(b);
                return a;
            },[]).map(function(heading){
                heading.parent = undefined;
                return heading;
            });
        }


    }

angular
    .module("tables.services",[])
    .service("TableService", TableService);
}
