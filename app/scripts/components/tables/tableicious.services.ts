module ngApp.components.tableicious.services {

  import IHeading = ngApp.components.table.models.IHeading;
  import ITableiciousScope = ngApp.components.table.models.ITableiciousScope;

  export interface ITableiciousService {
    hasChildren(x: IHeading): boolean;
    rejectHidden(xs): IHeading[];
    flattenChildren(xs: IHeading[], keep: boolean): IHeading[];
    refresh($scope: ITableiciousScope, headings: IHeading[]): void;
  }

  class TableiciousService implements ITableiciousService {

    hasChildren(x: IHeading): boolean {
      return (x.children || []).length > 0;
    }

    rejectHidden(xs: IHeading[]): IHeading[] {
      return xs.filter(x => !x.hidden);
    }

    flattenChildren(xs: IHeading[], keep: boolean): IHeading[] {
      return xs.reduce((acc, x) => ([
        ...acc, 
        ...(this.hasChildren(x) ? x.children : keep ? [ x ] : [])
      ]), []);
    }

    refresh($scope: ITableiciousScope, headings: IHeading[]): void {
      $scope.enabledHeadings = this.rejectHidden(headings);
      $scope.subHeaders = this.flattenChildren($scope.enabledHeadings, false);
      $scope.dataCols = this.flattenChildren($scope.enabledHeadings, true);
    }

  }

angular
  .module("tableicious.services", [])
  .service("TableiciousService", TableiciousService);
}
