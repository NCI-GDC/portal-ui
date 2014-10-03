module ngApp.participants.models {
  import IPagination = ngApp.models.IPagination;
  import Pagination = ngApp.models.Pagination;
  import IFacet = ngApp.models.IFacet;
  import Facet = ngApp.models.Facet;
  import ICollection = ngApp.models.ICollection;

  export interface IParticipants extends ICollection {
    hits: IParticipant[];
  }

  export class Participants implements IParticipants {
    pagination: IPagination;
    facets: IFacet[];
    hits: IParticipant[];

    /* @ngInject */
    constructor(obj: any) {
      this.hits = this._getHits(obj.hits);
      this.facets = this._getFacets(obj.facets);
      this.pagination = new Pagination(obj.pagination);
    }

    private _getHits(hits: Object[]): IParticipant[] {
      return hits.map((hit: Object): IParticipant => {
        return new Participant(hit);
      });
    }

    private _getFacets(facets: IFacet[] = []): IFacet[] {
      return facets.map((facet: IFacet): IFacet => {
        return new Facet(facet);
      });
    }
  }

  export interface IParticipant {
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

  export class Participant implements IParticipant {
    id: string = "--";
    code: string = "--";
    number: string = "--";
    site: string = "--";
    program: string = "--";
    status: string = "--";
    files: any = [];
    annotations: any = [];
    uuid: string = "--";
    experiments: any = [];
    data: any = [];
    gender: string = "--";
    vitStatus: string = "--";
    key: string = "--";

    /* @ngInject */
    constructor(obj: any) {
      this.id = obj.id || this.id;
      this.code = obj.code || this.code;
      this.number = obj.number || this.number;
      this.site = obj.site || this.site;
      this.program = obj.program || this.program;
      this.status = obj.status || this.status;
      this.files = obj.files || this.files;
      this.annotations = obj.annotations || this.annotations;
      this.uuid = obj.uuid || this.uuid;
      this.gender = obj.gender || this.gender;
      this.vitStatus = obj.vitStatus || this.vitStatus;
      this.key = obj.key || this.key;
      this.experiments = obj.experiments || this.experiments;
      this.data = obj.data || this.data;
    }
  }

  angular
      .module("participants.models", [])
      .factory("Participants", Participants)
      .factory("Participant", Participant);
}
