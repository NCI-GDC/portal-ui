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
    id: string;
    filename: string;
    files: any;
    metadata: any;
    metadataXML: any;
    barcode: string;
    format: string;
    checksum: string;
    published: string;
    uploaded: string;
    modified: string;
    size: number;
    state: string;
    access: boolean;
    participants: IParticipant[];
    archive?: IArchive;
    dataType: string;
    dataSubType: string;
    experimentStrategy: string;
    programStatus: boolean;
    platform: string;
    revision: string;
    version: string;
    level: number;
    submitter: string;
    submittedSince: string;
  }
}
