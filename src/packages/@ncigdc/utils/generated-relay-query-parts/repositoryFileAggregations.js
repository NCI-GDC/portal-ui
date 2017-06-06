/* @flow */
/* eslint max-len:0, comma-dangle:0 */

import Relay from "react-relay/classic";

export const initialFileAggregationsVariables = {
  shouldShow_access: false,
  shouldShow_acl: false,
  shouldShow_analysis__analysis_id: false,
  shouldShow_analysis__analysis_type: false,
  shouldShow_analysis__created_datetime: false,
  shouldShow_analysis__input_files__access: false,
  shouldShow_analysis__input_files__created_datetime: false,
  shouldShow_analysis__input_files__data_category: false,
  shouldShow_analysis__input_files__data_format: false,
  shouldShow_analysis__input_files__data_type: false,
  shouldShow_analysis__input_files__error_type: false,
  shouldShow_analysis__input_files__experimental_strategy: false,
  shouldShow_analysis__input_files__file_id: false,
  shouldShow_analysis__input_files__file_name: false,
  shouldShow_analysis__input_files__file_size: false,
  shouldShow_analysis__input_files__file_state: false,
  shouldShow_analysis__input_files__md5sum: false,
  shouldShow_analysis__input_files__platform: false,
  shouldShow_analysis__input_files__revision: false,
  shouldShow_analysis__input_files__state: false,
  shouldShow_analysis__input_files__state_comment: false,
  shouldShow_analysis__input_files__submitter_id: false,
  shouldShow_analysis__input_files__updated_datetime: false,
  shouldShow_analysis__metadata__read_groups__RIN: false,
  shouldShow_analysis__metadata__read_groups__adapter_name: false,
  shouldShow_analysis__metadata__read_groups__adapter_sequence: false,
  shouldShow_analysis__metadata__read_groups__base_caller_name: false,
  shouldShow_analysis__metadata__read_groups__base_caller_version: false,
  shouldShow_analysis__metadata__read_groups__created_datetime: false,
  shouldShow_analysis__metadata__read_groups__experiment_name: false,
  shouldShow_analysis__metadata__read_groups__flow_cell_barcode: false,
  shouldShow_analysis__metadata__read_groups__includes_spike_ins: false,
  shouldShow_analysis__metadata__read_groups__instrument_model: false,
  shouldShow_analysis__metadata__read_groups__is_paired_end: false,
  shouldShow_analysis__metadata__read_groups__library_name: false,
  shouldShow_analysis__metadata__read_groups__library_preparation_kit_catalog_number: false,
  shouldShow_analysis__metadata__read_groups__library_preparation_kit_name: false,
  shouldShow_analysis__metadata__read_groups__library_preparation_kit_vendor: false,
  shouldShow_analysis__metadata__read_groups__library_preparation_kit_version: false,
  shouldShow_analysis__metadata__read_groups__library_selection: false,
  shouldShow_analysis__metadata__read_groups__library_strand: false,
  shouldShow_analysis__metadata__read_groups__library_strategy: false,
  shouldShow_analysis__metadata__read_groups__platform: false,
  shouldShow_analysis__metadata__read_groups__read_group_id: false,
  shouldShow_analysis__metadata__read_groups__read_group_name: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__adapter_content: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__basic_statistics: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__created_datetime: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__encoding: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__fastq_name: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__kmer_content: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__overrepresented_sequences: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__per_base_n_content: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__per_base_sequence_content: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__per_base_sequence_quality: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__per_sequence_gc_content: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__per_sequence_quality_score: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__per_tile_sequence_quality: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__percent_gc_content: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__read_group_qc_id: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__sequence_duplication_levels: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__sequence_length_distribution: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__state: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__submitter_id: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__total_sequences: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__updated_datetime: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__workflow_end_datetime: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__workflow_link: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__workflow_start_datetime: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__workflow_type: false,
  shouldShow_analysis__metadata__read_groups__read_group_qcs__workflow_version: false,
  shouldShow_analysis__metadata__read_groups__read_length: false,
  shouldShow_analysis__metadata__read_groups__sequencing_center: false,
  shouldShow_analysis__metadata__read_groups__sequencing_date: false,
  shouldShow_analysis__metadata__read_groups__size_selection_range: false,
  shouldShow_analysis__metadata__read_groups__spike_ins_concentration: false,
  shouldShow_analysis__metadata__read_groups__spike_ins_fasta: false,
  shouldShow_analysis__metadata__read_groups__state: false,
  shouldShow_analysis__metadata__read_groups__submitter_id: false,
  shouldShow_analysis__metadata__read_groups__target_capture_kit_catalog_number: false,
  shouldShow_analysis__metadata__read_groups__target_capture_kit_name: false,
  shouldShow_analysis__metadata__read_groups__target_capture_kit_target_region: false,
  shouldShow_analysis__metadata__read_groups__target_capture_kit_vendor: false,
  shouldShow_analysis__metadata__read_groups__target_capture_kit_version: false,
  shouldShow_analysis__metadata__read_groups__to_trim_adapter_sequence: false,
  shouldShow_analysis__metadata__read_groups__updated_datetime: false,
  shouldShow_analysis__state: false,
  shouldShow_analysis__submitter_id: false,
  shouldShow_analysis__updated_datetime: false,
  shouldShow_analysis__workflow_end_datetime: false,
  shouldShow_analysis__workflow_link: false,
  shouldShow_analysis__workflow_start_datetime: false,
  shouldShow_analysis__workflow_type: false,
  shouldShow_analysis__workflow_version: false,
  shouldShow_annotations__annotation_id: false,
  shouldShow_annotations__case_id: false,
  shouldShow_annotations__case_submitter_id: false,
  shouldShow_annotations__category: false,
  shouldShow_annotations__classification: false,
  shouldShow_annotations__created_datetime: false,
  shouldShow_annotations__creator: false,
  shouldShow_annotations__entity_id: false,
  shouldShow_annotations__entity_submitter_id: false,
  shouldShow_annotations__entity_type: false,
  shouldShow_annotations__legacy_created_datetime: false,
  shouldShow_annotations__legacy_updated_datetime: false,
  shouldShow_annotations__notes: false,
  shouldShow_annotations__state: false,
  shouldShow_annotations__status: false,
  shouldShow_annotations__submitter_id: false,
  shouldShow_annotations__updated_datetime: false,
  shouldShow_archive__archive_id: false,
  shouldShow_archive__created_datetime: false,
  shouldShow_archive__data_category: false,
  shouldShow_archive__data_format: false,
  shouldShow_archive__data_type: false,
  shouldShow_archive__error_type: false,
  shouldShow_archive__file_name: false,
  shouldShow_archive__file_size: false,
  shouldShow_archive__file_state: false,
  shouldShow_archive__md5sum: false,
  shouldShow_archive__revision: false,
  shouldShow_archive__state: false,
  shouldShow_archive__state_comment: false,
  shouldShow_archive__submitter_id: false,
  shouldShow_archive__updated_datetime: false,
  shouldShow_associated_entities__case_id: false,
  shouldShow_associated_entities__entity_id: false,
  shouldShow_associated_entities__entity_submitter_id: false,
  shouldShow_associated_entities__entity_type: false,
  shouldShow_cases__aliquot_ids: false,
  shouldShow_cases__analyte_ids: false,
  shouldShow_cases__annotations__annotation_id: false,
  shouldShow_cases__annotations__case_id: false,
  shouldShow_cases__annotations__case_submitter_id: false,
  shouldShow_cases__annotations__category: false,
  shouldShow_cases__annotations__classification: false,
  shouldShow_cases__annotations__created_datetime: false,
  shouldShow_cases__annotations__creator: false,
  shouldShow_cases__annotations__entity_id: false,
  shouldShow_cases__annotations__entity_submitter_id: false,
  shouldShow_cases__annotations__entity_type: false,
  shouldShow_cases__annotations__legacy_created_datetime: false,
  shouldShow_cases__annotations__legacy_updated_datetime: false,
  shouldShow_cases__annotations__notes: false,
  shouldShow_cases__annotations__state: false,
  shouldShow_cases__annotations__status: false,
  shouldShow_cases__annotations__submitter_id: false,
  shouldShow_cases__annotations__updated_datetime: false,
  shouldShow_cases__case_id: false,
  shouldShow_cases__created_datetime: false,
  shouldShow_cases__days_to_index: false,
  shouldShow_cases__demographic__created_datetime: false,
  shouldShow_cases__demographic__demographic_id: false,
  shouldShow_cases__demographic__ethnicity: false,
  shouldShow_cases__demographic__gender: false,
  shouldShow_cases__demographic__race: false,
  shouldShow_cases__demographic__state: false,
  shouldShow_cases__demographic__submitter_id: false,
  shouldShow_cases__demographic__updated_datetime: false,
  shouldShow_cases__demographic__year_of_birth: false,
  shouldShow_cases__demographic__year_of_death: false,
  shouldShow_cases__diagnoses__age_at_diagnosis: false,
  shouldShow_cases__diagnoses__ajcc_clinical_m: false,
  shouldShow_cases__diagnoses__ajcc_clinical_n: false,
  shouldShow_cases__diagnoses__ajcc_clinical_stage: false,
  shouldShow_cases__diagnoses__ajcc_clinical_t: false,
  shouldShow_cases__diagnoses__ajcc_pathologic_m: false,
  shouldShow_cases__diagnoses__ajcc_pathologic_n: false,
  shouldShow_cases__diagnoses__ajcc_pathologic_stage: false,
  shouldShow_cases__diagnoses__ajcc_pathologic_t: false,
  shouldShow_cases__diagnoses__ann_arbor_b_symptoms: false,
  shouldShow_cases__diagnoses__ann_arbor_clinical_stage: false,
  shouldShow_cases__diagnoses__ann_arbor_extranodal_involvement: false,
  shouldShow_cases__diagnoses__ann_arbor_pathologic_stage: false,
  shouldShow_cases__diagnoses__burkitt_lymphoma_clinical_variant: false,
  shouldShow_cases__diagnoses__cause_of_death: false,
  shouldShow_cases__diagnoses__circumferential_resection_margin: false,
  shouldShow_cases__diagnoses__classification_of_tumor: false,
  shouldShow_cases__diagnoses__colon_polyps_history: false,
  shouldShow_cases__diagnoses__created_datetime: false,
  shouldShow_cases__diagnoses__days_to_birth: false,
  shouldShow_cases__diagnoses__days_to_death: false,
  shouldShow_cases__diagnoses__days_to_hiv_diagnosis: false,
  shouldShow_cases__diagnoses__days_to_last_follow_up: false,
  shouldShow_cases__diagnoses__days_to_last_known_disease_status: false,
  shouldShow_cases__diagnoses__days_to_new_event: false,
  shouldShow_cases__diagnoses__days_to_recurrence: false,
  shouldShow_cases__diagnoses__diagnosis_id: false,
  shouldShow_cases__diagnoses__figo_stage: false,
  shouldShow_cases__diagnoses__hiv_positive: false,
  shouldShow_cases__diagnoses__hpv_positive_type: false,
  shouldShow_cases__diagnoses__hpv_status: false,
  shouldShow_cases__diagnoses__last_known_disease_status: false,
  shouldShow_cases__diagnoses__laterality: false,
  shouldShow_cases__diagnoses__ldh_level_at_diagnosis: false,
  shouldShow_cases__diagnoses__ldh_normal_range_upper: false,
  shouldShow_cases__diagnoses__lymph_nodes_positive: false,
  shouldShow_cases__diagnoses__lymphatic_invasion_present: false,
  shouldShow_cases__diagnoses__method_of_diagnosis: false,
  shouldShow_cases__diagnoses__morphology: false,
  shouldShow_cases__diagnoses__new_event_anatomic_site: false,
  shouldShow_cases__diagnoses__new_event_type: false,
  shouldShow_cases__diagnoses__perineural_invasion_present: false,
  shouldShow_cases__diagnoses__primary_diagnosis: false,
  shouldShow_cases__diagnoses__prior_malignancy: false,
  shouldShow_cases__diagnoses__prior_treatment: false,
  shouldShow_cases__diagnoses__progression_or_recurrence: false,
  shouldShow_cases__diagnoses__residual_disease: false,
  shouldShow_cases__diagnoses__site_of_resection_or_biopsy: false,
  shouldShow_cases__diagnoses__state: false,
  shouldShow_cases__diagnoses__submitter_id: false,
  shouldShow_cases__diagnoses__tissue_or_organ_of_origin: false,
  shouldShow_cases__diagnoses__treatments__created_datetime: false,
  shouldShow_cases__diagnoses__treatments__days_to_treatment: false,
  shouldShow_cases__diagnoses__treatments__days_to_treatment_end: false,
  shouldShow_cases__diagnoses__treatments__days_to_treatment_start: false,
  shouldShow_cases__diagnoses__treatments__state: false,
  shouldShow_cases__diagnoses__treatments__submitter_id: false,
  shouldShow_cases__diagnoses__treatments__therapeutic_agents: false,
  shouldShow_cases__diagnoses__treatments__treatment_anatomic_site: false,
  shouldShow_cases__diagnoses__treatments__treatment_id: false,
  shouldShow_cases__diagnoses__treatments__treatment_intent_type: false,
  shouldShow_cases__diagnoses__treatments__treatment_or_therapy: false,
  shouldShow_cases__diagnoses__treatments__treatment_outcome: false,
  shouldShow_cases__diagnoses__treatments__treatment_type: false,
  shouldShow_cases__diagnoses__treatments__updated_datetime: false,
  shouldShow_cases__diagnoses__tumor_grade: false,
  shouldShow_cases__diagnoses__tumor_stage: false,
  shouldShow_cases__diagnoses__updated_datetime: false,
  shouldShow_cases__diagnoses__vascular_invasion_present: false,
  shouldShow_cases__diagnoses__vital_status: false,
  shouldShow_cases__diagnoses__year_of_diagnosis: false,
  shouldShow_cases__disease_type: false,
  shouldShow_cases__exposures__alcohol_history: false,
  shouldShow_cases__exposures__alcohol_intensity: false,
  shouldShow_cases__exposures__bmi: false,
  shouldShow_cases__exposures__cigarettes_per_day: false,
  shouldShow_cases__exposures__created_datetime: false,
  shouldShow_cases__exposures__exposure_id: false,
  shouldShow_cases__exposures__height: false,
  shouldShow_cases__exposures__pack_years_smoked: false,
  shouldShow_cases__exposures__state: false,
  shouldShow_cases__exposures__submitter_id: false,
  shouldShow_cases__exposures__tobacco_smoking_onset_year: false,
  shouldShow_cases__exposures__tobacco_smoking_quit_year: false,
  shouldShow_cases__exposures__tobacco_smoking_status: false,
  shouldShow_cases__exposures__updated_datetime: false,
  shouldShow_cases__exposures__weight: false,
  shouldShow_cases__exposures__years_smoked: false,
  shouldShow_cases__family_histories__created_datetime: false,
  shouldShow_cases__family_histories__family_history_id: false,
  shouldShow_cases__family_histories__relationship_age_at_diagnosis: false,
  shouldShow_cases__family_histories__relationship_gender: false,
  shouldShow_cases__family_histories__relationship_primary_diagnosis: false,
  shouldShow_cases__family_histories__relationship_type: false,
  shouldShow_cases__family_histories__relative_with_cancer_history: false,
  shouldShow_cases__family_histories__state: false,
  shouldShow_cases__family_histories__submitter_id: false,
  shouldShow_cases__family_histories__updated_datetime: false,
  shouldShow_cases__portion_ids: false,
  shouldShow_cases__primary_site: false,
  shouldShow_cases__project__dbgap_accession_number: false,
  shouldShow_cases__project__disease_type: false,
  shouldShow_cases__project__intended_release_date: false,
  shouldShow_cases__project__name: false,
  shouldShow_cases__project__primary_site: false,
  shouldShow_cases__project__program__dbgap_accession_number: false,
  shouldShow_cases__project__program__name: false,
  shouldShow_cases__project__program__program_id: false,
  shouldShow_cases__project__project_id: false,
  shouldShow_cases__project__releasable: false,
  shouldShow_cases__project__released: false,
  shouldShow_cases__project__state: false,
  shouldShow_cases__sample_ids: false,
  shouldShow_cases__samples__annotations__annotation_id: false,
  shouldShow_cases__samples__annotations__case_id: false,
  shouldShow_cases__samples__annotations__case_submitter_id: false,
  shouldShow_cases__samples__annotations__category: false,
  shouldShow_cases__samples__annotations__classification: false,
  shouldShow_cases__samples__annotations__created_datetime: false,
  shouldShow_cases__samples__annotations__creator: false,
  shouldShow_cases__samples__annotations__entity_id: false,
  shouldShow_cases__samples__annotations__entity_submitter_id: false,
  shouldShow_cases__samples__annotations__entity_type: false,
  shouldShow_cases__samples__annotations__legacy_created_datetime: false,
  shouldShow_cases__samples__annotations__legacy_updated_datetime: false,
  shouldShow_cases__samples__annotations__notes: false,
  shouldShow_cases__samples__annotations__state: false,
  shouldShow_cases__samples__annotations__status: false,
  shouldShow_cases__samples__annotations__submitter_id: false,
  shouldShow_cases__samples__annotations__updated_datetime: false,
  shouldShow_cases__samples__biospecimen_anatomic_site: false,
  shouldShow_cases__samples__composition: false,
  shouldShow_cases__samples__created_datetime: false,
  shouldShow_cases__samples__current_weight: false,
  shouldShow_cases__samples__days_to_collection: false,
  shouldShow_cases__samples__days_to_sample_procurement: false,
  shouldShow_cases__samples__diagnosis_pathologically_confirmed: false,
  shouldShow_cases__samples__freezing_method: false,
  shouldShow_cases__samples__initial_weight: false,
  shouldShow_cases__samples__intermediate_dimension: false,
  shouldShow_cases__samples__is_ffpe: false,
  shouldShow_cases__samples__longest_dimension: false,
  shouldShow_cases__samples__method_of_sample_procurement: false,
  shouldShow_cases__samples__oct_embedded: false,
  shouldShow_cases__samples__pathology_report_uuid: false,
  shouldShow_cases__samples__portions__analytes__a260_a280_ratio: false,
  shouldShow_cases__samples__portions__analytes__aliquots__aliquot_id: false,
  shouldShow_cases__samples__portions__analytes__aliquots__aliquot_quantity: false,
  shouldShow_cases__samples__portions__analytes__aliquots__aliquot_volume: false,
  shouldShow_cases__samples__portions__analytes__aliquots__amount: false,
  shouldShow_cases__samples__portions__analytes__aliquots__analyte_type: false,
  shouldShow_cases__samples__portions__analytes__aliquots__analyte_type_id: false,
  shouldShow_cases__samples__portions__analytes__aliquots__annotations__annotation_id: false,
  shouldShow_cases__samples__portions__analytes__aliquots__annotations__case_id: false,
  shouldShow_cases__samples__portions__analytes__aliquots__annotations__case_submitter_id: false,
  shouldShow_cases__samples__portions__analytes__aliquots__annotations__category: false,
  shouldShow_cases__samples__portions__analytes__aliquots__annotations__classification: false,
  shouldShow_cases__samples__portions__analytes__aliquots__annotations__created_datetime: false,
  shouldShow_cases__samples__portions__analytes__aliquots__annotations__creator: false,
  shouldShow_cases__samples__portions__analytes__aliquots__annotations__entity_id: false,
  shouldShow_cases__samples__portions__analytes__aliquots__annotations__entity_submitter_id: false,
  shouldShow_cases__samples__portions__analytes__aliquots__annotations__entity_type: false,
  shouldShow_cases__samples__portions__analytes__aliquots__annotations__legacy_created_datetime: false,
  shouldShow_cases__samples__portions__analytes__aliquots__annotations__legacy_updated_datetime: false,
  shouldShow_cases__samples__portions__analytes__aliquots__annotations__notes: false,
  shouldShow_cases__samples__portions__analytes__aliquots__annotations__state: false,
  shouldShow_cases__samples__portions__analytes__aliquots__annotations__status: false,
  shouldShow_cases__samples__portions__analytes__aliquots__annotations__submitter_id: false,
  shouldShow_cases__samples__portions__analytes__aliquots__annotations__updated_datetime: false,
  shouldShow_cases__samples__portions__analytes__aliquots__center__center_id: false,
  shouldShow_cases__samples__portions__analytes__aliquots__center__center_type: false,
  shouldShow_cases__samples__portions__analytes__aliquots__center__code: false,
  shouldShow_cases__samples__portions__analytes__aliquots__center__name: false,
  shouldShow_cases__samples__portions__analytes__aliquots__center__namespace: false,
  shouldShow_cases__samples__portions__analytes__aliquots__center__short_name: false,
  shouldShow_cases__samples__portions__analytes__aliquots__concentration: false,
  shouldShow_cases__samples__portions__analytes__aliquots__created_datetime: false,
  shouldShow_cases__samples__portions__analytes__aliquots__source_center: false,
  shouldShow_cases__samples__portions__analytes__aliquots__state: false,
  shouldShow_cases__samples__portions__analytes__aliquots__submitter_id: false,
  shouldShow_cases__samples__portions__analytes__aliquots__updated_datetime: false,
  shouldShow_cases__samples__portions__analytes__amount: false,
  shouldShow_cases__samples__portions__analytes__analyte_id: false,
  shouldShow_cases__samples__portions__analytes__analyte_quantity: false,
  shouldShow_cases__samples__portions__analytes__analyte_type: false,
  shouldShow_cases__samples__portions__analytes__analyte_type_id: false,
  shouldShow_cases__samples__portions__analytes__analyte_volume: false,
  shouldShow_cases__samples__portions__analytes__annotations__annotation_id: false,
  shouldShow_cases__samples__portions__analytes__annotations__case_id: false,
  shouldShow_cases__samples__portions__analytes__annotations__case_submitter_id: false,
  shouldShow_cases__samples__portions__analytes__annotations__category: false,
  shouldShow_cases__samples__portions__analytes__annotations__classification: false,
  shouldShow_cases__samples__portions__analytes__annotations__created_datetime: false,
  shouldShow_cases__samples__portions__analytes__annotations__creator: false,
  shouldShow_cases__samples__portions__analytes__annotations__entity_id: false,
  shouldShow_cases__samples__portions__analytes__annotations__entity_submitter_id: false,
  shouldShow_cases__samples__portions__analytes__annotations__entity_type: false,
  shouldShow_cases__samples__portions__analytes__annotations__legacy_created_datetime: false,
  shouldShow_cases__samples__portions__analytes__annotations__legacy_updated_datetime: false,
  shouldShow_cases__samples__portions__analytes__annotations__notes: false,
  shouldShow_cases__samples__portions__analytes__annotations__state: false,
  shouldShow_cases__samples__portions__analytes__annotations__status: false,
  shouldShow_cases__samples__portions__analytes__annotations__submitter_id: false,
  shouldShow_cases__samples__portions__analytes__annotations__updated_datetime: false,
  shouldShow_cases__samples__portions__analytes__concentration: false,
  shouldShow_cases__samples__portions__analytes__created_datetime: false,
  shouldShow_cases__samples__portions__analytes__normal_tumor_genotype_snp_match: false,
  shouldShow_cases__samples__portions__analytes__ribosomal_rna_28s_16s_ratio: false,
  shouldShow_cases__samples__portions__analytes__spectrophotometer_method: false,
  shouldShow_cases__samples__portions__analytes__state: false,
  shouldShow_cases__samples__portions__analytes__submitter_id: false,
  shouldShow_cases__samples__portions__analytes__updated_datetime: false,
  shouldShow_cases__samples__portions__analytes__well_number: false,
  shouldShow_cases__samples__portions__annotations__annotation_id: false,
  shouldShow_cases__samples__portions__annotations__case_id: false,
  shouldShow_cases__samples__portions__annotations__case_submitter_id: false,
  shouldShow_cases__samples__portions__annotations__category: false,
  shouldShow_cases__samples__portions__annotations__classification: false,
  shouldShow_cases__samples__portions__annotations__created_datetime: false,
  shouldShow_cases__samples__portions__annotations__creator: false,
  shouldShow_cases__samples__portions__annotations__entity_id: false,
  shouldShow_cases__samples__portions__annotations__entity_submitter_id: false,
  shouldShow_cases__samples__portions__annotations__entity_type: false,
  shouldShow_cases__samples__portions__annotations__legacy_created_datetime: false,
  shouldShow_cases__samples__portions__annotations__legacy_updated_datetime: false,
  shouldShow_cases__samples__portions__annotations__notes: false,
  shouldShow_cases__samples__portions__annotations__state: false,
  shouldShow_cases__samples__portions__annotations__status: false,
  shouldShow_cases__samples__portions__annotations__submitter_id: false,
  shouldShow_cases__samples__portions__annotations__updated_datetime: false,
  shouldShow_cases__samples__portions__center__center_id: false,
  shouldShow_cases__samples__portions__center__center_type: false,
  shouldShow_cases__samples__portions__center__code: false,
  shouldShow_cases__samples__portions__center__name: false,
  shouldShow_cases__samples__portions__center__namespace: false,
  shouldShow_cases__samples__portions__center__short_name: false,
  shouldShow_cases__samples__portions__created_datetime: false,
  shouldShow_cases__samples__portions__creation_datetime: false,
  shouldShow_cases__samples__portions__is_ffpe: false,
  shouldShow_cases__samples__portions__portion_id: false,
  shouldShow_cases__samples__portions__portion_number: false,
  shouldShow_cases__samples__portions__slides__annotations__annotation_id: false,
  shouldShow_cases__samples__portions__slides__annotations__case_id: false,
  shouldShow_cases__samples__portions__slides__annotations__case_submitter_id: false,
  shouldShow_cases__samples__portions__slides__annotations__category: false,
  shouldShow_cases__samples__portions__slides__annotations__classification: false,
  shouldShow_cases__samples__portions__slides__annotations__created_datetime: false,
  shouldShow_cases__samples__portions__slides__annotations__creator: false,
  shouldShow_cases__samples__portions__slides__annotations__entity_id: false,
  shouldShow_cases__samples__portions__slides__annotations__entity_submitter_id: false,
  shouldShow_cases__samples__portions__slides__annotations__entity_type: false,
  shouldShow_cases__samples__portions__slides__annotations__legacy_created_datetime: false,
  shouldShow_cases__samples__portions__slides__annotations__legacy_updated_datetime: false,
  shouldShow_cases__samples__portions__slides__annotations__notes: false,
  shouldShow_cases__samples__portions__slides__annotations__state: false,
  shouldShow_cases__samples__portions__slides__annotations__status: false,
  shouldShow_cases__samples__portions__slides__annotations__submitter_id: false,
  shouldShow_cases__samples__portions__slides__annotations__updated_datetime: false,
  shouldShow_cases__samples__portions__slides__created_datetime: false,
  shouldShow_cases__samples__portions__slides__number_proliferating_cells: false,
  shouldShow_cases__samples__portions__slides__percent_eosinophil_infiltration: false,
  shouldShow_cases__samples__portions__slides__percent_granulocyte_infiltration: false,
  shouldShow_cases__samples__portions__slides__percent_inflam_infiltration: false,
  shouldShow_cases__samples__portions__slides__percent_lymphocyte_infiltration: false,
  shouldShow_cases__samples__portions__slides__percent_monocyte_infiltration: false,
  shouldShow_cases__samples__portions__slides__percent_necrosis: false,
  shouldShow_cases__samples__portions__slides__percent_neutrophil_infiltration: false,
  shouldShow_cases__samples__portions__slides__percent_normal_cells: false,
  shouldShow_cases__samples__portions__slides__percent_stromal_cells: false,
  shouldShow_cases__samples__portions__slides__percent_tumor_cells: false,
  shouldShow_cases__samples__portions__slides__percent_tumor_nuclei: false,
  shouldShow_cases__samples__portions__slides__section_location: false,
  shouldShow_cases__samples__portions__slides__slide_id: false,
  shouldShow_cases__samples__portions__slides__state: false,
  shouldShow_cases__samples__portions__slides__submitter_id: false,
  shouldShow_cases__samples__portions__slides__updated_datetime: false,
  shouldShow_cases__samples__portions__state: false,
  shouldShow_cases__samples__portions__submitter_id: false,
  shouldShow_cases__samples__portions__updated_datetime: false,
  shouldShow_cases__samples__portions__weight: false,
  shouldShow_cases__samples__preservation_method: false,
  shouldShow_cases__samples__sample_id: false,
  shouldShow_cases__samples__sample_type: false,
  shouldShow_cases__samples__sample_type_id: false,
  shouldShow_cases__samples__shortest_dimension: false,
  shouldShow_cases__samples__state: false,
  shouldShow_cases__samples__submitter_id: false,
  shouldShow_cases__samples__time_between_clamping_and_freezing: false,
  shouldShow_cases__samples__time_between_excision_and_freezing: false,
  shouldShow_cases__samples__tissue_type: false,
  shouldShow_cases__samples__tumor_code: false,
  shouldShow_cases__samples__tumor_code_id: false,
  shouldShow_cases__samples__tumor_descriptor: false,
  shouldShow_cases__samples__updated_datetime: false,
  shouldShow_cases__slide_ids: false,
  shouldShow_cases__state: false,
  shouldShow_cases__submitter_aliquot_ids: false,
  shouldShow_cases__submitter_analyte_ids: false,
  shouldShow_cases__submitter_id: false,
  shouldShow_cases__submitter_portion_ids: false,
  shouldShow_cases__submitter_sample_ids: false,
  shouldShow_cases__submitter_slide_ids: false,
  shouldShow_cases__summary__data_categories__data_category: false,
  shouldShow_cases__summary__data_categories__file_count: false,
  shouldShow_cases__summary__experimental_strategies__experimental_strategy: false,
  shouldShow_cases__summary__experimental_strategies__file_count: false,
  shouldShow_cases__summary__file_count: false,
  shouldShow_cases__summary__file_size: false,
  shouldShow_cases__tissue_source_site__bcr_id: false,
  shouldShow_cases__tissue_source_site__code: false,
  shouldShow_cases__tissue_source_site__name: false,
  shouldShow_cases__tissue_source_site__project: false,
  shouldShow_cases__tissue_source_site__tissue_source_site_id: false,
  shouldShow_cases__updated_datetime: false,
  shouldShow_center__center_id: false,
  shouldShow_center__center_type: false,
  shouldShow_center__code: false,
  shouldShow_center__name: false,
  shouldShow_center__namespace: false,
  shouldShow_center__short_name: false,
  shouldShow_created_datetime: false,
  shouldShow_data_category: false,
  shouldShow_data_format: false,
  shouldShow_data_type: false,
  shouldShow_downstream_analyses__analysis_id: false,
  shouldShow_downstream_analyses__analysis_type: false,
  shouldShow_downstream_analyses__created_datetime: false,
  shouldShow_downstream_analyses__output_files__access: false,
  shouldShow_downstream_analyses__output_files__created_datetime: false,
  shouldShow_downstream_analyses__output_files__data_category: false,
  shouldShow_downstream_analyses__output_files__data_format: false,
  shouldShow_downstream_analyses__output_files__data_type: false,
  shouldShow_downstream_analyses__output_files__error_type: false,
  shouldShow_downstream_analyses__output_files__experimental_strategy: false,
  shouldShow_downstream_analyses__output_files__file_id: false,
  shouldShow_downstream_analyses__output_files__file_name: false,
  shouldShow_downstream_analyses__output_files__file_size: false,
  shouldShow_downstream_analyses__output_files__file_state: false,
  shouldShow_downstream_analyses__output_files__md5sum: false,
  shouldShow_downstream_analyses__output_files__platform: false,
  shouldShow_downstream_analyses__output_files__revision: false,
  shouldShow_downstream_analyses__output_files__state: false,
  shouldShow_downstream_analyses__output_files__state_comment: false,
  shouldShow_downstream_analyses__output_files__submitter_id: false,
  shouldShow_downstream_analyses__output_files__updated_datetime: false,
  shouldShow_downstream_analyses__state: false,
  shouldShow_downstream_analyses__submitter_id: false,
  shouldShow_downstream_analyses__updated_datetime: false,
  shouldShow_downstream_analyses__workflow_end_datetime: false,
  shouldShow_downstream_analyses__workflow_link: false,
  shouldShow_downstream_analyses__workflow_start_datetime: false,
  shouldShow_downstream_analyses__workflow_type: false,
  shouldShow_downstream_analyses__workflow_version: false,
  shouldShow_error_type: false,
  shouldShow_experimental_strategy: false,
  shouldShow_file_id: false,
  shouldShow_file_name: false,
  shouldShow_file_size: false,
  shouldShow_file_state: false,
  shouldShow_index_files__access: false,
  shouldShow_index_files__created_datetime: false,
  shouldShow_index_files__data_category: false,
  shouldShow_index_files__data_format: false,
  shouldShow_index_files__data_type: false,
  shouldShow_index_files__error_type: false,
  shouldShow_index_files__experimental_strategy: false,
  shouldShow_index_files__file_id: false,
  shouldShow_index_files__file_name: false,
  shouldShow_index_files__file_size: false,
  shouldShow_index_files__file_state: false,
  shouldShow_index_files__md5sum: false,
  shouldShow_index_files__platform: false,
  shouldShow_index_files__revision: false,
  shouldShow_index_files__state: false,
  shouldShow_index_files__state_comment: false,
  shouldShow_index_files__submitter_id: false,
  shouldShow_index_files__updated_datetime: false,
  shouldShow_md5sum: false,
  shouldShow_metadata_files__access: false,
  shouldShow_metadata_files__created_datetime: false,
  shouldShow_metadata_files__data_category: false,
  shouldShow_metadata_files__data_format: false,
  shouldShow_metadata_files__data_type: false,
  shouldShow_metadata_files__error_type: false,
  shouldShow_metadata_files__file_id: false,
  shouldShow_metadata_files__file_name: false,
  shouldShow_metadata_files__file_size: false,
  shouldShow_metadata_files__file_state: false,
  shouldShow_metadata_files__md5sum: false,
  shouldShow_metadata_files__state: false,
  shouldShow_metadata_files__state_comment: false,
  shouldShow_metadata_files__submitter_id: false,
  shouldShow_metadata_files__type: false,
  shouldShow_metadata_files__updated_datetime: false,
  shouldShow_origin: false,
  shouldShow_platform: false,
  shouldShow_revision: false,
  shouldShow_state: false,
  shouldShow_state_comment: false,
  shouldShow_submitter_id: false,
  shouldShow_tags: false,
  shouldShow_type: false,
  shouldShow_updated_datetime: false,
};

