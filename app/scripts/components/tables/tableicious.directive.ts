module ngApp.components.tables.directives.tableicious {

    import ILocationService = ngApp.components.location.ILocationService;
    import ITableiciousService = ngApp.components.tableicious.services.ITableiciousService;
    import ITableiciousScope = ngApp.components.table.models.ITableiciousScope;
    import IHeading = ngApp.components.table.models.IHeading;

    export interface ITableiciousDirective extends ng.IDirective {
        link($scope: ITableiciousScope): void;
    }

    /* @ngInject */
    function Tableicious (
        $filter: ng.IFilterService,
        LocationService: ILocationService,
        UserService: IUserService,
        $window: ng.IWindowService,
        TableiciousService: ITableiciousService
    ): ITableiciousDirective {
        return {
            restrict: "E",
            scope: {
                rowId: "@",
                data: "=",
                paging: "=",
                headings: "=",
                title: "@",
                saved: "="
            },
            replace: true,
            templateUrl: "components/tables/templates/tableicious.html",
            link: ($scope: ITableiciousScope) => {
                $scope.$filter = $filter;
                $scope.UserService = UserService;
                $scope.LocationService = LocationService;
                $scope.getCell = (h, d) => h.td(d, $scope);

                $scope.getToolTipText = (h, d) => {
                  return h.toolTipText ? h.toolTipText(d, $scope) : '';
                };

                $scope.$watch('headings', (nextHeadings: IHeading[], prevHeadings: IHeading[]) => {
                   if (!_.isEqual(nextHeadings, prevHeadings)) {
                     TableiciousService.refresh($scope, nextHeadings);
                   }
                }, true);

                var loadedHeadings = ($scope.saved || []).length
                  ? $scope.saved.map((heading: IHeading): IHeading =>
                    _.merge(_.find($scope.headings, { id: heading.id }), heading)
                  )
                  : _.cloneDeep($scope.headings);

                TableiciousService.refresh($scope, loadedHeadings);
            }
        }
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
              $scope.$watch('cell', function(value) {
                  element.html(value);
                  $compile(element.contents())($scope);
                }
              );
            }

        }
    }

    interface ICell extends ng.IDirective {
        link(scope: ICellScope, element: ng.IAugmentedJQuery): void;
    }

    interface ICellScope extends ng.IScope {
        cell: string;
    }

    angular.module("tableicious.directive", ["tableicious.services"])
    .directive("tableicious", Tableicious)
    .directive("cell", Cell);
}
