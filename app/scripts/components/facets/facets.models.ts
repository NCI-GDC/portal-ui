module ngApp.components.facets.models {
  import IFacet = ngApp.models.IFacet;

  export interface IFacetScope extends ng.IScope {
    facet: IFacet;
    title: string;
    name: string;
    collapsed: boolean;
    expanded: boolean;
    displayCount: number;
    add(facet: string, term: string, event: any): void;
    remove(facet: string, term: string, event: any): void;
  }

  export interface IFacetAttributes extends ng.IAttributes {
    collapsed: boolean;
    expanded: boolean;
    displayCount: number;
  }

  export interface IFreeTextFacetsScope extends ng.IScope {
    field: any;
    entity: string;
  }

}
