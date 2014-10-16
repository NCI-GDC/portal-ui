module ngApp.projects.models {
  import ICollection = ngApp.models.ICollection;
  import IEntity = ngApp.models.IEntity;

  export interface IProjects extends ICollection {
    hits: IProject[];
  }

  export interface IProject extends IEntity {
    id: string;
    code: string;
    name: string;
    site: string;
    numDonors: number;
    program: string;
    sequencingCenter: string;
    numFiles: number;
    data: any;
    date: any;
    status: string;
    experiments: any;
    reports: any;
  }
}
