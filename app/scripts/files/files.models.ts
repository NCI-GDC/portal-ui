module ngApp.files.models {
  import IFacet = ngApp.models.IFacet;
  import ICollection = ngApp.models.ICollection;
  import IEntity = ngApp.models.IEntity;
  import IParticipant = ngApp.participants.models.IParticipant;

  export interface IFiles extends ICollection {
    hits: IFile[];
  }

  export interface IArchive {
    archive_center_name: string;
    archive_center_type: string;
    archive_data_level: string;
    archive_uuid: string;
    archive_data_type_in_url: string;
    date_archive_added: string;
    disease_code: string;
    platform: string;
    platform_in_url: string;
    protected: boolean;
    revision: number;
  }

  export interface IDataFormat {
    name: string;
  }

  export interface IFile extends IEntity {
    access: string;
    data_format: IDataFormat;
    data_subtype: string;
    data_type: string;
    experimental_strategoy: string;
    file_extension: string;
    file_name: string;
    file_size: number;
    file_url: string;
    file_id: string;
    platform: string;
    updated: any;
    participants: IParticipant[];
    related_files: IFile[];
    related_ids: string[];
    archive?: IArchive;
    selected?: boolean
  }
}

