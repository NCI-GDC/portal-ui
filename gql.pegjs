// Define a grammar called GQL
/*
-- Input
SELECT
 f1,f3
where
 f1 > 1 and f2 in [D-D, "DD sdf", D2D3D]
AGGREGATE ON
 f1, f2, p1.p2.f4
SORT
 f1, f2:desc

 -- Output
{
   "fields": [
      "f1",
      "f3"
   ],
   "filters": {
      "op": "and",
      "content": [
         {
            "op": ">",
            "content": {
               "field": "f1",
               "term": "1"
            }
         },
         {
            "op": "in",
            "content": {
               "field": "f2",
               "terms": [
                  "D-D",
                  "DD sdf",
                  "D2D3D"
               ]
            }
         }
      ]
   },
   "aggs": [
      "f1",
      "f2",
      "p1.p2.f4"
   ],
   "sort": [
      "f1",
      "f2:desc"
   ]
}
*/
// grammar GQL

{
  function term_response(op, f, t) {
    return {
      op: op,
      content: {
        field: f,
        term: t
      }
    }
  }
}

start
  = (WHERE _+ )? filters:filters aggs:(_+ aggs)? sort:(_+ sort)? _*
  {
    var r = {};
    if (filters) {
      r.filters = filters;
    }
    if (aggs) {
      r.aggs = aggs[1];
    }
    if (sort) {
      r.sort = sort[1];
    }
    return r;
  }
  / select:select _+ filters:(WHERE _+ filters)? aggs:(_+ aggs)? sort:(_+ sort)? _*
  {
    var r = {};
    if (select) {
      r.fields = select;
    }
    if (filters) {
      r.filters = filters[2];
    }
    if (aggs) {
      r.aggs = aggs[1];
    }
    if (sort) {
      r.sort = sort[1];
    }
    return r;
  }
  / _* { return {}; }
  / EOF { return {}; }


// Fields
select
  = SELECT _+ fields:fields
  {
    return fields;
  }

// Aggregations
aggs
  = AGGS _+ fields:fields
  {
    return fields;
  }


// Filters
filters
  = condition_expression / expression

par_expression
  = LPAR filters:filters RPAR { return filters; }

expression
  = equality_expression
  / compare_expression
  / missing_expression
  / list_expression
  / par_expression

condition_expression
  = left:expression operator:condition_operator right:filters
  {
    return {
      op: operator,
      content: [left, right]
    };
  }

equality_expression
  = field:field operator:equality_operator term:term
  {
    return term_response(operator,field,term);
  }


compare_expression
  = field:field _* operator:compare_operator _* term:comparable
  {
    return term_response(operator,field,term);
  }


missing_expression
  = field:field operator:is_operator term:MISSING
  {
    return term_response(operator,field,term);
  }


list_expression
  = field:field operator:list_operator LBRACK terms:terms RBRACK
  {
    return {
      op: operator,
      content: {
        field: field,
        terms: terms
      }
    };
  }


// Sort
sort
  = SORT xs:sort_columns { return xs; }

// Types
sort_columns
  = x:sort_column xs:_sort_columns* { xs.unshift(x); return xs; }

_sort_columns
  = xs:(_* COMMA _* sort_column) { return xs[3]}

sort_column
  = _* field:field order:(_* COLON _* order)?
  {
    order = order ? ":" + order[3] : '';
    return field + order ;
  }

order
  = ASC
  / DESC


comparable
  = DATE
  / INTEGER

fields
  = x:field xs:_fields* { xs.unshift(x); return xs; }

_fields
  = xs:(_* COMMA _* term) { return xs[3]; }

field
  = MODEL

terms
  = x:term xs:_terms* { xs.unshift(x); return xs; }

_terms
  = ts:(_* COMMA _* term) { return ts[3]; }

term
  = UNQUOTED_STRING
  / QUOTED_STRING
  / INTEGER
  / DATE

