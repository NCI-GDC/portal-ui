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
               "value": "1"
            }
         },
         {
            "op": "in",
            "content": {
               "field": "f2",
               "value": [
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
        value: t
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
  = field:field operator:list_operator LBRACK _* terms:terms _* RBRACK
  {
    return term_response(operator,field,terms);
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
    order = order ? ":" + order[3] : "";
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
SEP = "_" / "-" / "."

// Symbols
INTEGER = $DIGIT+
REAL = DIGIT* "." DIGIT+
COMMA = ","
COLON = ":"
SEMI = ";"
EQUAL = "="
NEQ = "!="
GT = ">"
GTE = ">="
LT = "<"
LTE = "<="
LPAR = "("
RPAR = ")"
LBRACE = "{"
RBRACE = "}"
LBRACK = "["
RBRACK = "]"
DBLQ = '"'

// GQL Keywords
SELECT = "select"i { return "select"; }
AND = "and"i { return "and"; }
ASC = "asc"i { return "asc"; }
DESC = "desc"i { return "desc"; }
IN = "in"i { return "in"; }
IS = "is"i { return "is"; }
NOT = "not"i { return "not"; }
IS_NOT = IS _+ NOT { return "is not"; }
NOT_IN = NOT _+ IN { return "not in"; }
OR = "or"i { return "or"; }
MISSING = "missing"i { return "missing"; }
SORT = "sort"i { return "sort"; }
AGGS = "aggregate on"i { return "aggregate"; }
WHERE = "where"i { return "where"; }

// Values
UNQUOTED_STRING = !('and'/'or'/'(') $[A-Za-z0-9\-\_\.]+
QUOTED_STRING = DBLQ s:$[^"]+ DBLQ { return s; }
DATE = $(DIGIT DIGIT DIGIT DIGIT ("-"/"/") DIGIT DIGIT ("-"/"/") DIGIT DIGIT)

// Extra
_ = [ \t\r\n]
EOF = !.

// Model
MODEL
  = "participants.days_to_index" / "participants.submitter_id" / "participants.project.name" / "participants.project.state" / "participants.project.program.name" / "participants.project.program.program_id" / "participants.project.primary_site" / "participants.project.project_id" / "participants.project.disease_type" / "participants.clinical.year_of_diagnosis" / "participants.clinical.clinical_id" / "participants.clinical.gender" / "participants.clinical.race" / "participants.clinical.age_at_diagnosis" / "participants.clinical.icd_10" / "participants.clinical.vital_status" / "participants.clinical.days_to_death" / "participants.clinical.ethnicity" / "participants.metadata_files.data_type" / "participants.metadata_files.file_name" / "participants.metadata_files.md5sum" / "participants.metadata_files.submitter_id" / "participants.metadata_files.state" / "participants.metadata_files.data_subtype" / "participants.metadata_files.file_id" / "participants.metadata_files.file_size" / "participants.metadata_files.acl" / "participants.metadata_files.state_comment" / "participants.samples.sample_type_id" / "participants.samples.pathology_report_uuid" / "participants.samples.portions.creation_datetime" / "participants.samples.portions.portion_number" / "participants.samples.portions.weight" / "participants.samples.portions.analytes.well_number" / "participants.samples.portions.analytes.analyte_type" / "participants.samples.portions.analytes.submitter_id" / "participants.samples.portions.analytes.analyte_id" / "participants.samples.portions.analytes.amount" / "participants.samples.portions.analytes.aliquots.center.code" / "participants.samples.portions.analytes.aliquots.center.name" / "participants.samples.portions.analytes.aliquots.center.short_name" / "participants.samples.portions.analytes.aliquots.center.namespace" / "participants.samples.portions.analytes.aliquots.center.center_id" / "participants.samples.portions.analytes.aliquots.center.center_type" / "participants.samples.portions.analytes.aliquots.submitter_id" / "participants.samples.portions.analytes.aliquots.amount" / "participants.samples.portions.analytes.aliquots.aliquot_id" / "participants.samples.portions.analytes.aliquots.concentration" / "participants.samples.portions.analytes.aliquots.source_center" / "participants.samples.portions.analytes.aliquots.annotations.category" / "participants.samples.portions.analytes.aliquots.annotations.status" / "participants.samples.portions.analytes.aliquots.annotations.entity_id" / "participants.samples.portions.analytes.aliquots.annotations.classification" / "participants.samples.portions.analytes.aliquots.annotations.creator" / "participants.samples.portions.analytes.aliquots.annotations.created_datetime" / "participants.samples.portions.analytes.aliquots.annotations.annotation_id" / "participants.samples.portions.analytes.aliquots.annotations.notes" / "participants.samples.portions.analytes.aliquots.annotations.entity_type" / "participants.samples.portions.analytes.aliquots.annotations.submitter_id" / "participants.samples.portions.analytes.aliquots.annotations.participant_id" / "participants.samples.portions.analytes.aliquots.annotations.entity_submitter_id" / "participants.samples.portions.analytes.a260_a280_ratio" / "participants.samples.portions.analytes.concentration" / "participants.samples.portions.analytes.spectrophotometer_method" / "participants.samples.portions.analytes.analyte_type_id" / "participants.samples.portions.analytes.annotations.category" / "participants.samples.portions.analytes.annotations.status" / "participants.samples.portions.analytes.annotations.entity_id" / "participants.samples.portions.analytes.annotations.classification" / "participants.samples.portions.analytes.annotations.creator" / "participants.samples.portions.analytes.annotations.created_datetime" / "participants.samples.portions.analytes.annotations.annotation_id" / "participants.samples.portions.analytes.annotations.notes" / "participants.samples.portions.analytes.annotations.entity_type" / "participants.samples.portions.analytes.annotations.submitter_id" / "participants.samples.portions.analytes.annotations.participant_id" / "participants.samples.portions.analytes.annotations.entity_submitter_id" / "participants.samples.portions.submitter_id" / "participants.samples.portions.slides.percent_tumor_nuclei" / "participants.samples.portions.slides.percent_monocyte_infiltration" / "participants.samples.portions.slides.percent_normal_cells" / "participants.samples.portions.slides.annotations.category" / "participants.samples.portions.slides.annotations.status" / "participants.samples.portions.slides.annotations.entity_id" / "participants.samples.portions.slides.annotations.classification" / "participants.samples.portions.slides.annotations.creator" / "participants.samples.portions.slides.annotations.created_datetime" / "participants.samples.portions.slides.annotations.annotation_id" / "participants.samples.portions.slides.annotations.notes" / "participants.samples.portions.slides.annotations.entity_type" / "participants.samples.portions.slides.annotations.submitter_id" / "participants.samples.portions.slides.annotations.participant_id" / "participants.samples.portions.slides.annotations.entity_submitter_id" / "participants.samples.portions.slides.submitter_id" / "participants.samples.portions.slides.percent_eosinophil_infiltration" / "participants.samples.portions.slides.percent_lymphocyte_infiltration" / "participants.samples.portions.slides.percent_stromal_cells" / "participants.samples.portions.slides.section_location" / "participants.samples.portions.slides.slide_id" / "participants.samples.portions.slides.percent_necrosis" / "participants.samples.portions.slides.percent_granulocyte_infiltration" / "participants.samples.portions.slides.percent_inflam_infiltration" / "participants.samples.portions.slides.percent_neutrophil_infiltration" / "participants.samples.portions.slides.number_proliferating_cells" / "participants.samples.portions.slides.percent_tumor_cells" / "participants.samples.portions.portion_id" / "participants.samples.portions.is_ffpe" / "participants.samples.portions.annotations.category" / "participants.samples.portions.annotations.status" / "participants.samples.portions.annotations.entity_id" / "participants.samples.portions.annotations.classification" / "participants.samples.portions.annotations.creator" / "participants.samples.portions.annotations.created_datetime" / "participants.samples.portions.annotations.annotation_id" / "participants.samples.portions.annotations.notes" / "participants.samples.portions.annotations.entity_type" / "participants.samples.portions.annotations.submitter_id" / "participants.samples.portions.annotations.participant_id" / "participants.samples.portions.annotations.entity_submitter_id" / "participants.samples.portions.center.code" / "participants.samples.portions.center.name" / "participants.samples.portions.center.short_name" / "participants.samples.portions.center.namespace" / "participants.samples.portions.center.center_id" / "participants.samples.portions.center.center_type" / "participants.samples.time_between_clamping_and_freezing" / "participants.samples.time_between_excision_and_freezing" / "participants.samples.shortest_dimension" / "participants.samples.oct_embedded" / "participants.samples.tumor_code_id" / "participants.samples.tumor_code" / "participants.samples.sample_type" / "participants.samples.submitter_id" / "participants.samples.days_to_collection" / "participants.samples.intermediate_dimension" / "participants.samples.days_to_sample_procurement" / "participants.samples.sample_id" / "participants.samples.initial_weight" / "participants.samples.freezing_method" / "participants.samples.current_weight" / "participants.samples.annotations.category" / "participants.samples.annotations.status" / "participants.samples.annotations.entity_id" / "participants.samples.annotations.classification" / "participants.samples.annotations.creator" / "participants.samples.annotations.created_datetime" / "participants.samples.annotations.annotation_id" / "participants.samples.annotations.notes" / "participants.samples.annotations.entity_type" / "participants.samples.annotations.submitter_id" / "participants.samples.annotations.participant_id" / "participants.samples.annotations.entity_submitter_id" / "participants.samples.longest_dimension" / "participants.samples.is_ffpe" / "participants.participant_id" / "participants.summary.file_count" / "participants.summary.data_types.file_count" / "participants.summary.data_types.data_type" / "participants.summary.experimental_strategies.file_count" / "participants.summary.experimental_strategies.experimental_strategy" / "participants.summary.file_size" / "participants.tissue_source_site.project" / "participants.tissue_source_site.bcr_id" / "participants.tissue_source_site.code" / "participants.tissue_source_site.tissue_source_site_id" / "participants.tissue_source_site.name"
  / "origin" / "files.file_name" / "files.submitter_id" / "files.file_size" / "files.archive.archive_id" / "files.archive.revision" / "files.archive.submitter_id" / "files.state" / "files.access" / "files.platform" / "files.data_subtype" / "files.annotations.category" / "files.annotations.status" / "files.annotations.entity_id" / "files.annotations.classification" / "files.annotations.creator" / "files.annotations.created_datetime" / "files.annotations.annotation_id" / "files.annotations.notes" / "files.annotations.entity_type" / "files.annotations.submitter_id" / "files.annotations.participant_id" / "files.annotations.entity_submitter_id" / "files.experimental_strategy" / "files.data_type" / "files.tags" / "files.uploaded_datetime" / "files.file_id" / "files.published_datetime" / "files.state_comment" / "files.related_files.published_datetime" / "files.related_files.data_type" / "files.related_files.file_name" / "files.related_files.md5sum" / "files.related_files.submitter_id" / "files.related_files.uploaded_datetime" / "files.related_files.state" / "files.related_files.data_subtype" / "files.related_files.file_id" / "files.related_files.type" / "files.related_files.file_size" / "files.related_files.state_comment" / "files.center.code" / "files.center.name" / "files.center.short_name" / "files.center.namespace" / "files.center.center_id" / "files.center.center_type" / "files.md5sum" / "files.data_format" / "files.acl" / "files.associated_entities.entity_id" / "files.associated_entities.entity_type" / "files.associated_entities.participant_id"