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
  var units = ['KB', 'MB', 'GB', 'TB', 'PB'];

  function toBytes(number, unit) {
    var index = units.indexOf(unit.toUpperCase());
    var multiplier = index < 0 ? 1 : Math.pow(2, (index + 1) * 10);
    var result = Math.ceil(number * multiplier);

    return '' + result;
  }

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

SizeUnit
  = "KB" / "MB" / "GB" / "TB" / "PB" /
    "kb" / "mb" / "gb" / "tb" / "pb"

SizeExpr
  = number:POSITIVE_FLOAT unit:SizeUnit { return toBytes(number, unit); }

Comparable
  = DATE
  / SizeExpr
  / INTEGER

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
  = SizeExpr
  / UNQUOTED_STRING
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
DECIMAL_POINT = "."

number_frac
  = DECIMAL_POINT digits: [0-9]*
    { return '.' + digits.join(''); }

POSITIVE_FLOAT
  = digits: [0-9]+ frac: number_frac?
    { return parseFloat(digits.join('') + frac); }

DIGIT "number" = [0-9]
INTEGER = $DIGIT+
REAL = DIGIT* "." DIGIT+
DASH = "-"
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
DATE
  = x:(DIGIT DIGIT DIGIT DIGIT DASH DIGIT DIGIT DASH DIGIT DIGIT)
  {
    return x.join('');
  }
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
