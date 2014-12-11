module ngApp.models {
  import IPagination = ngApp.components.ui.pagination.models.IPagination;

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
    hits: any[];
    facets?: IFacet[];
    pagination: IPagination;
  }

  export interface IAdmin {
    type: number;
    batchNumber: string;
    dateOfDccUpload: string;
    projectCode: string;
    revision: number;
  }

  export interface IFacet {
    buckets: any;
  }
}
