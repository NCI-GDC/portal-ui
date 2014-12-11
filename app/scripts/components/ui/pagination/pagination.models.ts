module ngApp.components.ui.pagination.models {
  export interface IPagination {
    count: number;
    total: number;
    size: number;
    from: number;
    page: number;
    pages: number;
    sort: string;
    order: string;
  }
}
