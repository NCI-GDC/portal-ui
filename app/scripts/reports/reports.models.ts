module ngApp.reports.models {
  import ICollection = ngApp.models.ICollection;
  import IEntity = ngApp.models.IEntity;

  export interface IReports extends ICollection {
    hits: IReport[];
  }

  export interface IReport extends IEntity {
    id: string;
    name: string;
    charts: any;
  }

}
