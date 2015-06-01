module ngApp.components.tables.directives.tableicious {

    /* @ngInject */
    function Tableicious($filter: ng.IFilterService): ITableicious {
        return {
            restrict: "E",
            scope: {
                rowId: "@",
                data: "=",
                paging: "=",
                headings: "="
            },
            replace: true,
            templateUrl: "components/tables/templates/tableicious.html",
            link: function($scope: ITableiciousScope) {
                $scope.filter = $filter;

                function hasChildren(h: IHeading): boolean {
                    return h.children && h.children.length > 0;
                }
                
                function refresh(hs: IHeading[]): void {
                    $scope.subHeaders = _.flatten<IHeading>(
                    _.pluck(_.filter(hs, (h) => {
                        return hasChildren(h);
                    }), 'children'));
                    $scope.dataCols = _.flatten<IHeading>(
                        _.map(hs, (h: IHeading): IHeading[] | IHeading => {
                            return hasChildren(h) ? h.children : h;
                    }));
                }
                
                $scope.$watchCollection('headings', (n: IHeading[], o: IHeading[]) => {
                   refresh(n); 
                });
                
                refresh($scope.headings);
            }
        }
    }

    interface ITableicious extends ng.IDirective {
        link(scope: ITableiciousScope): void;
    }

    interface ITableiciousScope extends ng.IScope {
        data: any[];
        headings: IHeading[];
        filter: ng.IFilterService;
        subHeaders: IHeading[];
        dataCols: IHeading[];
        rowId: string;
        hasChildren(h: IHeading): boolean;
        refresh(h: IHeading[]): void;
    }

    interface IConfig {
        title: string;
        order: string[];
        rowId: string;
        headings: IHeading[];
        render(row: any): string;
    }
    
    interface IHeading {
        th: string;
        id: string;
        td(row:any, filter: ng.IFilterService): string;
        sortable: boolean;
        hidden: boolean;
        children: IHeading[];
    }

    /* @ngInject */
    function Cell($compile: ng.ICompileService): ICell {
        return {
            restrict: "A",
            scope: {
                cell: "="
            },
            link: function ($scope: ICellScope, element: ng.IAugmentedJQuery) {
                element.html($scope.cell).show();
                $compile(element.contents())($scope);
            }

        }
    }

    interface ICell extends ng.IDirective {
        link(scope: ICellScope, element: ng.IAugmentedJQuery): void;
    }
    
    interface ICellScope extends ng.IScope {
        cell: string;
    }

    angular.module("tableicious.directive", [])
    .directive("tableicious", Tableicious)
    .directive("cell", Cell);
}
