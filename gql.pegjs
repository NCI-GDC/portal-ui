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
  = field:field operator:list_operator LBRACK _* terms:terms _* RBRACK
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
UNQUOTED_STRING = $[A-Za-z0-9\-\_\.]+
QUOTED_STRING = DBLQ s:$[^"]+ DBLQ { return s; }
DATE = $(DIGIT DIGIT DIGIT DIGIT ("-"/"/") DIGIT DIGIT ("-"/"/") DIGIT DIGIT)

// Extra
_ = [ \t\r\n]
EOF = !.

// Model
MODEL
  = "participants.days_to_index" / "participants.submitter_id" / "participants.project.project_name" / "project.project_id" / "participants.project.primary_site" / "participants.project.name" / "participants.project.state" / "participants.clinical.year_of_diagnosis" / "participants.clinical.clinical_id" / "participants.clinical.gender" / "participants.clinical.race" / "participants.clinical.age_at_diagnosis" / "participants.clinical.icd_10" / "participants.clinical.vital_status" / "participants.clinical.days_to_death" / "participants.clinical.ethnicity" / "participants.annotations.category" / "participants.annotations.status" / "participants.annotations.classification" / "participants.annotations.creator" / "participants.annotations.notes" / "participants.annotations.submitter_id" / "participants.annotations.annotation_id" / "participants.samples.sample_type_id" / "participants.samples.pathology_report_uuid" / "participants.samples.time_between_clamping_and_freezing" / "participants.samples.time_between_excision_and_freezing" / "participants.samples.shortest_dimension" / "participants.samples.oct_embedded" / "participants.samples.sample_type" / "participants.samples.submitter_id" / "participants.samples.days_to_collection" / "participants.samples.intermediate_dimension" / "participants.samples.days_to_sample_procurement" / "participants.samples.sample_id" / "participants.samples.initial_weight" / "participants.samples.freezing_method" / "participants.samples.current_weight" / "participants.samples.longest_dimension" / "participants.samples.is_ffpe" / "participants.participant_id" / "participants.summary.data_types.data_type" / "participants.summary.experimental_strategies.experimental_strategy" / "participants.tissue_source_site.project" / "participants.tissue_source_site.bcr_id" / "participants.tissue_source_site.code" / "participants.tissue_source_site.tissue_source_site_id" / "participants.tissue_source_site.name"
  / "participants.annotations.created_datetime" / "participants.summary.data_types.file_count" / "participants.summary.file_count" / "participants.summary.experimental_strategies.file_count" / "participants.summary.file_size"
  / "files.data_format.data_format_id" / "files.data_format.name" / "files.related_files.file_name" / "files.related_files.md5sum" / "files.related_files.submitter_id" / "files.related_files.state" / "participants.related_files.file_id" / "files.related_files.state_comment" / "files.center.code" / "files.center.name" / "files.center.short_name" / "files.center.center_id" / "files.center.namespace" / "files.center.center_type" / "files.tags.name" / "files.tags.tag_id" / "files.file_name" / "files.md5sum" / "files.submitter_id" / "files.access" / "files.platform.platform_id" / "files.platform.name" / "files.state" / "files.data_subtype.name" / "files.data_subtype.data_subtype_id" / "files.file_id" / "files.experimental_strategy.experimental_strategy_id" / "files.experimental_strategy.name" / "files.state_comment" / "files.annotations.category" / "files.annotations.status" / "files.annotations.classification" / "files.annotations.creator" / "files.annotations.notes" / "files.annotations.submitter_id" / "files.annotations.annotation_id" / "files.archives.archive_id" / "files.archives.submitter_id"
  / "files.related_files.file_size" / "files.file_size" / "files.annotations.created_datetime" / "files.archives.revision"

  
  
