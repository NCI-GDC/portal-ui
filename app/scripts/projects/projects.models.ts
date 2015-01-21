module ngApp.projects.models {
  import ICollection = ngApp.models.ICollection;
  import IEntity = ngApp.models.IEntity;

  export interface IExperimentalStrategies {
    experimentalStrategies: string;
    fileCount: number;
    participantCount: number;
  }

  export interface IDataTypes {
    experimentalStrategies: string;
    fileCount: number;
    participantCount: number;
  }

  export interface ISummary {
    data_file_count: number;
    participantCount: number;
    dataTypes: IDataTypes[];
    experimentalStrategies: IExperimentalStrategies[];
  }

  export interface IProjects extends ICollection {
    hits: IProject[];
  }

  export interface IProject extends IEntity {
    project_name: string;
    status: string;
    program: string;
    project_code: string;
    disease_type: string;
    list_updated: string;
    summary: ISummary;
  }
}
