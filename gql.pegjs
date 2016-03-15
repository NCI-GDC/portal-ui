// Define a grammar called GQL
/*
-- Input
 f1 > 1 and f2 in [D-D, "DD sdf", D2D3D]

 -- Output
{
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
   }
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

Start
  = _* filters:FiltersExpr _*
  {
    return filters ? {filters: filters} : {};
  }
  / _* { return {}; }
  / EOF { return {}; }

// Filters
FiltersExpr
  = GroupExpr / Expr

ParenExpr
  = LPAR _* filters:FiltersExpr _* RPAR { return filters; }

Expr
  = EqualityExpr
  / CompareExpr
  / MissingExpr
  / ListExpr
  / ParenExpr

GroupExpr
  = left:Expr operator:GroupOp right:FiltersExpr
  {
    return {
      op: operator,
      content: [left, right]
    };
  }

EqualityExpr
  = field:Field operator:EqualityOp term:Term
  {
    return term_response(operator,field,term);
  }

MissingExpr
  = field:Field operator:MissingOp term:MISSING
  {
    return term_response(operator,field,term);
  }

CompareExpr
  = field:Field operator:CompareOp term:Comparable
  {
    return term_response(operator,field,term);
  }

ListExpr
  = field:Field operator:ListOp LBRACK _* terms:Terms _* RBRACK
  {
    return term_response(operator,field,terms);
  }
  
Comparable
  = INTEGER

Fields
  = x:Field xs:FieldsRest* { return [x].concat(xs); }

FieldsRest
  = _* COMMA _* f:Field { return f; }

Field "field"
  = UNQUOTED_STRING

Terms
  = x:Term xs:TermsRest* { return [x].concat(xs); }

TermsRest
  = _* COMMA _* t:Term { return t; }

Term "term"
  = UNQUOTED_STRING
  / QUOTED_STRING
  / INTEGER

// Operators
GroupOp 
  = _+ op:(OR / AND) _+ { return op; }

MissingOp 
  = _+ op:( NOT / IS ) _+ { return op; }
  
ListOp 
  = _+ op:(IN / EXCLUDE) _+ { return op; }

EqualityOp 
  = _+ op:(EQUAL / NEQ) _+ { return op; }

CompareOp 
  = _+ op:(GTE / GT / LTE / LT) _+ { return op; }

// Symbols
DIGIT "number" = [0-9]
INTEGER = $DIGIT+
REAL = DIGIT* "." DIGIT+
COMMA "," = ","
COLON ":" = ":"
EQUAL "=" = "="
NEQ "!=" = "!="
GT ">" = ">"
GTE ">=" = ">="
LT "<" = "<"
LTE "<=" = "<="
LPAR "(" = "("
RPAR ")" = ")"
LBRACE "{" = "{"
RBRACE "}" = "}"
LBRACK "[" = "["
RBRACK "]" = "]"
DBLQ = '"'

// GQL Keywords
AND "AND" = "and"i
OR "OR" = "or"i
IN "IN" = "in"i
EXCLUDE "EXCLUDE" = "exclude"i
ISNT "ISNT" = IS _+ "not"i
IS "IS" = "is"i
NOT "NOT" = "not"i
MISSING "MISSING" = "missing"i

// Values
UNQUOTED_STRING 
  = x:(!('and'/'or'/'(') $[A-Za-z0-9\-\_\.]+)
  {
    return x[1];
  }
QUOTED_STRING 
  = DBLQ s:$[^"]+ DBLQ { return s; }

// Extra
_
  = ( WhiteSpace / NewLine )

NewLine "newline"
  = "\r\n"
  / "\r"
  / "\n"
  / "\u2028"
  / "\u2029"

WhiteSpace "whitespace"
  = " "
  / "\t"
  / "\v"
  / "\f"
  
EOF "end of input" = !.