export const repositoryFileAggregationsFragment = () => Relay.QL`
  fragment on FileAggregations {
    
access @include(if: $shouldShow_access) {
  
      buckets {
        doc_count
        key
      }
      
}

acl @include(if: $shouldShow_acl) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__analysis_id @include(if: $shouldShow_analysis__analysis_id) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__analysis_type @include(if: $shouldShow_analysis__analysis_type) {
  
      buckets {
        doc_count
        key
      }
      
}


analysis__input_files__access @include(if: $shouldShow_analysis__input_files__access) {
  
      buckets {
        doc_count
        key
      }
      
}


analysis__input_files__data_category @include(if: $shouldShow_analysis__input_files__data_category) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__input_files__data_format @include(if: $shouldShow_analysis__input_files__data_format) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__input_files__data_type @include(if: $shouldShow_analysis__input_files__data_type) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__input_files__error_type @include(if: $shouldShow_analysis__input_files__error_type) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__input_files__experimental_strategy @include(if: $shouldShow_analysis__input_files__experimental_strategy) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__input_files__file_id @include(if: $shouldShow_analysis__input_files__file_id) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__input_files__file_name @include(if: $shouldShow_analysis__input_files__file_name) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__input_files__file_size @include(if: $shouldShow_analysis__input_files__file_size) {
  
      count
      max
      avg
      min
    
}

analysis__input_files__file_state @include(if: $shouldShow_analysis__input_files__file_state) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__input_files__md5sum @include(if: $shouldShow_analysis__input_files__md5sum) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__input_files__platform @include(if: $shouldShow_analysis__input_files__platform) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__input_files__revision @include(if: $shouldShow_analysis__input_files__revision) {
  
      count
      max
      avg
      min
    
}

analysis__input_files__state @include(if: $shouldShow_analysis__input_files__state) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__input_files__state_comment @include(if: $shouldShow_analysis__input_files__state_comment) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__input_files__submitter_id @include(if: $shouldShow_analysis__input_files__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}


analysis__metadata__read_groups__RIN @include(if: $shouldShow_analysis__metadata__read_groups__RIN) {
  
      count
      max
      avg
      min
    
}

analysis__metadata__read_groups__adapter_name @include(if: $shouldShow_analysis__metadata__read_groups__adapter_name) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__adapter_sequence @include(if: $shouldShow_analysis__metadata__read_groups__adapter_sequence) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__base_caller_name @include(if: $shouldShow_analysis__metadata__read_groups__base_caller_name) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__base_caller_version @include(if: $shouldShow_analysis__metadata__read_groups__base_caller_version) {
  
      buckets {
        doc_count
        key
      }
      
}


analysis__metadata__read_groups__experiment_name @include(if: $shouldShow_analysis__metadata__read_groups__experiment_name) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__flow_cell_barcode @include(if: $shouldShow_analysis__metadata__read_groups__flow_cell_barcode) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__includes_spike_ins @include(if: $shouldShow_analysis__metadata__read_groups__includes_spike_ins) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__instrument_model @include(if: $shouldShow_analysis__metadata__read_groups__instrument_model) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__is_paired_end @include(if: $shouldShow_analysis__metadata__read_groups__is_paired_end) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__library_name @include(if: $shouldShow_analysis__metadata__read_groups__library_name) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__library_preparation_kit_catalog_number @include(if: $shouldShow_analysis__metadata__read_groups__library_preparation_kit_catalog_number) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__library_preparation_kit_name @include(if: $shouldShow_analysis__metadata__read_groups__library_preparation_kit_name) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__library_preparation_kit_vendor @include(if: $shouldShow_analysis__metadata__read_groups__library_preparation_kit_vendor) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__library_preparation_kit_version @include(if: $shouldShow_analysis__metadata__read_groups__library_preparation_kit_version) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__library_selection @include(if: $shouldShow_analysis__metadata__read_groups__library_selection) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__library_strand @include(if: $shouldShow_analysis__metadata__read_groups__library_strand) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__library_strategy @include(if: $shouldShow_analysis__metadata__read_groups__library_strategy) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__platform @include(if: $shouldShow_analysis__metadata__read_groups__platform) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__read_group_id @include(if: $shouldShow_analysis__metadata__read_groups__read_group_id) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__read_group_name @include(if: $shouldShow_analysis__metadata__read_groups__read_group_name) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__read_group_qcs__adapter_content @include(if: $shouldShow_analysis__metadata__read_groups__read_group_qcs__adapter_content) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__read_group_qcs__basic_statistics @include(if: $shouldShow_analysis__metadata__read_groups__read_group_qcs__basic_statistics) {
  
      buckets {
        doc_count
        key
      }
      
}


analysis__metadata__read_groups__read_group_qcs__encoding @include(if: $shouldShow_analysis__metadata__read_groups__read_group_qcs__encoding) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__read_group_qcs__fastq_name @include(if: $shouldShow_analysis__metadata__read_groups__read_group_qcs__fastq_name) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__read_group_qcs__kmer_content @include(if: $shouldShow_analysis__metadata__read_groups__read_group_qcs__kmer_content) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__read_group_qcs__overrepresented_sequences @include(if: $shouldShow_analysis__metadata__read_groups__read_group_qcs__overrepresented_sequences) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__read_group_qcs__per_base_n_content @include(if: $shouldShow_analysis__metadata__read_groups__read_group_qcs__per_base_n_content) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__read_group_qcs__per_base_sequence_content @include(if: $shouldShow_analysis__metadata__read_groups__read_group_qcs__per_base_sequence_content) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__read_group_qcs__per_base_sequence_quality @include(if: $shouldShow_analysis__metadata__read_groups__read_group_qcs__per_base_sequence_quality) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__read_group_qcs__per_sequence_gc_content @include(if: $shouldShow_analysis__metadata__read_groups__read_group_qcs__per_sequence_gc_content) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__read_group_qcs__per_sequence_quality_score @include(if: $shouldShow_analysis__metadata__read_groups__read_group_qcs__per_sequence_quality_score) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__read_group_qcs__per_tile_sequence_quality @include(if: $shouldShow_analysis__metadata__read_groups__read_group_qcs__per_tile_sequence_quality) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__read_group_qcs__percent_gc_content @include(if: $shouldShow_analysis__metadata__read_groups__read_group_qcs__percent_gc_content) {
  
      count
      max
      avg
      min
    
}

analysis__metadata__read_groups__read_group_qcs__read_group_qc_id @include(if: $shouldShow_analysis__metadata__read_groups__read_group_qcs__read_group_qc_id) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__read_group_qcs__sequence_duplication_levels @include(if: $shouldShow_analysis__metadata__read_groups__read_group_qcs__sequence_duplication_levels) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__read_group_qcs__sequence_length_distribution @include(if: $shouldShow_analysis__metadata__read_groups__read_group_qcs__sequence_length_distribution) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__read_group_qcs__state @include(if: $shouldShow_analysis__metadata__read_groups__read_group_qcs__state) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__read_group_qcs__submitter_id @include(if: $shouldShow_analysis__metadata__read_groups__read_group_qcs__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__read_group_qcs__total_sequences @include(if: $shouldShow_analysis__metadata__read_groups__read_group_qcs__total_sequences) {
  
      count
      max
      avg
      min
    
}



analysis__metadata__read_groups__read_group_qcs__workflow_link @include(if: $shouldShow_analysis__metadata__read_groups__read_group_qcs__workflow_link) {
  
      buckets {
        doc_count
        key
      }
      
}


analysis__metadata__read_groups__read_group_qcs__workflow_type @include(if: $shouldShow_analysis__metadata__read_groups__read_group_qcs__workflow_type) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__read_group_qcs__workflow_version @include(if: $shouldShow_analysis__metadata__read_groups__read_group_qcs__workflow_version) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__read_length @include(if: $shouldShow_analysis__metadata__read_groups__read_length) {
  
      count
      max
      avg
      min
    
}

analysis__metadata__read_groups__sequencing_center @include(if: $shouldShow_analysis__metadata__read_groups__sequencing_center) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__sequencing_date @include(if: $shouldShow_analysis__metadata__read_groups__sequencing_date) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__size_selection_range @include(if: $shouldShow_analysis__metadata__read_groups__size_selection_range) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__spike_ins_concentration @include(if: $shouldShow_analysis__metadata__read_groups__spike_ins_concentration) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__spike_ins_fasta @include(if: $shouldShow_analysis__metadata__read_groups__spike_ins_fasta) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__state @include(if: $shouldShow_analysis__metadata__read_groups__state) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__submitter_id @include(if: $shouldShow_analysis__metadata__read_groups__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__target_capture_kit_catalog_number @include(if: $shouldShow_analysis__metadata__read_groups__target_capture_kit_catalog_number) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__target_capture_kit_name @include(if: $shouldShow_analysis__metadata__read_groups__target_capture_kit_name) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__target_capture_kit_target_region @include(if: $shouldShow_analysis__metadata__read_groups__target_capture_kit_target_region) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__target_capture_kit_vendor @include(if: $shouldShow_analysis__metadata__read_groups__target_capture_kit_vendor) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__target_capture_kit_version @include(if: $shouldShow_analysis__metadata__read_groups__target_capture_kit_version) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__metadata__read_groups__to_trim_adapter_sequence @include(if: $shouldShow_analysis__metadata__read_groups__to_trim_adapter_sequence) {
  
      buckets {
        doc_count
        key
      }
      
}


analysis__state @include(if: $shouldShow_analysis__state) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__submitter_id @include(if: $shouldShow_analysis__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}



analysis__workflow_link @include(if: $shouldShow_analysis__workflow_link) {
  
      buckets {
        doc_count
        key
      }
      
}


analysis__workflow_type @include(if: $shouldShow_analysis__workflow_type) {
  
      buckets {
        doc_count
        key
      }
      
}

analysis__workflow_version @include(if: $shouldShow_analysis__workflow_version) {
  
      buckets {
        doc_count
        key
      }
      
}

annotations__annotation_id @include(if: $shouldShow_annotations__annotation_id) {
  
      buckets {
        doc_count
        key
      }
      
}

annotations__case_id @include(if: $shouldShow_annotations__case_id) {
  
      buckets {
        doc_count
        key
      }
      
}

annotations__case_submitter_id @include(if: $shouldShow_annotations__case_submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}

annotations__category @include(if: $shouldShow_annotations__category) {
  
      buckets {
        doc_count
        key
      }
      
}

annotations__classification @include(if: $shouldShow_annotations__classification) {
  
      buckets {
        doc_count
        key
      }
      
}


annotations__creator @include(if: $shouldShow_annotations__creator) {
  
      buckets {
        doc_count
        key
      }
      
}

annotations__entity_id @include(if: $shouldShow_annotations__entity_id) {
  
      buckets {
        doc_count
        key
      }
      
}

annotations__entity_submitter_id @include(if: $shouldShow_annotations__entity_submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}

annotations__entity_type @include(if: $shouldShow_annotations__entity_type) {
  
      buckets {
        doc_count
        key
      }
      
}



annotations__notes @include(if: $shouldShow_annotations__notes) {
  
      buckets {
        doc_count
        key
      }
      
}

annotations__state @include(if: $shouldShow_annotations__state) {
  
      buckets {
        doc_count
        key
      }
      
}

annotations__status @include(if: $shouldShow_annotations__status) {
  
      buckets {
        doc_count
        key
      }
      
}

annotations__submitter_id @include(if: $shouldShow_annotations__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}


archive__archive_id @include(if: $shouldShow_archive__archive_id) {
  
      buckets {
        doc_count
        key
      }
      
}


archive__data_category @include(if: $shouldShow_archive__data_category) {
  
      buckets {
        doc_count
        key
      }
      
}

archive__data_format @include(if: $shouldShow_archive__data_format) {
  
      buckets {
        doc_count
        key
      }
      
}

archive__data_type @include(if: $shouldShow_archive__data_type) {
  
      buckets {
        doc_count
        key
      }
      
}

archive__error_type @include(if: $shouldShow_archive__error_type) {
  
      buckets {
        doc_count
        key
      }
      
}

archive__file_name @include(if: $shouldShow_archive__file_name) {
  
      buckets {
        doc_count
        key
      }
      
}

archive__file_size @include(if: $shouldShow_archive__file_size) {
  
      count
      max
      avg
      min
    
}

archive__file_state @include(if: $shouldShow_archive__file_state) {
  
      buckets {
        doc_count
        key
      }
      
}

archive__md5sum @include(if: $shouldShow_archive__md5sum) {
  
      buckets {
        doc_count
        key
      }
      
}

archive__revision @include(if: $shouldShow_archive__revision) {
  
      count
      max
      avg
      min
    
}

archive__state @include(if: $shouldShow_archive__state) {
  
      buckets {
        doc_count
        key
      }
      
}

archive__state_comment @include(if: $shouldShow_archive__state_comment) {
  
      buckets {
        doc_count
        key
      }
      
}

archive__submitter_id @include(if: $shouldShow_archive__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}


associated_entities__case_id @include(if: $shouldShow_associated_entities__case_id) {
  
      buckets {
        doc_count
        key
      }
      
}

associated_entities__entity_id @include(if: $shouldShow_associated_entities__entity_id) {
  
      buckets {
        doc_count
        key
      }
      
}

associated_entities__entity_submitter_id @include(if: $shouldShow_associated_entities__entity_submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}

associated_entities__entity_type @include(if: $shouldShow_associated_entities__entity_type) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__aliquot_ids @include(if: $shouldShow_cases__aliquot_ids) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__analyte_ids @include(if: $shouldShow_cases__analyte_ids) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__annotations__annotation_id @include(if: $shouldShow_cases__annotations__annotation_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__annotations__case_id @include(if: $shouldShow_cases__annotations__case_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__annotations__case_submitter_id @include(if: $shouldShow_cases__annotations__case_submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__annotations__category @include(if: $shouldShow_cases__annotations__category) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__annotations__classification @include(if: $shouldShow_cases__annotations__classification) {
  
      buckets {
        doc_count
        key
      }
      
}


cases__annotations__creator @include(if: $shouldShow_cases__annotations__creator) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__annotations__entity_id @include(if: $shouldShow_cases__annotations__entity_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__annotations__entity_submitter_id @include(if: $shouldShow_cases__annotations__entity_submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__annotations__entity_type @include(if: $shouldShow_cases__annotations__entity_type) {
  
      buckets {
        doc_count
        key
      }
      
}



cases__annotations__notes @include(if: $shouldShow_cases__annotations__notes) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__annotations__state @include(if: $shouldShow_cases__annotations__state) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__annotations__status @include(if: $shouldShow_cases__annotations__status) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__annotations__submitter_id @include(if: $shouldShow_cases__annotations__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}


cases__case_id @include(if: $shouldShow_cases__case_id) {
  
      buckets {
        doc_count
        key
      }
      
}


cases__days_to_index @include(if: $shouldShow_cases__days_to_index) {
  
      count
      max
      avg
      min
    
}


cases__demographic__demographic_id @include(if: $shouldShow_cases__demographic__demographic_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__demographic__ethnicity @include(if: $shouldShow_cases__demographic__ethnicity) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__demographic__gender @include(if: $shouldShow_cases__demographic__gender) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__demographic__race @include(if: $shouldShow_cases__demographic__race) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__demographic__state @include(if: $shouldShow_cases__demographic__state) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__demographic__submitter_id @include(if: $shouldShow_cases__demographic__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}


cases__demographic__year_of_birth @include(if: $shouldShow_cases__demographic__year_of_birth) {
  
      count
      max
      avg
      min
    
}

cases__demographic__year_of_death @include(if: $shouldShow_cases__demographic__year_of_death) {
  
      count
      max
      avg
      min
    
}

cases__diagnoses__age_at_diagnosis @include(if: $shouldShow_cases__diagnoses__age_at_diagnosis) {
  
      count
      max
      avg
      min
    
}

cases__diagnoses__ajcc_clinical_m @include(if: $shouldShow_cases__diagnoses__ajcc_clinical_m) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__ajcc_clinical_n @include(if: $shouldShow_cases__diagnoses__ajcc_clinical_n) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__ajcc_clinical_stage @include(if: $shouldShow_cases__diagnoses__ajcc_clinical_stage) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__ajcc_clinical_t @include(if: $shouldShow_cases__diagnoses__ajcc_clinical_t) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__ajcc_pathologic_m @include(if: $shouldShow_cases__diagnoses__ajcc_pathologic_m) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__ajcc_pathologic_n @include(if: $shouldShow_cases__diagnoses__ajcc_pathologic_n) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__ajcc_pathologic_stage @include(if: $shouldShow_cases__diagnoses__ajcc_pathologic_stage) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__ajcc_pathologic_t @include(if: $shouldShow_cases__diagnoses__ajcc_pathologic_t) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__ann_arbor_b_symptoms @include(if: $shouldShow_cases__diagnoses__ann_arbor_b_symptoms) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__ann_arbor_clinical_stage @include(if: $shouldShow_cases__diagnoses__ann_arbor_clinical_stage) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__ann_arbor_extranodal_involvement @include(if: $shouldShow_cases__diagnoses__ann_arbor_extranodal_involvement) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__ann_arbor_pathologic_stage @include(if: $shouldShow_cases__diagnoses__ann_arbor_pathologic_stage) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__burkitt_lymphoma_clinical_variant @include(if: $shouldShow_cases__diagnoses__burkitt_lymphoma_clinical_variant) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__cause_of_death @include(if: $shouldShow_cases__diagnoses__cause_of_death) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__circumferential_resection_margin @include(if: $shouldShow_cases__diagnoses__circumferential_resection_margin) {
  
      count
      max
      avg
      min
    
}

cases__diagnoses__classification_of_tumor @include(if: $shouldShow_cases__diagnoses__classification_of_tumor) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__colon_polyps_history @include(if: $shouldShow_cases__diagnoses__colon_polyps_history) {
  
      buckets {
        doc_count
        key
      }
      
}


cases__diagnoses__days_to_birth @include(if: $shouldShow_cases__diagnoses__days_to_birth) {
  
      count
      max
      avg
      min
    
}

cases__diagnoses__days_to_death @include(if: $shouldShow_cases__diagnoses__days_to_death) {
  
      count
      max
      avg
      min
    
}

cases__diagnoses__days_to_hiv_diagnosis @include(if: $shouldShow_cases__diagnoses__days_to_hiv_diagnosis) {
  
      count
      max
      avg
      min
    
}

cases__diagnoses__days_to_last_follow_up @include(if: $shouldShow_cases__diagnoses__days_to_last_follow_up) {
  
      count
      max
      avg
      min
    
}

cases__diagnoses__days_to_last_known_disease_status @include(if: $shouldShow_cases__diagnoses__days_to_last_known_disease_status) {
  
      count
      max
      avg
      min
    
}

cases__diagnoses__days_to_new_event @include(if: $shouldShow_cases__diagnoses__days_to_new_event) {
  
      count
      max
      avg
      min
    
}

cases__diagnoses__days_to_recurrence @include(if: $shouldShow_cases__diagnoses__days_to_recurrence) {
  
      count
      max
      avg
      min
    
}

cases__diagnoses__diagnosis_id @include(if: $shouldShow_cases__diagnoses__diagnosis_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__figo_stage @include(if: $shouldShow_cases__diagnoses__figo_stage) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__hiv_positive @include(if: $shouldShow_cases__diagnoses__hiv_positive) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__hpv_positive_type @include(if: $shouldShow_cases__diagnoses__hpv_positive_type) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__hpv_status @include(if: $shouldShow_cases__diagnoses__hpv_status) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__last_known_disease_status @include(if: $shouldShow_cases__diagnoses__last_known_disease_status) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__laterality @include(if: $shouldShow_cases__diagnoses__laterality) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__ldh_level_at_diagnosis @include(if: $shouldShow_cases__diagnoses__ldh_level_at_diagnosis) {
  
      count
      max
      avg
      min
    
}

cases__diagnoses__ldh_normal_range_upper @include(if: $shouldShow_cases__diagnoses__ldh_normal_range_upper) {
  
      count
      max
      avg
      min
    
}

cases__diagnoses__lymph_nodes_positive @include(if: $shouldShow_cases__diagnoses__lymph_nodes_positive) {
  
      count
      max
      avg
      min
    
}

cases__diagnoses__lymphatic_invasion_present @include(if: $shouldShow_cases__diagnoses__lymphatic_invasion_present) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__method_of_diagnosis @include(if: $shouldShow_cases__diagnoses__method_of_diagnosis) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__morphology @include(if: $shouldShow_cases__diagnoses__morphology) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__new_event_anatomic_site @include(if: $shouldShow_cases__diagnoses__new_event_anatomic_site) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__new_event_type @include(if: $shouldShow_cases__diagnoses__new_event_type) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__perineural_invasion_present @include(if: $shouldShow_cases__diagnoses__perineural_invasion_present) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__primary_diagnosis @include(if: $shouldShow_cases__diagnoses__primary_diagnosis) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__prior_malignancy @include(if: $shouldShow_cases__diagnoses__prior_malignancy) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__prior_treatment @include(if: $shouldShow_cases__diagnoses__prior_treatment) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__progression_or_recurrence @include(if: $shouldShow_cases__diagnoses__progression_or_recurrence) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__residual_disease @include(if: $shouldShow_cases__diagnoses__residual_disease) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__site_of_resection_or_biopsy @include(if: $shouldShow_cases__diagnoses__site_of_resection_or_biopsy) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__state @include(if: $shouldShow_cases__diagnoses__state) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__submitter_id @include(if: $shouldShow_cases__diagnoses__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__tissue_or_organ_of_origin @include(if: $shouldShow_cases__diagnoses__tissue_or_organ_of_origin) {
  
      buckets {
        doc_count
        key
      }
      
}


cases__diagnoses__treatments__days_to_treatment @include(if: $shouldShow_cases__diagnoses__treatments__days_to_treatment) {
  
      count
      max
      avg
      min
    
}

cases__diagnoses__treatments__days_to_treatment_end @include(if: $shouldShow_cases__diagnoses__treatments__days_to_treatment_end) {
  
      count
      max
      avg
      min
    
}

cases__diagnoses__treatments__days_to_treatment_start @include(if: $shouldShow_cases__diagnoses__treatments__days_to_treatment_start) {
  
      count
      max
      avg
      min
    
}

cases__diagnoses__treatments__state @include(if: $shouldShow_cases__diagnoses__treatments__state) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__treatments__submitter_id @include(if: $shouldShow_cases__diagnoses__treatments__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__treatments__therapeutic_agents @include(if: $shouldShow_cases__diagnoses__treatments__therapeutic_agents) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__treatments__treatment_anatomic_site @include(if: $shouldShow_cases__diagnoses__treatments__treatment_anatomic_site) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__treatments__treatment_id @include(if: $shouldShow_cases__diagnoses__treatments__treatment_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__treatments__treatment_intent_type @include(if: $shouldShow_cases__diagnoses__treatments__treatment_intent_type) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__treatments__treatment_or_therapy @include(if: $shouldShow_cases__diagnoses__treatments__treatment_or_therapy) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__treatments__treatment_outcome @include(if: $shouldShow_cases__diagnoses__treatments__treatment_outcome) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__treatments__treatment_type @include(if: $shouldShow_cases__diagnoses__treatments__treatment_type) {
  
      buckets {
        doc_count
        key
      }
      
}


cases__diagnoses__tumor_grade @include(if: $shouldShow_cases__diagnoses__tumor_grade) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__tumor_stage @include(if: $shouldShow_cases__diagnoses__tumor_stage) {
  
      buckets {
        doc_count
        key
      }
      
}


cases__diagnoses__vascular_invasion_present @include(if: $shouldShow_cases__diagnoses__vascular_invasion_present) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__vital_status @include(if: $shouldShow_cases__diagnoses__vital_status) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__diagnoses__year_of_diagnosis @include(if: $shouldShow_cases__diagnoses__year_of_diagnosis) {
  
      count
      max
      avg
      min
    
}

cases__disease_type @include(if: $shouldShow_cases__disease_type) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__exposures__alcohol_history @include(if: $shouldShow_cases__exposures__alcohol_history) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__exposures__alcohol_intensity @include(if: $shouldShow_cases__exposures__alcohol_intensity) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__exposures__bmi @include(if: $shouldShow_cases__exposures__bmi) {
  
      count
      max
      avg
      min
    
}

cases__exposures__cigarettes_per_day @include(if: $shouldShow_cases__exposures__cigarettes_per_day) {
  
      count
      max
      avg
      min
    
}


cases__exposures__exposure_id @include(if: $shouldShow_cases__exposures__exposure_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__exposures__height @include(if: $shouldShow_cases__exposures__height) {
  
      count
      max
      avg
      min
    
}

cases__exposures__pack_years_smoked @include(if: $shouldShow_cases__exposures__pack_years_smoked) {
  
      count
      max
      avg
      min
    
}

cases__exposures__state @include(if: $shouldShow_cases__exposures__state) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__exposures__submitter_id @include(if: $shouldShow_cases__exposures__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__exposures__tobacco_smoking_onset_year @include(if: $shouldShow_cases__exposures__tobacco_smoking_onset_year) {
  
      count
      max
      avg
      min
    
}

cases__exposures__tobacco_smoking_quit_year @include(if: $shouldShow_cases__exposures__tobacco_smoking_quit_year) {
  
      count
      max
      avg
      min
    
}

cases__exposures__tobacco_smoking_status @include(if: $shouldShow_cases__exposures__tobacco_smoking_status) {
  
      buckets {
        doc_count
        key
      }
      
}


cases__exposures__weight @include(if: $shouldShow_cases__exposures__weight) {
  
      count
      max
      avg
      min
    
}

cases__exposures__years_smoked @include(if: $shouldShow_cases__exposures__years_smoked) {
  
      count
      max
      avg
      min
    
}


cases__family_histories__family_history_id @include(if: $shouldShow_cases__family_histories__family_history_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__family_histories__relationship_age_at_diagnosis @include(if: $shouldShow_cases__family_histories__relationship_age_at_diagnosis) {
  
      count
      max
      avg
      min
    
}

cases__family_histories__relationship_gender @include(if: $shouldShow_cases__family_histories__relationship_gender) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__family_histories__relationship_primary_diagnosis @include(if: $shouldShow_cases__family_histories__relationship_primary_diagnosis) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__family_histories__relationship_type @include(if: $shouldShow_cases__family_histories__relationship_type) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__family_histories__relative_with_cancer_history @include(if: $shouldShow_cases__family_histories__relative_with_cancer_history) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__family_histories__state @include(if: $shouldShow_cases__family_histories__state) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__family_histories__submitter_id @include(if: $shouldShow_cases__family_histories__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}


cases__portion_ids @include(if: $shouldShow_cases__portion_ids) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__primary_site @include(if: $shouldShow_cases__primary_site) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__project__dbgap_accession_number @include(if: $shouldShow_cases__project__dbgap_accession_number) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__project__disease_type @include(if: $shouldShow_cases__project__disease_type) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__project__intended_release_date @include(if: $shouldShow_cases__project__intended_release_date) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__project__name @include(if: $shouldShow_cases__project__name) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__project__primary_site @include(if: $shouldShow_cases__project__primary_site) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__project__program__dbgap_accession_number @include(if: $shouldShow_cases__project__program__dbgap_accession_number) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__project__program__name @include(if: $shouldShow_cases__project__program__name) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__project__program__program_id @include(if: $shouldShow_cases__project__program__program_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__project__project_id @include(if: $shouldShow_cases__project__project_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__project__releasable @include(if: $shouldShow_cases__project__releasable) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__project__released @include(if: $shouldShow_cases__project__released) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__project__state @include(if: $shouldShow_cases__project__state) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__sample_ids @include(if: $shouldShow_cases__sample_ids) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__annotations__annotation_id @include(if: $shouldShow_cases__samples__annotations__annotation_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__annotations__case_id @include(if: $shouldShow_cases__samples__annotations__case_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__annotations__case_submitter_id @include(if: $shouldShow_cases__samples__annotations__case_submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__annotations__category @include(if: $shouldShow_cases__samples__annotations__category) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__annotations__classification @include(if: $shouldShow_cases__samples__annotations__classification) {
  
      buckets {
        doc_count
        key
      }
      
}


cases__samples__annotations__creator @include(if: $shouldShow_cases__samples__annotations__creator) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__annotations__entity_id @include(if: $shouldShow_cases__samples__annotations__entity_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__annotations__entity_submitter_id @include(if: $shouldShow_cases__samples__annotations__entity_submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__annotations__entity_type @include(if: $shouldShow_cases__samples__annotations__entity_type) {
  
      buckets {
        doc_count
        key
      }
      
}



cases__samples__annotations__notes @include(if: $shouldShow_cases__samples__annotations__notes) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__annotations__state @include(if: $shouldShow_cases__samples__annotations__state) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__annotations__status @include(if: $shouldShow_cases__samples__annotations__status) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__annotations__submitter_id @include(if: $shouldShow_cases__samples__annotations__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}


cases__samples__biospecimen_anatomic_site @include(if: $shouldShow_cases__samples__biospecimen_anatomic_site) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__composition @include(if: $shouldShow_cases__samples__composition) {
  
      buckets {
        doc_count
        key
      }
      
}


cases__samples__current_weight @include(if: $shouldShow_cases__samples__current_weight) {
  
      count
      max
      avg
      min
    
}

cases__samples__days_to_collection @include(if: $shouldShow_cases__samples__days_to_collection) {
  
      count
      max
      avg
      min
    
}

cases__samples__days_to_sample_procurement @include(if: $shouldShow_cases__samples__days_to_sample_procurement) {
  
      count
      max
      avg
      min
    
}

cases__samples__diagnosis_pathologically_confirmed @include(if: $shouldShow_cases__samples__diagnosis_pathologically_confirmed) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__freezing_method @include(if: $shouldShow_cases__samples__freezing_method) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__initial_weight @include(if: $shouldShow_cases__samples__initial_weight) {
  
      count
      max
      avg
      min
    
}

cases__samples__intermediate_dimension @include(if: $shouldShow_cases__samples__intermediate_dimension) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__is_ffpe @include(if: $shouldShow_cases__samples__is_ffpe) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__longest_dimension @include(if: $shouldShow_cases__samples__longest_dimension) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__method_of_sample_procurement @include(if: $shouldShow_cases__samples__method_of_sample_procurement) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__oct_embedded @include(if: $shouldShow_cases__samples__oct_embedded) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__pathology_report_uuid @include(if: $shouldShow_cases__samples__pathology_report_uuid) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__a260_a280_ratio @include(if: $shouldShow_cases__samples__portions__analytes__a260_a280_ratio) {
  
      count
      max
      avg
      min
    
}

cases__samples__portions__analytes__aliquots__aliquot_id @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__aliquot_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__aliquots__aliquot_quantity @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__aliquot_quantity) {
  
      count
      max
      avg
      min
    
}

cases__samples__portions__analytes__aliquots__aliquot_volume @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__aliquot_volume) {
  
      count
      max
      avg
      min
    
}

cases__samples__portions__analytes__aliquots__amount @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__amount) {
  
      count
      max
      avg
      min
    
}

cases__samples__portions__analytes__aliquots__analyte_type @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__analyte_type) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__aliquots__analyte_type_id @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__analyte_type_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__aliquots__annotations__annotation_id @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__annotations__annotation_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__aliquots__annotations__case_id @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__annotations__case_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__aliquots__annotations__case_submitter_id @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__annotations__case_submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__aliquots__annotations__category @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__annotations__category) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__aliquots__annotations__classification @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__annotations__classification) {
  
      buckets {
        doc_count
        key
      }
      
}


cases__samples__portions__analytes__aliquots__annotations__creator @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__annotations__creator) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__aliquots__annotations__entity_id @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__annotations__entity_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__aliquots__annotations__entity_submitter_id @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__annotations__entity_submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__aliquots__annotations__entity_type @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__annotations__entity_type) {
  
      buckets {
        doc_count
        key
      }
      
}



cases__samples__portions__analytes__aliquots__annotations__notes @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__annotations__notes) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__aliquots__annotations__state @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__annotations__state) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__aliquots__annotations__status @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__annotations__status) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__aliquots__annotations__submitter_id @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__annotations__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}


cases__samples__portions__analytes__aliquots__center__center_id @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__center__center_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__aliquots__center__center_type @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__center__center_type) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__aliquots__center__code @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__center__code) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__aliquots__center__name @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__center__name) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__aliquots__center__namespace @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__center__namespace) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__aliquots__center__short_name @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__center__short_name) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__aliquots__concentration @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__concentration) {
  
      count
      max
      avg
      min
    
}


cases__samples__portions__analytes__aliquots__source_center @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__source_center) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__aliquots__state @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__state) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__aliquots__submitter_id @include(if: $shouldShow_cases__samples__portions__analytes__aliquots__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}


cases__samples__portions__analytes__amount @include(if: $shouldShow_cases__samples__portions__analytes__amount) {
  
      count
      max
      avg
      min
    
}

cases__samples__portions__analytes__analyte_id @include(if: $shouldShow_cases__samples__portions__analytes__analyte_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__analyte_quantity @include(if: $shouldShow_cases__samples__portions__analytes__analyte_quantity) {
  
      count
      max
      avg
      min
    
}

cases__samples__portions__analytes__analyte_type @include(if: $shouldShow_cases__samples__portions__analytes__analyte_type) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__analyte_type_id @include(if: $shouldShow_cases__samples__portions__analytes__analyte_type_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__analyte_volume @include(if: $shouldShow_cases__samples__portions__analytes__analyte_volume) {
  
      count
      max
      avg
      min
    
}

cases__samples__portions__analytes__annotations__annotation_id @include(if: $shouldShow_cases__samples__portions__analytes__annotations__annotation_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__annotations__case_id @include(if: $shouldShow_cases__samples__portions__analytes__annotations__case_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__annotations__case_submitter_id @include(if: $shouldShow_cases__samples__portions__analytes__annotations__case_submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__annotations__category @include(if: $shouldShow_cases__samples__portions__analytes__annotations__category) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__annotations__classification @include(if: $shouldShow_cases__samples__portions__analytes__annotations__classification) {
  
      buckets {
        doc_count
        key
      }
      
}


cases__samples__portions__analytes__annotations__creator @include(if: $shouldShow_cases__samples__portions__analytes__annotations__creator) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__annotations__entity_id @include(if: $shouldShow_cases__samples__portions__analytes__annotations__entity_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__annotations__entity_submitter_id @include(if: $shouldShow_cases__samples__portions__analytes__annotations__entity_submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__annotations__entity_type @include(if: $shouldShow_cases__samples__portions__analytes__annotations__entity_type) {
  
      buckets {
        doc_count
        key
      }
      
}



cases__samples__portions__analytes__annotations__notes @include(if: $shouldShow_cases__samples__portions__analytes__annotations__notes) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__annotations__state @include(if: $shouldShow_cases__samples__portions__analytes__annotations__state) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__annotations__status @include(if: $shouldShow_cases__samples__portions__analytes__annotations__status) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__annotations__submitter_id @include(if: $shouldShow_cases__samples__portions__analytes__annotations__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}


cases__samples__portions__analytes__concentration @include(if: $shouldShow_cases__samples__portions__analytes__concentration) {
  
      count
      max
      avg
      min
    
}


cases__samples__portions__analytes__normal_tumor_genotype_snp_match @include(if: $shouldShow_cases__samples__portions__analytes__normal_tumor_genotype_snp_match) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__ribosomal_rna_28s_16s_ratio @include(if: $shouldShow_cases__samples__portions__analytes__ribosomal_rna_28s_16s_ratio) {
  
      count
      max
      avg
      min
    
}

cases__samples__portions__analytes__spectrophotometer_method @include(if: $shouldShow_cases__samples__portions__analytes__spectrophotometer_method) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__state @include(if: $shouldShow_cases__samples__portions__analytes__state) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__analytes__submitter_id @include(if: $shouldShow_cases__samples__portions__analytes__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}


cases__samples__portions__analytes__well_number @include(if: $shouldShow_cases__samples__portions__analytes__well_number) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__annotations__annotation_id @include(if: $shouldShow_cases__samples__portions__annotations__annotation_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__annotations__case_id @include(if: $shouldShow_cases__samples__portions__annotations__case_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__annotations__case_submitter_id @include(if: $shouldShow_cases__samples__portions__annotations__case_submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__annotations__category @include(if: $shouldShow_cases__samples__portions__annotations__category) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__annotations__classification @include(if: $shouldShow_cases__samples__portions__annotations__classification) {
  
      buckets {
        doc_count
        key
      }
      
}


cases__samples__portions__annotations__creator @include(if: $shouldShow_cases__samples__portions__annotations__creator) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__annotations__entity_id @include(if: $shouldShow_cases__samples__portions__annotations__entity_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__annotations__entity_submitter_id @include(if: $shouldShow_cases__samples__portions__annotations__entity_submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__annotations__entity_type @include(if: $shouldShow_cases__samples__portions__annotations__entity_type) {
  
      buckets {
        doc_count
        key
      }
      
}



cases__samples__portions__annotations__notes @include(if: $shouldShow_cases__samples__portions__annotations__notes) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__annotations__state @include(if: $shouldShow_cases__samples__portions__annotations__state) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__annotations__status @include(if: $shouldShow_cases__samples__portions__annotations__status) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__annotations__submitter_id @include(if: $shouldShow_cases__samples__portions__annotations__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}


cases__samples__portions__center__center_id @include(if: $shouldShow_cases__samples__portions__center__center_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__center__center_type @include(if: $shouldShow_cases__samples__portions__center__center_type) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__center__code @include(if: $shouldShow_cases__samples__portions__center__code) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__center__name @include(if: $shouldShow_cases__samples__portions__center__name) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__center__namespace @include(if: $shouldShow_cases__samples__portions__center__namespace) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__center__short_name @include(if: $shouldShow_cases__samples__portions__center__short_name) {
  
      buckets {
        doc_count
        key
      }
      
}



cases__samples__portions__is_ffpe @include(if: $shouldShow_cases__samples__portions__is_ffpe) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__portion_id @include(if: $shouldShow_cases__samples__portions__portion_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__portion_number @include(if: $shouldShow_cases__samples__portions__portion_number) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__slides__annotations__annotation_id @include(if: $shouldShow_cases__samples__portions__slides__annotations__annotation_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__slides__annotations__case_id @include(if: $shouldShow_cases__samples__portions__slides__annotations__case_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__slides__annotations__case_submitter_id @include(if: $shouldShow_cases__samples__portions__slides__annotations__case_submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__slides__annotations__category @include(if: $shouldShow_cases__samples__portions__slides__annotations__category) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__slides__annotations__classification @include(if: $shouldShow_cases__samples__portions__slides__annotations__classification) {
  
      buckets {
        doc_count
        key
      }
      
}


cases__samples__portions__slides__annotations__creator @include(if: $shouldShow_cases__samples__portions__slides__annotations__creator) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__slides__annotations__entity_id @include(if: $shouldShow_cases__samples__portions__slides__annotations__entity_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__slides__annotations__entity_submitter_id @include(if: $shouldShow_cases__samples__portions__slides__annotations__entity_submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__slides__annotations__entity_type @include(if: $shouldShow_cases__samples__portions__slides__annotations__entity_type) {
  
      buckets {
        doc_count
        key
      }
      
}



cases__samples__portions__slides__annotations__notes @include(if: $shouldShow_cases__samples__portions__slides__annotations__notes) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__slides__annotations__state @include(if: $shouldShow_cases__samples__portions__slides__annotations__state) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__slides__annotations__status @include(if: $shouldShow_cases__samples__portions__slides__annotations__status) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__slides__annotations__submitter_id @include(if: $shouldShow_cases__samples__portions__slides__annotations__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}



cases__samples__portions__slides__number_proliferating_cells @include(if: $shouldShow_cases__samples__portions__slides__number_proliferating_cells) {
  
      count
      max
      avg
      min
    
}

cases__samples__portions__slides__percent_eosinophil_infiltration @include(if: $shouldShow_cases__samples__portions__slides__percent_eosinophil_infiltration) {
  
      count
      max
      avg
      min
    
}

cases__samples__portions__slides__percent_granulocyte_infiltration @include(if: $shouldShow_cases__samples__portions__slides__percent_granulocyte_infiltration) {
  
      count
      max
      avg
      min
    
}

cases__samples__portions__slides__percent_inflam_infiltration @include(if: $shouldShow_cases__samples__portions__slides__percent_inflam_infiltration) {
  
      count
      max
      avg
      min
    
}

cases__samples__portions__slides__percent_lymphocyte_infiltration @include(if: $shouldShow_cases__samples__portions__slides__percent_lymphocyte_infiltration) {
  
      count
      max
      avg
      min
    
}

cases__samples__portions__slides__percent_monocyte_infiltration @include(if: $shouldShow_cases__samples__portions__slides__percent_monocyte_infiltration) {
  
      count
      max
      avg
      min
    
}

cases__samples__portions__slides__percent_necrosis @include(if: $shouldShow_cases__samples__portions__slides__percent_necrosis) {
  
      count
      max
      avg
      min
    
}

cases__samples__portions__slides__percent_neutrophil_infiltration @include(if: $shouldShow_cases__samples__portions__slides__percent_neutrophil_infiltration) {
  
      count
      max
      avg
      min
    
}

cases__samples__portions__slides__percent_normal_cells @include(if: $shouldShow_cases__samples__portions__slides__percent_normal_cells) {
  
      count
      max
      avg
      min
    
}

cases__samples__portions__slides__percent_stromal_cells @include(if: $shouldShow_cases__samples__portions__slides__percent_stromal_cells) {
  
      count
      max
      avg
      min
    
}

cases__samples__portions__slides__percent_tumor_cells @include(if: $shouldShow_cases__samples__portions__slides__percent_tumor_cells) {
  
      count
      max
      avg
      min
    
}

cases__samples__portions__slides__percent_tumor_nuclei @include(if: $shouldShow_cases__samples__portions__slides__percent_tumor_nuclei) {
  
      count
      max
      avg
      min
    
}

cases__samples__portions__slides__section_location @include(if: $shouldShow_cases__samples__portions__slides__section_location) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__slides__slide_id @include(if: $shouldShow_cases__samples__portions__slides__slide_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__slides__state @include(if: $shouldShow_cases__samples__portions__slides__state) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__slides__submitter_id @include(if: $shouldShow_cases__samples__portions__slides__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}


cases__samples__portions__state @include(if: $shouldShow_cases__samples__portions__state) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__portions__submitter_id @include(if: $shouldShow_cases__samples__portions__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}


cases__samples__portions__weight @include(if: $shouldShow_cases__samples__portions__weight) {
  
      count
      max
      avg
      min
    
}

cases__samples__preservation_method @include(if: $shouldShow_cases__samples__preservation_method) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__sample_id @include(if: $shouldShow_cases__samples__sample_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__sample_type @include(if: $shouldShow_cases__samples__sample_type) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__sample_type_id @include(if: $shouldShow_cases__samples__sample_type_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__shortest_dimension @include(if: $shouldShow_cases__samples__shortest_dimension) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__state @include(if: $shouldShow_cases__samples__state) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__submitter_id @include(if: $shouldShow_cases__samples__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__time_between_clamping_and_freezing @include(if: $shouldShow_cases__samples__time_between_clamping_and_freezing) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__time_between_excision_and_freezing @include(if: $shouldShow_cases__samples__time_between_excision_and_freezing) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__tissue_type @include(if: $shouldShow_cases__samples__tissue_type) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__tumor_code @include(if: $shouldShow_cases__samples__tumor_code) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__tumor_code_id @include(if: $shouldShow_cases__samples__tumor_code_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__samples__tumor_descriptor @include(if: $shouldShow_cases__samples__tumor_descriptor) {
  
      buckets {
        doc_count
        key
      }
      
}


cases__slide_ids @include(if: $shouldShow_cases__slide_ids) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__state @include(if: $shouldShow_cases__state) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__submitter_aliquot_ids @include(if: $shouldShow_cases__submitter_aliquot_ids) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__submitter_analyte_ids @include(if: $shouldShow_cases__submitter_analyte_ids) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__submitter_id @include(if: $shouldShow_cases__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__submitter_portion_ids @include(if: $shouldShow_cases__submitter_portion_ids) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__submitter_sample_ids @include(if: $shouldShow_cases__submitter_sample_ids) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__submitter_slide_ids @include(if: $shouldShow_cases__submitter_slide_ids) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__summary__data_categories__data_category @include(if: $shouldShow_cases__summary__data_categories__data_category) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__summary__data_categories__file_count @include(if: $shouldShow_cases__summary__data_categories__file_count) {
  
      count
      max
      avg
      min
    
}

cases__summary__experimental_strategies__experimental_strategy @include(if: $shouldShow_cases__summary__experimental_strategies__experimental_strategy) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__summary__experimental_strategies__file_count @include(if: $shouldShow_cases__summary__experimental_strategies__file_count) {
  
      count
      max
      avg
      min
    
}

cases__summary__file_count @include(if: $shouldShow_cases__summary__file_count) {
  
      count
      max
      avg
      min
    
}

cases__summary__file_size @include(if: $shouldShow_cases__summary__file_size) {
  
      count
      max
      avg
      min
    
}

cases__tissue_source_site__bcr_id @include(if: $shouldShow_cases__tissue_source_site__bcr_id) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__tissue_source_site__code @include(if: $shouldShow_cases__tissue_source_site__code) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__tissue_source_site__name @include(if: $shouldShow_cases__tissue_source_site__name) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__tissue_source_site__project @include(if: $shouldShow_cases__tissue_source_site__project) {
  
      buckets {
        doc_count
        key
      }
      
}

cases__tissue_source_site__tissue_source_site_id @include(if: $shouldShow_cases__tissue_source_site__tissue_source_site_id) {
  
      buckets {
        doc_count
        key
      }
      
}


center__center_id @include(if: $shouldShow_center__center_id) {
  
      buckets {
        doc_count
        key
      }
      
}

center__center_type @include(if: $shouldShow_center__center_type) {
  
      buckets {
        doc_count
        key
      }
      
}

center__code @include(if: $shouldShow_center__code) {
  
      buckets {
        doc_count
        key
      }
      
}

center__name @include(if: $shouldShow_center__name) {
  
      buckets {
        doc_count
        key
      }
      
}

center__namespace @include(if: $shouldShow_center__namespace) {
  
      buckets {
        doc_count
        key
      }
      
}

center__short_name @include(if: $shouldShow_center__short_name) {
  
      buckets {
        doc_count
        key
      }
      
}


data_category @include(if: $shouldShow_data_category) {
  
      buckets {
        doc_count
        key
      }
      
}

data_format @include(if: $shouldShow_data_format) {
  
      buckets {
        doc_count
        key
      }
      
}

data_type @include(if: $shouldShow_data_type) {
  
      buckets {
        doc_count
        key
      }
      
}

downstream_analyses__analysis_id @include(if: $shouldShow_downstream_analyses__analysis_id) {
  
      buckets {
        doc_count
        key
      }
      
}

downstream_analyses__analysis_type @include(if: $shouldShow_downstream_analyses__analysis_type) {
  
      buckets {
        doc_count
        key
      }
      
}


downstream_analyses__output_files__access @include(if: $shouldShow_downstream_analyses__output_files__access) {
  
      buckets {
        doc_count
        key
      }
      
}


downstream_analyses__output_files__data_category @include(if: $shouldShow_downstream_analyses__output_files__data_category) {
  
      buckets {
        doc_count
        key
      }
      
}

downstream_analyses__output_files__data_format @include(if: $shouldShow_downstream_analyses__output_files__data_format) {
  
      buckets {
        doc_count
        key
      }
      
}

downstream_analyses__output_files__data_type @include(if: $shouldShow_downstream_analyses__output_files__data_type) {
  
      buckets {
        doc_count
        key
      }
      
}

downstream_analyses__output_files__error_type @include(if: $shouldShow_downstream_analyses__output_files__error_type) {
  
      buckets {
        doc_count
        key
      }
      
}

downstream_analyses__output_files__experimental_strategy @include(if: $shouldShow_downstream_analyses__output_files__experimental_strategy) {
  
      buckets {
        doc_count
        key
      }
      
}

downstream_analyses__output_files__file_id @include(if: $shouldShow_downstream_analyses__output_files__file_id) {
  
      buckets {
        doc_count
        key
      }
      
}

downstream_analyses__output_files__file_name @include(if: $shouldShow_downstream_analyses__output_files__file_name) {
  
      buckets {
        doc_count
        key
      }
      
}

downstream_analyses__output_files__file_size @include(if: $shouldShow_downstream_analyses__output_files__file_size) {
  
      count
      max
      avg
      min
    
}

downstream_analyses__output_files__file_state @include(if: $shouldShow_downstream_analyses__output_files__file_state) {
  
      buckets {
        doc_count
        key
      }
      
}

downstream_analyses__output_files__md5sum @include(if: $shouldShow_downstream_analyses__output_files__md5sum) {
  
      buckets {
        doc_count
        key
      }
      
}

downstream_analyses__output_files__platform @include(if: $shouldShow_downstream_analyses__output_files__platform) {
  
      buckets {
        doc_count
        key
      }
      
}

downstream_analyses__output_files__revision @include(if: $shouldShow_downstream_analyses__output_files__revision) {
  
      count
      max
      avg
      min
    
}

downstream_analyses__output_files__state @include(if: $shouldShow_downstream_analyses__output_files__state) {
  
      buckets {
        doc_count
        key
      }
      
}

downstream_analyses__output_files__state_comment @include(if: $shouldShow_downstream_analyses__output_files__state_comment) {
  
      buckets {
        doc_count
        key
      }
      
}

downstream_analyses__output_files__submitter_id @include(if: $shouldShow_downstream_analyses__output_files__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}


downstream_analyses__state @include(if: $shouldShow_downstream_analyses__state) {
  
      buckets {
        doc_count
        key
      }
      
}

downstream_analyses__submitter_id @include(if: $shouldShow_downstream_analyses__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}



downstream_analyses__workflow_link @include(if: $shouldShow_downstream_analyses__workflow_link) {
  
      buckets {
        doc_count
        key
      }
      
}


downstream_analyses__workflow_type @include(if: $shouldShow_downstream_analyses__workflow_type) {
  
      buckets {
        doc_count
        key
      }
      
}

downstream_analyses__workflow_version @include(if: $shouldShow_downstream_analyses__workflow_version) {
  
      buckets {
        doc_count
        key
      }
      
}

error_type @include(if: $shouldShow_error_type) {
  
      buckets {
        doc_count
        key
      }
      
}

experimental_strategy @include(if: $shouldShow_experimental_strategy) {
  
      buckets {
        doc_count
        key
      }
      
}

file_id @include(if: $shouldShow_file_id) {
  
      buckets {
        doc_count
        key
      }
      
}

file_name @include(if: $shouldShow_file_name) {
  
      buckets {
        doc_count
        key
      }
      
}

file_size @include(if: $shouldShow_file_size) {
  
      count
      max
      avg
      min
    
}

file_state @include(if: $shouldShow_file_state) {
  
      buckets {
        doc_count
        key
      }
      
}

index_files__access @include(if: $shouldShow_index_files__access) {
  
      buckets {
        doc_count
        key
      }
      
}


index_files__data_category @include(if: $shouldShow_index_files__data_category) {
  
      buckets {
        doc_count
        key
      }
      
}

index_files__data_format @include(if: $shouldShow_index_files__data_format) {
  
      buckets {
        doc_count
        key
      }
      
}

index_files__data_type @include(if: $shouldShow_index_files__data_type) {
  
      buckets {
        doc_count
        key
      }
      
}

index_files__error_type @include(if: $shouldShow_index_files__error_type) {
  
      buckets {
        doc_count
        key
      }
      
}

index_files__experimental_strategy @include(if: $shouldShow_index_files__experimental_strategy) {
  
      buckets {
        doc_count
        key
      }
      
}

index_files__file_id @include(if: $shouldShow_index_files__file_id) {
  
      buckets {
        doc_count
        key
      }
      
}

index_files__file_name @include(if: $shouldShow_index_files__file_name) {
  
      buckets {
        doc_count
        key
      }
      
}

index_files__file_size @include(if: $shouldShow_index_files__file_size) {
  
      count
      max
      avg
      min
    
}

index_files__file_state @include(if: $shouldShow_index_files__file_state) {
  
      buckets {
        doc_count
        key
      }
      
}

index_files__md5sum @include(if: $shouldShow_index_files__md5sum) {
  
      buckets {
        doc_count
        key
      }
      
}

index_files__platform @include(if: $shouldShow_index_files__platform) {
  
      buckets {
        doc_count
        key
      }
      
}

index_files__revision @include(if: $shouldShow_index_files__revision) {
  
      count
      max
      avg
      min
    
}

index_files__state @include(if: $shouldShow_index_files__state) {
  
      buckets {
        doc_count
        key
      }
      
}

index_files__state_comment @include(if: $shouldShow_index_files__state_comment) {
  
      buckets {
        doc_count
        key
      }
      
}

index_files__submitter_id @include(if: $shouldShow_index_files__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}


md5sum @include(if: $shouldShow_md5sum) {
  
      buckets {
        doc_count
        key
      }
      
}

metadata_files__access @include(if: $shouldShow_metadata_files__access) {
  
      buckets {
        doc_count
        key
      }
      
}


metadata_files__data_category @include(if: $shouldShow_metadata_files__data_category) {
  
      buckets {
        doc_count
        key
      }
      
}

metadata_files__data_format @include(if: $shouldShow_metadata_files__data_format) {
  
      buckets {
        doc_count
        key
      }
      
}

metadata_files__data_type @include(if: $shouldShow_metadata_files__data_type) {
  
      buckets {
        doc_count
        key
      }
      
}

metadata_files__error_type @include(if: $shouldShow_metadata_files__error_type) {
  
      buckets {
        doc_count
        key
      }
      
}

metadata_files__file_id @include(if: $shouldShow_metadata_files__file_id) {
  
      buckets {
        doc_count
        key
      }
      
}

metadata_files__file_name @include(if: $shouldShow_metadata_files__file_name) {
  
      buckets {
        doc_count
        key
      }
      
}

metadata_files__file_size @include(if: $shouldShow_metadata_files__file_size) {
  
      count
      max
      avg
      min
    
}

metadata_files__file_state @include(if: $shouldShow_metadata_files__file_state) {
  
      buckets {
        doc_count
        key
      }
      
}

metadata_files__md5sum @include(if: $shouldShow_metadata_files__md5sum) {
  
      buckets {
        doc_count
        key
      }
      
}

metadata_files__state @include(if: $shouldShow_metadata_files__state) {
  
      buckets {
        doc_count
        key
      }
      
}

metadata_files__state_comment @include(if: $shouldShow_metadata_files__state_comment) {
  
      buckets {
        doc_count
        key
      }
      
}

metadata_files__submitter_id @include(if: $shouldShow_metadata_files__submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}

metadata_files__type @include(if: $shouldShow_metadata_files__type) {
  
      buckets {
        doc_count
        key
      }
      
}


origin @include(if: $shouldShow_origin) {
  
      buckets {
        doc_count
        key
      }
      
}

platform @include(if: $shouldShow_platform) {
  
      buckets {
        doc_count
        key
      }
      
}

revision @include(if: $shouldShow_revision) {
  
      count
      max
      avg
      min
    
}

state @include(if: $shouldShow_state) {
  
      buckets {
        doc_count
        key
      }
      
}

state_comment @include(if: $shouldShow_state_comment) {
  
      buckets {
        doc_count
        key
      }
      
}

submitter_id @include(if: $shouldShow_submitter_id) {
  
      buckets {
        doc_count
        key
      }
      
}

tags @include(if: $shouldShow_tags) {
  
      buckets {
        doc_count
        key
      }
      
}

type @include(if: $shouldShow_type) {
  
      buckets {
        doc_count
        key
      }
      
}

  }
`;
