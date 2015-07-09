module ngApp.participants.models {
  import ICollection = ngApp.core.models.ICollection;
  import IAnnotation = ngApp.annotations.models.IAnnotation;
  import IFile = ngApp.files.models.IFile;
  import IFiles = ngApp.files.models.IFiles;
  import IAdmin = ngApp.core.models.IAdmin;
  import IEntity = ngApp.core.models.IEntity;

  export interface IParticipants extends ICollection {
    hits: IParticipant[];
  }

  export interface IParticipant extends IEntity {
    case_id: string;
    age_at_initial_pathologic_diagnosis: number;
    bcr_patient_uuid: string;
    bcr_patient_code: string;
    day_of_form_completion: number;
    days_to_birth: number;
    days_to_initial_pathologic_diagnosis: number;
    days_to_last_followup: number;
    gender: string;
    histological_type: string;
    icd_10: string;
    icd_o_3_histology: string;
    icd_o_3_site: string;
    informed_consent_verified: boolean;
    month_of_form_completion: number;
    person_neoplasm_cancer_status: string;
    prior_dx: boolean;
    race: string;
    tissue_prospective_collection_indicator: boolean;
    tissue_source_site: string;
    tumor_tissue_site: string;
    vital_status: string;
    year_of_form_completion: number;
    year_of_initial_pathologic_diagnosis: number;
    data: any;
    admin: IAdmin;
    annotations: IAnnotation[];
    files: IFile[];
    filesByType: Object;
    filteredRelatedFiles: IFiles;
  }

}
