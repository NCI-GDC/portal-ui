module ngApp.widgets.models {
  import IPagination = ngApp.models.IPagination;
  import Pagination = ngApp.models.Pagination;
  import IFacet = ngApp.models.IFacet;
  import Facet = ngApp.models.Facet;
  import ICollection = ngApp.models.ICollection;

  export interface IWidgets extends ICollection {
    hits: IWidget[];
  }

  export class Widgets implements IWidgets {
    pagination: IPagination;
    facets: IFacet[];
    hits: IWidget[];

    /* @ngInject */
    constructor(obj: any) {
      this.hits = this._getHits(obj.hits);
      this.facets = this._getFacets(obj.facets);
      this.pagination = new Pagination(obj.pagination);
    }

    private _getHits(hits: Object[]): IWidget[] {
      return hits.map((hit: Object): IWidget => {
        return new Widget(hit);
      });
    }

    private _getFacets(facets: IFacet[] = []): IFacet[] {
      return facets.map((facet: IFacet): IFacet => {
        return new Facet(facet);
      });
    }
  }

  export interface IWidget {
    id: string;
    name: string;
    description: string;
  }

  export class Widget implements IWidget {
    id: string = "--";
    name: string = "--";
    description: string = "--";

    /* @ngInject */
    constructor(obj: any) {
      this.id = obj.id || this.id;
      this.name = obj.name || this.name;
      this.description = obj.description || this.description;
    }
  }

  angular
      .module("widgets.models", [])
      .factory("Widgets", Widgets)
      .factory("Widget", Widget);
}
