module ngApp.models {
  export interface ICollection {
    pagination: IPagination;
    hits: any[];
    facets?: IFacet[];
  }

  export enum SortOrder {
    asc, desc
  }

  export interface IPagination {
    count: number;
    total: number;
    size: number;
    from: number;
    page: number;
    pages: number;
    sort: string;
    order: SortOrder;
  }

  export class Pagination implements IPagination {
    count: number;
    total: number;
    size: number;
    from: number;
    page: number;
    pages: number;
    sort: string;
    order: SortOrder;

    constructor(obj: any) {
      this.count = obj.count;
      this.total = obj.total;
      this.size = obj.size;
      this.from = obj.from;
      this.page = obj.page;
      this.pages = obj.pages;
      this.sort = obj.sort;
      var o: string = obj.order;
      this.order = SortOrder[o];
    }
  }

  export interface IFacet {
    term: string;
    value: any;
  }

  export class Facet implements IFacet {
    term: string;
    value: any;

    constructor(obj: any) {
      this.term = obj.term;
      this.value = obj.value;
    }
  }

  angular
      .module("ngApp.models", [])
      .factory("Pagination", Pagination)
      .factory("Facet", Facet);
}
