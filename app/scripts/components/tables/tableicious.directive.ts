module ngApp.components.tables.directives.tableicious {

    /* @ngInject */
    function Tableicious($filter: ng.IFilterService, UserService): ITableicious {
        return {
            restrict: "E",
            scope: {
                rowId: "@",
                data: "=",
                paging: "=",
                headings: "=",
                refreshEvents: "="
            },
            replace: true,
            templateUrl: "components/tables/templates/tableicious.html",
            link: function($scope: ITableiciousScope) {
                var refreshEvents = $scope.refreshEvents || [
                    "gdc-user-reset"
                ];

                $scope.$filter = $filter;
                $scope.UserService = UserService;
                $scope.getCell = function(h, d) {
                    return h.td(d, $scope);
                }
                function hasChildren(h: IHeading): boolean {
                    return h.children && h.children.length > 0;
                }
                
                function refresh(hs: IHeading[]): void {
                    $scope.enabledHeadings = _.reject(hs, h => {
                        return h.hidden || (h.inactive && h.inactive($scope))
                    });
                    $scope.subHeaders = _.flatten<IHeading>(
                        _.pluck(_.filter($scope.enabledHeadings, (h) => {
                            return hasChildren(h);
                    }), 'children'));
                    $scope.dataCols = _.flatten<IHeading>(
                        _.map($scope.enabledHeadings, (h: IHeading): IHeading[] | IHeading => {
                            return hasChildren(h) ? h.children : h;
                    }));
                }

                _.forEach(refreshEvents, (event) => {
                    $scope.$on(event, () => {
                        refresh($scope.headings);
                    });
                });
                
                $scope.$watch('headings', (n: IHeading[], o: IHeading[]) => {
                   if (_.isEqual(n,o)) return;
                   refresh(n); 
                }, true);
                
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
        enabledHeadings: IHeading[];
        subHeaders: IHeading[];
        dataCols: IHeading[];
        rowId: string;
        hasChildren(h: IHeading): boolean;
        refresh(h: IHeading[]): void;
        getCell(h, d): string;
        $filter: ng.IFilterService;
        UserService:any;
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
        inactive($scope): boolean;
        children: IHeading[];
    }

    /* @ngInject */
    function Cell($compile: ng.ICompileService): ICell {
        return {
            restrict: "A",
            scope: {
                cell: "=",
                row: "=",
                data: "=",
                paging: "="
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
