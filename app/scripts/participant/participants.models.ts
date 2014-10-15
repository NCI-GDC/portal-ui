module ngApp.participants.models {
  import IPagination = ngApp.models.IPagination;
  import IFacet = ngApp.models.IFacet;
  import ICollection = ngApp.models.ICollection;
  import IEntity = ngApp.models.IEntity;

  export interface IParticipants extends ICollection {
    hits: IParticipant[];
  }

  export interface IParticipant extends IEntity {
    id: string;
    code: string;
    number: string;
    site: string;
    program: string;
    status: string;
    files: any;
    annotations: any;
    experiments: any;
    data: any;
    gender: string;
    vitStatus: string;
    key: string;
    uuid: string;
  }
}
