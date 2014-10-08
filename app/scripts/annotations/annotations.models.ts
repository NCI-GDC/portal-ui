module ngApp.annotations.models {
  import IPagination = ngApp.models.IPagination;
  import Pagination = ngApp.models.Pagination;
  import IFacet = ngApp.models.IFacet;
  import Facet = ngApp.models.Facet;
  import ICollection = ngApp.models.ICollection;

  export interface IAnnotations extends ICollection {
    hits: IAnnotation[];
  }

  export class Annotations implements IAnnotations {
    pagination: IPagination;
    facets: IFacet[];
    hits: IAnnotation[];

    /* @ngInject */
    constructor(obj: any) {
      this.hits = this._getHits(obj.hits);
      this.facets = this._getFacets(obj.facets);
      this.pagination = obj.pagination;
    }

    private _getHits(hits: Object[]): IAnnotation[] {
      return hits.map((hit: Object): IAnnotation => {
        return new Annotation(hit);
      });
    }

    private _getFacets(facets: IFacet[] = []): IFacet[] {
      return facets.map((facet: IFacet): IFacet => {
        return facet;
      });
    }
  }

  export interface IAnnotation {
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

  export class Annotation implements IAnnotation {
    id: string = "--";
    uuid: string = "--";
    notes: any = [];
    itemId: string = "--";
    itemType: string = "--";
    participantId: string = "--";
    project: any = {};
    category: string = "--";
    created: any = new Date();
    status: string = "--";

    /* @ngInject */
    constructor(obj: any) {
      this.id = obj.id || this.id;
      this.uuid = obj.uuid || this.uuid;
      this.notes = obj.notes || this.notes;
      this.itemId = obj.itemId || this.itemId;
      this.itemType = obj.itemType || this.itemType;
      this.participantId = obj.participantId || this.participantId;
      this.project = obj.project || this.project;
      this.category = obj.category || this.category;
      this.created = obj.created || this.created;
      this.status = obj.status || this.status;
    }
  }

  angular
      .module("annotations.models", [])
      .factory("Annotations", Annotations)
      .factory("Annotation", Annotation);
}
