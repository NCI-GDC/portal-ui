module ngApp.participants.models {
  import IPagination = ngApp.models.IPagination;
  import IFacet = ngApp.models.IFacet;
  import ICollection = ngApp.models.ICollection;
  import IAnnotation = ngApp.annotations.models.IAnnotation;
  import IFile = ngApp.files.models.IFile;
  import IAdmin = ngApp.models.IAdmin;
  import IEntity = ngApp.models.IEntity;

  export interface IParticipants extends ICollection {
    hits: IParticipant[];
  }

  export interface IParticipant extends IEntity {
    id: string;
    code: string;
    number: string;
    diseaseType: string;
    program: string;
    project: string;
    status: string;
    experiments: any;
    tumorStage: number;
    data: any;
    admin: IAdmin;
    ageAtInitialPathologicDiagnosis: number;
    bcrPatientBarcode: string;
    bcrPatientUuid: string;
    breastCarcinomaEstrogenReceptorStatus: string;
    cancerType: string;
    dayToDeath: number;
    gender: string;
    histologicalType: string;
    pathologicalStage: string;
    patientId: string;
    race: string;
    tissueSourceSite: string;
    vitalStatus: string;
    annotations: IAnnotation[];
    files: IFile[];
  }

}
