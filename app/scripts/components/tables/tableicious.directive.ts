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
                $scope.filter = $filter;
                $scope.subHeaders = _.filter($scope.config.headings, (h) => {
                   return !h.hidden && h.children.length;
                });
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
    }

    interface IConfig {
        title: string;
        order: string[];
        rowId: string;
        headings: IHeading[];
        render(row: any): string;
    }
    
    interface IHeading {
        displayName: string;
        id: string;
        sortable: boolean;
        hidden: boolean;
        children: IConfig[];
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
