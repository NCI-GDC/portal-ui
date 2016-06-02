module ngApp.components.tables.directives.tableicious {

  import ILocationService = ngApp.components.location.ILocationService;

  /* @ngInject */
  function Tableicious(
    $filter: ng.IFilterService,
    LocationService: ILocationService,
    UserService: IUserService,
    $window: ng.IWindowService
  ): ITableicious {
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
        $scope.getToolTipText = (h, d) => h.toolTipText ? h.toolTipText(d, $scope) : '';

        function hasChildren(h: IHeading): boolean {
          return h.children && h.children.length > 0;
        }

        function refresh(hs: IHeading[]): void {
          $scope.enabledHeadings = _.reject(hs, h => h.hidden);

          $scope.subHeaders = _.flatten<IHeading>(_.pluck(
            $scope.enabledHeadings.filter(h => hasChildren(h)),
            'children'
          ));

          $scope.dataCols = _.flatten<IHeading>($scope.enabledHeadings.map(
            (h: IHeading): IHeading[] | IHeading => hasChildren(h) ? h.children : h
          ));
        }

        $scope.$watch('headings', (n: IHeading[], o: IHeading[]) => {
          if (_.isEqual(n,o)) return;
          refresh(n);
        }, true);

        var loadedHeadings = ($scope.saved || []).length
          ? _.map($scope.saved, (s: IHeading): IHeading => _.merge(_.find($scope.headings, {id: s.id}), s))
          : _.cloneDeep($scope.headings);

        refresh(loadedHeadings);
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
    UserService:IUserService;
    LocationService:ILocationService;
    saved: string[];
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
      link: ($scope: ICellScope, element: ng.IAugmentedJQuery) => {
        $scope.$watch('cell', value => {
          element.html(value);
          $compile(element.contents())($scope);
        });
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
