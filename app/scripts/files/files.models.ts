module ngApp.files.models {
  import IPagination = ngApp.models.IPagination;
  import Pagination = ngApp.models.Pagination;
  import IFacet = ngApp.models.IFacet;
  import Facet = ngApp.models.Facet;
  import ICollection = ngApp.models.ICollection;

  export interface IFiles extends ICollection {
    hits: IFile[];
  }

  export class Files implements IFiles {
    pagination: IPagination;
    facets: IFacet[];
    hits: IFile[];

    /* @ngInject */
    constructor(obj: any) {
      this.hits = this._getHits(obj.hits);
      this.facets = this._getFacets(obj.facets);
      this.pagination = new Pagination(obj.pagination);
    }

    private _getHits(hits: Object[]): IFile[] {
      return hits.map((hit: Object): IFile => {
        return new File(hit);
      });
    }

    private _getFacets(facets: IFacet[] = []): IFacet[] {
      return facets.map((facet: IFacet): IFacet => {
        return new Facet(facet);
      });
    }
  }

  export interface IFile {
    id: string;
    uuid: string;
    code: string;
    filename: string;
    files: any;
    metadata: any;
    metadataXML: any;
  }

  export class File implements IFile {
    id: string = "--";
    uuid: string = "--";
    code: string = "--";
    filename: string = "--";
    files: any = [];
    metadata: any = {};
    metadataXML: any = "--";

    /* @ngInject */
    constructor(obj: any) {
      this.id = obj.id || this.id;
      this.files = obj.files || this.files;
      this.metadata = obj.metadata || this.metadata;
      this.metadataXML = obj.metadataXML || this.metadataXML;
      this.filename = obj.filename || this.filename;
      this.uuid = obj.uuid || this.uuid;
      this.code = obj.code || this.code;
    }
  }

  angular
      .module("files.models", [])
      .factory("Files", Files)
      .factory("File", File);
}
