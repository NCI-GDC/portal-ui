module ngApp.models {
  import IPagination = ngApp.components.tables.pagination.models.IPagination;

  export interface IEntity {
    uuid: any;
  }

  export interface IGDCWindowService extends ng.IWindowService {
    LoadXMLString: any;
    moment: MomentStatic;
    jQuery: JQueryStatic;
    scrollY: number;
    c3: any;
    gql: any;
  }

  export interface ICollection {
    hits: any[];
    facets?: IFacet[];
    pagination: IPagination;
  }

  export interface IAdmin {
    bcr: string;
    disease_code: string;
    batch_number: string;
    year_of_dcc_upload: number;
    file_id: string;
    day_of_dcc_upload: number;
    month_of_dcc_upload: number;
    project_id: string;
    patient_withdrawal: Object;
  }

  export interface IFacet {
    buckets: any;
  }
}
