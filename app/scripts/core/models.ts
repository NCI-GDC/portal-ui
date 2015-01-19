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
    bcr: string;
    disease_code: string;
    batch_number: string;
    year_of_dcc_upload: number;
    file_uuid: string;
    day_of_dcc_upload: number;
    month_of_dcc_upload: number;
    project_code: string;
    patient_withdrawal: Object;
  }

  export interface IFacet {
    buckets: any;
  }
}
