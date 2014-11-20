module ngApp.reports.models {
  import IPagination = ngApp.models.IPagination;
  import IFacet = ngApp.models.IFacet;
  import ICollection = ngApp.models.ICollection;
  import IAnnotation = ngApp.annotations.models.IAnnotation;
  import IFile = ngApp.files.models.IFile;
  import IAdmin = ngApp.models.IAdmin;
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
