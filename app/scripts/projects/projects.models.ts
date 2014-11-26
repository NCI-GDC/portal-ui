module ngApp.projects.models {
  import ICollection = ngApp.models.ICollection;
  import IEntity = ngApp.models.IEntity;

  export interface IExperimentalData {
    experimentalType: string;
    fileCount: number;
    participantCount: number;
  }

  export interface ISummary {
    file_count: number;
    participantCount: number;
    analyzedData: any;
    experimentalData: IExperimentalData[];
  }

  export interface IProjects extends ICollection {
    hits: IProject[];
  }

  export interface IProject extends IEntity {
    project_name: string;
    project_code: string;
    program: string;
    status: string;
    summary: ISummary;
  }
}
