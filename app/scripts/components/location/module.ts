module ngApp.components.location {
  export interface ISearch {
    filters?: string;
    query?: string;
    pagination?: any;
  }

  export interface IFilters {
    op: string;
    content: IFilter[];
  }

  export interface IFilter {
    op: string;
    content: IFilterValue;
  }
  
  export interface IFilterValue {
    field: string;
    value: string[];
  }

  export interface ILocationService {
    path(): string;
    clear(): ng.ILocationService;
    search(): ISearch;
    setSearch(search: any): ng.ILocationService;
    filters(): IFilters;
    setFilters(filters: IFilters): ng.ILocationService;
    query(): string;
    setQuery(query?: string): ng.ILocationService;
    pagination(): any;
    setPaging(pagination: any): ng.ILocationService;
    setHref(href: string): void;
    getHref(): string;
    filter2query(f: any): string;
  }
  
  angular.module("components.location", [
    "location.services"
  ]);
}
