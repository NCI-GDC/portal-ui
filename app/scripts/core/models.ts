module ngApp.models {
  export interface IEntity {
    uuid: any;
  }

  export interface ICollection {
    pagination: IPagination;
    hits: any[];
    facets?: IFacet[];
  }

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

  export interface IFacet {
    terms: any;
    category: string;
    termsHidden: Boolean;
  }
}
