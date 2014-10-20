module ngApp.files.models {
  import IPagination = ngApp.models.IPagination;
  import IFacet = ngApp.models.IFacet;
  import ICollection = ngApp.models.ICollection;
  import IEntity = ngApp.models.IEntity;

  export interface IFiles extends ICollection {
    hits: IFile[];
  }

  export interface IFile extends IEntity {
    id: string;
    uuid: string;
    code: string;
    filename: string;
    files: any;
    metadata: any;
    metadataXML: any;
    size?: number;
  }
}
