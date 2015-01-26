module ngApp.components.tables.pagination.models {
  export interface IPagination {
    count: number;
    total: number;
    size: number;
    from: number;
    page: number;
    pages: number;
    sort: any;
  }
}
