module ngApp.components.tables.directives.tableicious {
    interface ITableicousScope extends ng.IScope {
        data:any[];
        dataAsKeyValuePairs:any[];
        config:TableiciousConfig;
        expandedHeadings:TableiciousColumnDefinition[];
        order:string[];
        allHeadings:any[];
        TableService;
        draggableHeadings:any[];
        root:IRootScope;
        models:any;
        $filter:ng.IFilterProvider;
        getColumnIndex(arg:any):number;
        expandNestedData(nestedData:any):any;
        getHeadingColSpan(heading):number;
        getHeadingRowSpan(heading):number;
        getAllHeadingsAtNestingLevel(level):any[];

        getHeadingById(id:string):TableiciousColumnDefinition
        createOrderArray()
        getDataAtRow (heading:TableiciousColumnDefinition,index:number) : TableiciousEntryDefinition;
    }

    export class TableiciousConfig {
        /**
         * @title The name that appears at the top of the table.
         */
        title:string;

        /**
         * @order An array of strings that configures the left to
         * right order of the columns in the table. Each string is the id of a column.
         */
        order:string[];

        /**
         * @headings An array of TableiciousColumnDefinitions which defines the behavior of the columns;
         */
        headings:TableiciousColumnDefinition[];
    }

    export class TableiciousEntryDefinition {
        id:string;
        val:any;
    }

    export interface TableiciousColumnDefinition {
        /**
         * @displayname The name that appears at the top of a column;
         */
        displayName:string;

        /**
         * @id A unique string that will identify this column.
         */
        id:string;

        /**
         * @enabled Determines if the column is displayed. If false, the whole column is hidden.
         */
        enabled:boolean;

        /**
         * @children
         * If defined, creates nested subcolumns based on child definitions. Parent becomes an
         * abstract column with no data.
         */
        children?:TableiciousColumnDefinition[];

        /**
         * Defines how deeply a column is nested.
         */
        nestingLevel?:number;

        /**
        * @template
        * If template is defined, the contents of a table cell will be the result of passing the object
        * that defines it to the template function.
        */
        template?(field:TableiciousEntryDefinition, row:TableiciousEntryDefinition[],scope:ITableicousScope) :string

        /**
         * @sref(field:TableiciousEntryDefinition):string
         * If defined, wraps the text in a UI sref linking to the string returned by this function.
         */
        sref?(field:TableiciousEntryDefinition, row:TableiciousEntryDefinition[],scope:ITableicousScope):string

        /**
         * If defined, an icon will be displayed where that icon is "fa-<return-val>" from the function
         */
        icon?(field:TableiciousEntryDefinition, row:TableiciousEntryDefinition[],scope:ITableicousScope) : string
    }

    class TableiciousController {

        /* @ngInject */
        constructor(private $scope: ITableicousScope, private TableService, private $rootScope,$filter) {

            $scope.getColumnIndex = this.getColumnIndex.bind(this);
            $scope.getHeadingRowSpan = this.getHeadingRowSpan.bind(this);
            $scope.getHeadingColSpan = this.getHeadingColSpan.bind(this);
            $scope.getAllHeadingsAtNestingLevel = this.getAllHeadingsAtNestingLevel.bind(this);
            $scope.getDataAtRow = this.getDataAtRow.bind(this);
            $scope.models = {};
            $scope.root = $rootScope;
            $scope.$filter = $filter;

            $scope.$watch('data',()=>{
                $scope.dataAsKeyValuePairs = undefined;
                _.defer(()=>{
                    this.refresh();
                })
            },true);

            $scope.$watch(()=>{
                return $scope.draggableHeadings && $scope.draggableHeadings.map(function(head){
                    return head.displayName;
                })
            },()=>{
                $scope.order = this.createOrderArray($scope.draggableHeadings);
            },true);

            $scope.getTemplate = function(heading,field,row,_scope) {
                var result = undefined;
                try {
                    result = heading.template ? heading.template(field,row,_scope) : field.val;
                } catch (e) {
                    result = '?';
                }

                return result;
            }

            this.refresh.bind(this)();

        }

        /**
         * Function that runs every time the data is updated.
         * Outputs errors to the console if it detects anything is not configured properly.
         * Finally, converts the data from an array of objects to an array of arrays of tuples just a single time
         * and calculates headings..
         */
        refresh() {

            var $scope = this.$scope;
            var data = $scope.data;

            this.TableService.validateConfigData($scope.config,data);
            $scope.allHeadings = this.TableService.expandHeadings($scope.config.headings);

            $scope.order = this.createOrderArray();

            if (!this.TableService.validateOrderObject($scope.order,$scope.allHeadings)){
                return;
            }

            if (!this.TableService.dataIsCongruent(data)) {
                return;
            }

            $scope.dataAsKeyValuePairs = data.map(this.TableService.objectToArray);

            $scope.expandedHeadings = $scope.allHeadings.filter(function(heading){
                return !heading.children;
            });

            $scope.draggableHeadings = $scope.allHeadings.filter(function(heading){
                return heading.nestingLevel === 0;
            });

            _.defer(()=>{
                $scope.$apply();
            })
        }



