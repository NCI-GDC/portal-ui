module ngApp.projects.models {
  import ICollection = ngApp.models.ICollection;
  import IEntity = ngApp.models.IEntity;

  export interface IExperimentalData {
    experimentalType: string;
    fileCount: number;
    participantCount: number;
  }

  export interface ISummary {
    fileCount: number;
    participantCount: number;
    analyzedData: any;
    experimentalData: IExperimentalData[];
  }

  export interface IProjects extends ICollection {
    hits: IProject[];
  }

  export interface IProject extends IEntity {
    id: string;
    name: string;
    code: string;
    program: string;
    status: string;
    summary: ISummary;
    diseaseType: string;
    sequencingCenter: string;
    reports: any;
  }
}
