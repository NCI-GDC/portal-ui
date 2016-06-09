module ngApp.components.table.models {
  import ILocationService = ngApp.components.location.ILocationService;

  export interface ITableiciousScope extends ng.IScope {
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
    UserService: IUserService;
    LocationService: ILocationService;
    saved: IHeading[];
    getToolTipText(h, d): any;
  }

  export interface IConfig {
    title: string;
    order: string[];
    rowId: string;
    headings: IHeading[];
    render(row: any): string;
  }

  export interface IHeading {
    th: string;
    id: string;
    td(row:any, filter: ng.IFilterService): string;
    sortable: boolean;
    hidden: boolean;
    inactive($scope): boolean;
    children: IHeading[];
  }
}
