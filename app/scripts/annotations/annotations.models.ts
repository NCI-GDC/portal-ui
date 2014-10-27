module ngApp.annotations.models {
  import IPagination = ngApp.models.IPagination;
  import IFacet = ngApp.models.IFacet;
  import ICollection = ngApp.models.ICollection;
  import IEntity = ngApp.models.IEntity;

  export interface INote {
    addedBy: string;
    dateAdded: string;
    dateEdited: string;
    editedBy: string;
    id: number;
    text: string;
  }

  export interface IAnnotations extends ICollection {
    hits: IAnnotation[];
  }

  export interface IAnnotation extends IEntity {
    classification: string;
    approved: boolean;
    category: string;
    createdBy: string;
    dateCreated: string;
    id: number;
    item: string;
    type: string;
    project: any;
    rescinded: boolean;
    status: string;
    notes: INote[];
  }
}
