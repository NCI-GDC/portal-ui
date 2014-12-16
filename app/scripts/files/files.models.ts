module ngApp.files.models {
  import IPagination = ngApp.models.IPagination;
  import IFacet = ngApp.models.IFacet;
  import ICollection = ngApp.models.ICollection;
  import IEntity = ngApp.models.IEntity;
  import IParticipant = ngApp.participants.models.IParticipant;

  export interface IFiles extends ICollection {
    hits: IFile[];
  }

  export interface IArchive {
    folderUrl: string;
    name: string;
    url: string;
    uuid: string;
    batch: string;
    archive_uuid: string;
    centerName: string;
    centerType: string;
    dataLevel: string;
    dataTypeInUrl: string;
    dateArchiveAdded: string;
    diseaseCode: string;
    platform: string;
    platformInUrl: string;
    protected: boolean;
    revision: number;
  }

  export interface IFile extends IEntity {
    _aliquot_barcode: string;
    data_access: string;
    data_format: string;
    data_subtype: string;
    data_type: string;
    experimental_strategoy: string;
    file_extension: string;
    file_name: string;
    file_size: number;
    file_url: string;
    file_uuid: string;
    platform: string;
    updated: any;
    participants: IParticipant[];
    archive?: IArchive;
    selected?: boolean
  }
}

