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
  = (WHERE _+ )? _* filters:filters aggs:(_+ aggs)? sort:(_+ sort)? _*
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
  = LPAR _* filters:filters _* RPAR { return filters; }

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
  = UNQUOTED_STRING

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
UNQUOTED_STRING = x:(!('and'/'or'/'(') $[A-Za-z0-9\-\_\.]+)
{
  return x[1];
}
QUOTED_STRING = DBLQ s:$[^"]+ DBLQ { return s; }
DATE = $(DIGIT DIGIT DIGIT DIGIT ("-"/"/") DIGIT DIGIT ("-"/"/") DIGIT DIGIT)

// Extra
_ = [ \t\r\n]
EOF = !.