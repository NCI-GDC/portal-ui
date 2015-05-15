module ngApp.annotations.models {
  import IFacet = ngApp.core.models.IFacet;
  import ICollection = ngApp.core.models.ICollection;
  import IEntity = ngApp.core.models.IEntity;

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