        createOrderArray(headings = null):string[] {
            var orderedHeadings = headings || this.$scope.allHeadings;
            var orderArray:any = orderedHeadings.reduce(function(a:TableiciousColumnDefinition[],b:TableiciousColumnDefinition){
                var node:any = b || {};
                a.push(node.id);
                if (node.children) {
                    node.children.forEach(function(child){
                        a.push(child.id);
                    });
                }

                return a;
            },[]);

            return orderArray;
        }


        /**
         * Returns the index of the column based on the order array of the controller's scope.
         * @param column : TableiciousColumnDefinition
         * The column whose index you want to find.
         * @returns : number
         * The index of the column (from 0 - n)
         */
        getColumnIndex(column:TableiciousColumnDefinition):number{
            return this.$scope.order && this.$scope.order.indexOf(column.id);
        }



        getHeadingRowSpan(heading):number {
            return heading.children ? 1 : 2;
        }

        getHeadingColSpan(heading):number {
            return heading.children ? heading.children.length : 1;
        }

        getAllHeadingsAtNestingLevel(level):TableiciousColumnDefinition[] {

            var headingsAtLevel = this.$scope.allHeadings.filter(function(heading){
                return heading.nestingLevel === level;
            });

            return headingsAtLevel;
        }

        /**
         * Returns the column definition of a particular heading when provided only that heading's id.
         * @param id
         * The id of the heading to be retrieved.
         * @returns {TableiciousColumnDefinition|T}
         * The heading, if any, with the same id as the one provided.
         */
        getHeadingById(id:string):TableiciousColumnDefinition {
            return _.find(this.$scope.allHeadings,function(head){
                return head.id === id;
            });
        }

        /**
         * Gets the value for the column at the specified row index.
         *
         * @param heading
         * The column for which you want the data.
         *
         * @param index
         * The row of the data.
         *
         * @returns {TableiciousEntryDefinition|T|ngApp.components.tables.directives.tableicious.TableiciousEntryDefinition}
         * The data or a blank object.
         */
        getDataAtRow (heading:TableiciousColumnDefinition,index:number) : TableiciousEntryDefinition{
            //debugger;
            var row = this.$scope.dataAsKeyValuePairs[index];

            return _.find(row,function(datum:TableiciousEntryDefinition){
                return datum.id === heading.id;
            }) || new TableiciousEntryDefinition();
        }
    }

    function arrayToObject(array){
        var obj = {};
        array.forEach(function(elem){
            obj[elem.id] = elem.val;
        })
        return obj;
    }


    function Tableicious(): ng.IDirective {
        return {
            restrict: "E",
            scope: {
                data: "=",
                config: "=",
                paging: "="
            },
            replace: true,
            templateUrl: "components/tables/templates/tableicious.html",
            controller: "TableiciousController"

        }
    }

    function tableiciousCell(){
        return {
            restrict:"AE",
            link: function(scope, element){
                scope.$elem = element;
            },
            controller:function($scope, $element,$compile){

                if ($scope.heading.id === 'add_to_cart') {
                    $scope.arrayRow = arrayToObject($scope.row);
                    var htm = '<div add-to-cart-single file="arrayRow"></div>';
                    var compiled = $compile(htm)($scope);
                    $element.append(compiled);
                }

                if ($scope.heading.id === 'add_to_cart_filtered') {
                    $scope.arrayRow = arrayToObject($scope.row);
                    var files = _.find($scope.row,function(elem){
                        return elem.id === 'files';
                    });

                    $scope.files = files.val;
                    var htm = '<div add-to-cart-filtered files="files" row="row"></div>';
                    var compiled = $compile(htm)($scope);
                    $element.append(compiled);
                }

            }
        }
    }

    function tableiciousHeader() {
        return {
            restrict:"AE",
            scope:{
                heading:'=',
                data:'='
            },
            controller:function($scope, $element,$compile){

                if ($scope.heading && $scope.heading.id === 'add_to_cart') {
                    //debugger;

                    _.defer(function(){

                        var htm = '<div add-to-cart-all files="data"></div>';
                        var compiled = $compile(htm)($scope);
                        $element.html(compiled);
                    })
                }

            }
        }
    }



    angular.module("tablicious.directive",['dndLists'])
        .directive("tableicious", Tableicious)
        .controller("TableiciousController",TableiciousController)
        .directive("tableiciousCell",tableiciousCell)
        .directive("tableiciousHeader",tableiciousHeader)
}
