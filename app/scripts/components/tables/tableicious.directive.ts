module ngApp.components.tables.directives.tableicious {
    import IUserService = ngApp.components.user.services.IUserService;
    import ITableService = ngApp.components.tables.services.ITableService;

    export interface ITableicousScope extends ng.IScope {
        data:any[];
        dataAsKeyValuePairs:any[];
        config:TableiciousConfig;
        expandedHeadings:TableiciousColumnDefinition[];
        order:string[];
        allHeadings:any[];
        TableService:ITableService;
        UserService: IUserService;

        $filter(name:string):any;
        getColumnIndex(arg:any):number;
        getHeadingColSpan(heading):number;
        getHeadingRowSpan(heading):number;
        getAllHeadingsAtNestingLevel(level):any[];
        getTemplate(heading,field,row,_scope, $filter: ng.IFilterService):string;
        getToolTipText(heading):string;
        getHeadingEnabled(heading):boolean;
        getHeadingById(id:string):TableiciousColumnDefinition
        getHeadingClass(heading):string;
        getFieldClass(elem,row,scope,heading):string;
        createOrderArray();
        getDataAtRow (heading:TableiciousColumnDefinition,index:number) : TableiciousEntryDefinition;
        getSref();
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

        /**
         * @fields An array of field names that will be used to populate the table
         */
        fields:string[];

        /**
        * @expand: Fields to expand
        */
        expand:string[];
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
         * @headingToolTipText appears in a tooltip above child headings
         */
        headingToolTipText: string;

        /**
         * @toolTipText appears in a tooltip in table cell
         */
        toolTipText?(field:TableiciousEntryDefinition):string

        /**
         * @id A unique string that will identify this column.
         */
        id:string;

        /**
         * @enabled(scope).
         * If defined, a function which determines if the column appears at all.
         * Return either true or false, given a reference to the scope of the table it is on.
         * This overrides "visible"
         */
        enabled?(scope:ng.IScope):boolean;

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
        sref?(field:TableiciousEntryDefinition, row:TableiciousEntryDefinition[],scope:ITableicousScope,$filter: ng.IFilterService):string

        /**
         * If defined, an icon will be displayed where that icon is "fa-<return-val>" from the function
         */
        icon?(field:TableiciousEntryDefinition, row:TableiciousEntryDefinition[],scope:ITableicousScope) : string

        /**
         * A class or space-delimited list of classes to be applied only to the heading of the column.
         * Or, a function that returns the above.
         */
        headingClass?: any;

        /**
         * A string representing a class or space-delimited list of classes to apply to every
         * Or a function that returns the above, given the field itself as the first argument, and the row as the second.
         */

        fieldClass?: any;

        /**
         * If true, the heading won't have the displayname automatically inserted.
         */
        noTitle?: boolean;

        /**
         * If defined, the string that is returned by
         * this will be compiled into a directive and inserted into each cell of the column.
         */
        compile?(scope):string;

        /**
         * Like compile, but for the head.
         * If defined, the string that is returned by
         * this will be compiled into a directive and inserted in the head of the column.
         */
        compileHead?(scope):string;

        /**
         * Does this heading show up in the sort/hide directive?
         * Defaults to true if undefined;
         */
        canReorder?:boolean;

        /**
         * Determines if the header is hidden by default. If so, it will need to be unhidden in the menu to be displayed.
         * Use for the show / hide column directive.
         * Defaults to false if undefined;
         */
        hidden? : boolean;

        /**
         * Does this heading appear in the sort-ascending/descending plugin?
         * Defaults to false if undefined;
         */

        sortable? : boolean;

    }

    class TableiciousController {

        /* @ngInject */
        constructor(private $scope: ITableicousScope,
                    private TableService: ITableService,
                    $filter: ng.IFilterService,
                    private UserService: IUserService) {

            $scope.getColumnIndex = this.getColumnIndex.bind(this);
            $scope.getAllHeadingsAtNestingLevel = this.getAllHeadingsAtNestingLevel.bind(this);
            $scope.getDataAtRow = this.getDataAtRow.bind(this);
            $scope.getHeadingColSpan = TableService.getHeadingColSpan.bind($scope);
            $scope.getHeadingRowSpan = TableService.getHeadingRowSpan.bind($scope);
            $scope.getTemplate = TableService.getTemplate.bind(TableService);
            $scope.getToolTipText = TableService.getToolTipText.bind(TableService);
            $scope.getIcon = TableService.getIcon.bind(TableService);
            $scope.getHeadingEnabled = TableService.getHeadingEnabled.bind($scope);
            $scope.getSref = TableService.getSref.bind(TableService);
            $scope.getHeadingClass = TableService.getHeadingClass.bind($scope);
            $scope.getFieldClass = TableService.getFieldClass.bind($scope);

            $scope.$filter = $filter;
            $scope.UserService = UserService;

            $scope.$watch('data',()=>{
                this.refresh();
            },true);

            $scope.$watch(()=>{
                return $scope.config.headings.map(function(head){
                    if (head) {
                        return head.displayName;
                    }
                })
            },()=>{
                $scope.order = this.createOrderArray($scope.config.headings);
                refresh();
            },true);

            $scope.$watch(()=>{
                return $scope.config.headings.map(function(head:TableiciousColumnDefinition){
                    if (head) {
                        return head.hidden;
                    }
                })
            },()=>{
                refresh();
            },true);
            var refresh = _.throttle(()=>{this.refresh()},250)
        }

        /**
         * Function that runs every time the data is updated.
         * Finally, converts the data from an array of objects to an array of arrays of tuples just a single time
         * and calculates headings.
         */
        refresh() {
            // TODO - use ServiceWorker for this?

            var $scope = this.$scope;

            var data = $scope.data;

            $scope.allHeadings = this.TableService.expandHeadings($scope.config.headings);

            $scope.order = this.createOrderArray();

            $scope.expandedHeadings = $scope.allHeadings.filter(function(heading){
                return !heading.children;
            });


            _.defer(()=>{
                $scope.dataAsKeyValuePairs = data.map(this.TableService.objectToArray);
                $scope.$apply();
            })
        }


        /**
         *
         * @param headings
         * An array of Tableicious column definitions. If none is provided, it will modify the active order being applied by $scope.
         *
         * @returns {any}
         */
        createOrderArray(headings:TableiciousColumnDefinition[] = null):string[] {
            var orderedHeadings = headings || this.$scope.allHeadings;
            return orderedHeadings.reduce(function(a:any[],b:any){
                var node:any = b || {};
                a.push(node.id);
                if (node.children) a.concat(_.pluck(node.children,'id'))
                return a;
            },[]);
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



        getAllHeadingsAtNestingLevel(level):TableiciousColumnDefinition[] {

            return this.$scope.allHeadings.filter(function(heading){
                return heading.nestingLevel === level;
            });
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




    angular.module("tableicious.directive",[
        'dndLists',
        'tables.services',
        'tables.validator',
        'tableicious.directive.head',
        'tableicious.directive.cell',
        'tableicious.directive.row' 
    ])
    .directive("tableicious", Tableicious)
    .controller("TableiciousController",TableiciousController);
}