// Operators
condition_operator = _+ op:(OR / AND) _+ { return op; }
is_operator = _+ op:(IS_NOT / IS) _+ { return op; }
list_operator = _+ op:(NOT_IN / IN) _+ { return op; }
equality_operator = _* op:(EQUAL / NEQ) _* { return op; }
compare_operator = _* op:(GTE / GT / LTE / LT) _* { return op; }

// Fragments
DIGIT = [0-9]
ALPHA = [A-Za-z]
ALPHA_NUM = ALPHA / DIGIT
SEP = '_' / '-' / '.'

// Symbols
INTEGER = $DIGIT+
REAL = DIGIT* '.' DIGIT+
COMMA = ','
COLON = ':'
SEMI = ''
EQUAL = '='
NEQ = '!='
GT = '>'
GTE = '>='
LT = '<'
LTE = '<='
LPAR = '('
RPAR = ')'
LBRACE = '{'
RBRACE = '}'
LBRACK = '['
RBRACK = ']'
DBLQ = '"'

// GQL Keywords
SELECT = 'select'i { return 'select'; }
AND = 'and'i { return 'and'; }
ASC = 'asc'i { return 'asc'; }
DESC = 'desc'i { return 'desc'; }
IN = 'in'i { return 'in'; }
IS = 'is'i { return 'is'; }
NOT = 'not'i { return 'not'; }
IS_NOT = IS _+ NOT { return 'is not'; }
NOT_IN = NOT _+ IN { return 'not in'; }
OR = 'or'i { return 'or'; }
MISSING = 'missing'i { return 'missing'; }
SORT = 'sort'i { return 'sort'; }
AGGS = 'aggregate on'i { return 'aggregate'; }
WHERE = 'where'i { return 'where'; }

