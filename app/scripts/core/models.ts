module ngApp.models {
  export interface IEntity {
    uuid: any;
  }

  export interface IGDCWindowService extends ng.IWindowService {
    LoadXMLString: any;
    moment: MomentStatic;
    jQuery: JQueryStatic;
    scrollY: number;
  }

  export interface ICollection {
    pagination: IPagination;
    hits: any[];
    facets?: IFacet[];
  }

  export interface IAdmin {
    type: number;
    batchNumber: string;
    dateOfDccUpload: string;
    projectCode: string;
    revision: number;
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
    value: string;
  }
}
