module ngApp.annotations.models {
  import IPagination = ngApp.models.IPagination;
  import IFacet = ngApp.models.IFacet;
  import ICollection = ngApp.models.ICollection;
  import IEntity = ngApp.models.IEntity;

  export interface IAnnotations extends ICollection {
    hits: IAnnotation[];
  }

  export interface IAnnotation extends IEntity {
    id: string;
    uuid: string;
    notes: any;
    itemId: string;
    itemType: string;
    participantId: string;
    project: any;
    category: string;
    created: any;
    status: string;
  }
}
