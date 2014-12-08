module ngApp.components.facets.models {
  import IFacet = ngApp.models.IFacet;

  export interface IFacetScope extends ng.IScope {
    facet: IFacet;
    title: string;
    name: string;
    collapsed: boolean;
    expanded: boolean;
    displayCount: number;
    toggle(event: any, property: string): void;
  }

  export interface IFacetAttributes extends ng.IAttributes {
    collapsed: boolean;
    expanded: boolean;
    displayCount: number;
  }

  export interface IFreeTextFacetsScope extends ng.IScope {
    field: any;
  }

}
