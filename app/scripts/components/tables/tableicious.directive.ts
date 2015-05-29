module ngApp.components.tables.directives.tableicious {

    /* @ngInject */
    function Tableicious($filter: ng.IFilterService): ITableicious {
        return {
            restrict: "E",
            scope: {
                data: "=",
                config: "=",
                paging: "="
            },
            replace: true,
            templateUrl: "components/tables/templates/tableicious.html",
            link: function($scope: ITableiciousScope) {
                function hasChildren(h: IHeading): boolean {
                    return !!h.children && !h.hidden;
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
                
                $scope.filter = $filter;
                $scope.$watch('config', (h: IConfig, o: IConfig) => {
                    if (_.isEqual(h, o)) return;
                   refresh(h.headings); 
                }, true);
                
                refresh($scope.config.headings);
            }
        }
    }

    interface ITableicious extends ng.IDirective {
        link(scope: ITableiciousScope): void;
    }

    interface ITableiciousScope extends ng.IScope {
        data: any[];
        config: IConfig;
        filter: ng.IFilterService;
        subHeaders: IHeading[];
        dataCols: IHeading[];
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