// Values
UNQUOTED_STRING = $[A-Za-z0-9\-\_\.]+
QUOTED_STRING = DBLQ s:$[^"]+ DBLQ { return s; }
DATE = $(DIGIT DIGIT DIGIT DIGIT ('-'/'/') DIGIT DIGIT ('-'/'/') DIGIT DIGIT)

// Extra
_ = [ \t\r\n]
EOF = !.

// Model
MODEL
  = 'participants.icd_o_3_histology' / 'participants.days_to_last_followup' / 'participants.bcr_patient_uuid' / 'participants.days_to_index' / 'participants.prior_dx' / 'participants.vital_status' / 'participants.radiation_therapy' / 'participants.year_of_form_completion' / 'participants.year_of_initial_pathologic_diagnosis' / 'participants.extrathyroid_carcinoma_present_extension_status' / 'participants.genotype_analysis_performed_indicator' / 'participants.patient_id' / 'participants.tumor_tissue_site' / 'participants.icd_10' / 'participants.informed_consent_verified' / 'participants.histological_type' / 'participants.tissue_prospective_collection_indicator' / 'participants.month_of_form_completion' / 'participants.ethnicity' / 'participants.gender' / 'participants.age_at_initial_pathologic_diagnosis' / 'participants.history_of_neoadjuvant_treatment' / 'participants.icd_o_3_site' / 'participants.race' / 'participants.primary_thyroid_gland_neoplasm_location_anatomic_site' / 'participants.primary_lymph_node_presentation_assessment' / 'participants.lymph_node_preoperative_scan_indicator' / 'participants.primary_neoplasm_focus_type' / 'participants.tissue_retrospective_collection_indicator' / 'participants.residual_tumor' / 'participants.tissue_source_site' / 'participants.person_neoplasm_cancer_status' / 'participants.number_of_lymphnodes_positive_by_he' / 'participants.days_to_birth' / 'participants.lymph_node_examined_count' / 'participants.days_to_initial_pathologic_diagnosis' / 'participants.person_lifetime_risk_radiation_exposure_indicator' / 'participants.day_of_form_completion' / 'participants.bcr_patient_barcode' / 'participants.follow_ups.person_neoplasm_cancer_status' / 'participants.follow_ups.followup_case_report_form_submission_reason' / 'participants.follow_ups.i_131_total_administered_preparation_technique' / 'participants.follow_ups.month_of_form_completion' / 'participants.follow_ups.vital_status' / 'participants.follow_ups.year_of_form_completion' / 'participants.follow_ups.bcr_followup_uuid' / 'participants.follow_ups.days_to_last_followup' / 'participants.follow_ups.radiation_therapy' / 'participants.follow_ups.bcr_followup_barcode' / 'participants.follow_ups.day_of_form_completion' / 'participants.follow_ups.targeted_molecular_therapy' / 'participants.follow_ups.post_surgical_procedure_assessment_thyroid_gland_carcinoma_status' / 'participants.follow_ups.new_tumor.new_tumor_event_after_initial_treatment' / 'participants.bcr_canonical_check.bcr_patient_canonical_status' / 'participants.samples.sample_type_id' / 'participants.samples.diagnostic_slides' / 'participants.samples.oct_embedded' / 'participants.samples.vial_number' / 'participants.samples.bcr_sample_barcode' / 'participants.samples.pathology_report_uuid' / 'participants.samples.days_to_collection' / 'participants.samples.is_ffpe' / 'participants.samples.initial_weight' / 'participants.samples.sample_type' / 'participants.samples.bcr_sample_uuid' / 'participants.samples.portions.shipment_portion_day_of_shipment' / 'participants.samples.portions.shipment_portion_month_of_shipment' / 'participants.samples.portions.shipment_portion_year_of_shipment' / 'participants.samples.portions.shipment_portion_bcr_aliquot_barcode' / 'participants.samples.portions.center_id' / 'participants.samples.portions.plate_id' / 'participants.samples.portions.is_ffpe' / 'participants.samples.portions.day_of_creation' / 'participants.samples.portions.month_of_creation' / 'participants.samples.portions.year_of_creation' / 'participants.samples.portions.weight' / 'participants.samples.portions.portion_number' / 'participants.samples.portions.bcr_shipment_portion_uuid' / 'participants.samples.portions.bcr_portion_uuid' / 'participants.samples.portions.bcr_portion_barcode' / 'participants.samples.portions.slides.bcr_slide_uuid' / 'participants.samples.portions.slides.bcr_slide_barcode' / 'participants.samples.portions.slides.percent_lymphocyte_infiltration' / 'participants.samples.portions.slides.percent_necrosis' / 'participants.samples.portions.slides.percent_stromal_cells' / 'participants.samples.portions.slides.percent_normal_cells' / 'participants.samples.portions.slides.percent_monocyte_infiltration' / 'participants.samples.portions.slides.percent_tumor_cells' / 'participants.samples.portions.slides.percent_tumor_nuclei' / 'participants.samples.portions.slides.percent_neutrophil_infiltration' / 'participants.samples.portions.slides.is_derived_from_ffpe' / 'participants.samples.portions.slides.section_location' / 'participants.samples.portions.analytes.bcr_analyte_uuid' / 'participants.samples.portions.analytes.amount' / 'participants.samples.portions.analytes.analyte_type' / 'participants.samples.portions.analytes.spectrophotometer_method' / 'participants.samples.portions.analytes.gel_image_file' / 'participants.samples.portions.analytes.concentration' / 'participants.samples.portions.analytes.bcr_analyte_barcode' / 'participants.samples.portions.analytes.analyte_type_id' / 'participants.samples.portions.analytes.is_derived_from_ffpe' / 'participants.samples.portions.analytes.aliquots.amount' / 'participants.samples.portions.analytes.aliquots.month_of_shipment' / 'participants.samples.portions.analytes.aliquots.bcr_aliquot_barcode' / 'participants.samples.portions.analytes.aliquots.concentration' / 'participants.samples.portions.analytes.aliquots.plate_row' / 'participants.samples.portions.analytes.aliquots.is_derived_from_ffpe' / 'participants.samples.portions.analytes.aliquots.plate_column' / 'participants.samples.portions.analytes.aliquots.source_center' / 'participants.samples.portions.analytes.aliquots.center_id' / 'participants.samples.portions.analytes.aliquots.bcr_aliquot_uuid' / 'participants.samples.portions.analytes.aliquots.plate_id' / 'participants.samples.portions.analytes.aliquots.day_of_shipment' / 'participants.samples.portions.analytes.aliquots.biospecimen_barcode_bottom' / 'participants.samples.portions.analytes.aliquots.year_of_shipment' / 'participants.samples.portions.analytes.protocols.experimental_protocol_type' / 'participants.samples.portions.analytes.dna.pcr_amplification_successful' / 'participants.samples.portions.analytes.dna.normal_tumor_genotype_match' / 'participants.admin.disease_code' / 'participants.admin.project_code' / 'participants.stage_event.pathologic_stage' / 'participants.clinical_cqcf.consent_or_death_status' / 'participants.files.files._aliquot_barcode' / 'participants.files._aliquot_uuid' / 'participants.files._control_aliquot_barcode' / 'participants.files._control_aliquot_uuid' / 'participants.files._participant_barcode' / 'participants.files._slide_barcode' / 'participants.files._slide_uuid' / 'participants.files._tumor_aliquot_barcode' / 'participants.files._tumor_aliquot_uuid' / 'participants.files.data_type' / 'participants.files.data_access' / 'participants.files.data_level' / 'participants.files.data_subtype' / 'participants.files.file_extension' / 'participants.files.file_name' / 'participants.files.file_size' / 'participants.files.data_format' / 'participants.files.file_url' / 'participants.files.file_uuid' / 'participants.files.experimental_strategy' / 'participants.files.platform' / 'participants.files.updated' / 'participants.files.archive.archive_folder_url' / 'participants.files.archive.archive_name' / 'participants.files.archive.archive_url' / 'participants.files.archive.archive_uuid' / 'participants.files.archive.batch' / 'participants.files.archive.center_name' / 'participants.files.archive.center_type' / 'participants.files.archive.data_level' / 'participants.files.archive.data_type_in_url' / 'participants.files.archive.date_archive_added' / 'participants.files.archive.disease_code' / 'participants.files.archive.platform' / 'participants.files.archive.platform_in_url' / 'participants.files.archive.protected' / 'participants.files.archive.revision' / 'participants.participant_annotations.id' / 'participants.summary.data_file_count' / 'participants.summary.file_size' / 'participants.summary.experimental_strategies.file_count' / 'participants.summary.experimental_strategies.experimental_strategy' / 'participants.summary.data_types.file_count' / 'participants.summary.data_types.data_type'
  / 'files._aliquot_barcode' / 'files._aliquot_uuid' / 'files._control_aliquot_barcode' / 'files._control_aliquot_uuid' / 'files._participant_barcode' / 'files._slide_barcode' / 'files._slide_uuid' / 'files._tumor_aliquot_barcode' / 'files._tumor_aliquot_uuid' / 'files.data_type' / 'files.data_access' / 'files.data_level' / 'files.data_subtype' / 'files.file_extension' / 'files.file_name' / 'files.file_size' / 'files.data_format' / 'files.file_url' / 'files.file_uuid' / 'files.experimental_strategy' / 'files.platform' / 'files.updated' / 'files.archive.archive_folder_url' / 'files.archive.archive_name' / 'files.archive.archive_url' / 'files.archive.archive_uuid' / 'files.archive.batch' / 'files.archive.center_name' / 'files.archive.center_type' / 'files.archive.data_level' / 'files.archive.data_type_in_url' / 'files.archive.date_archive_added' / 'files.archive.disease_code' / 'files.archive.platform' / 'files.archive.platform_in_url' / 'files.archive.protected' / 'files.archive.revision'

  
  
  
