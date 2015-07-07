module ngApp.projects.models {
  import ICollection = ngApp.models.ICollection;
  import IEntity = ngApp.models.IEntity;

  export interface IExperimentalStrategies {
    file_count: number;
    case_count: number;
    experimental_strategy: string;
  }

  export interface IDataTypes {
    data_type: string;
    file_count: number;
    case_count: number;
  }

  export interface ISummary {
    file_count: number;
    case_count: number;
    file_size: number;
    data_types: IDataTypes[];
    experimental_strategies: IExperimentalStrategies[];
  }

  export interface IProjects extends ICollection {
    hits: IProject[];
  }

  export interface IProgram {
    name: string;
    program_id: string;
  }

  export interface IProject extends IEntity {
    project_id: string;
    name: string;
    disease_type: string;
    state: string;
    primary_site: string;
    summary: ISummary;
    program: IProgram;
  }

}

