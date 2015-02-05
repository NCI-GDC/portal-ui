start 
  = _* node:node+ _*
    {
      return node[0];
    }
  / _*
    {
      return {};
    }
  / EOF
    {
      return {};
    }

node 
  = group_expr
  / exprs

exprs
  = list_expr
  / value_expr 
  / parens 

parens 
  = "(" node:node ")"
    { 
      return node;
    }

// Group Operators
group_expr
  = left:exprs operator:group_operator_expr right:node
    { 
      return {
        op: operator, 
        content: [left, right]
      }
    }

group_operator_expr 
  = _ operator:("or"i / "and"i) _
    { 
      return operator; 
    }

// List Operators take a field and a list of terms
list_expr 
  = field:unquoted_term operator:list_operator_expr terms:terms
    { 
      return {
        op: operator, 
        content: {
          field: field,
          terms: terms 
        }
      }
    }

list_operator_expr 
  = _ operator:list_operators _
    { 
      return operator;
    }

list_operators 
  = "not in"i 
  / "in"i 
  
// Value Operators take a field and a value
value_expr 
  = field:unquoted_term operator:value_operator_expr term:term
    { 
      return {
        op: operator, 
        content: {
          field: field,
          term: term 
        }
      }
    }

value_operator_expr 
  = _ operator:value_operators _
    { 
      return operator;
    }

value_operators 
  = "is not"i 
  / "is"i 
  / "gte"i 
  / "gt"i 
  / "lte"i 
  / "lt"i


terms 
  = "[" x:term xs:_terms* "]"
    {
      var ts = [x];
      if (xs.length) {
        ts = ts.concat(xs)
      }

      return ts; 
    }

_terms 
  = xs:(_ term)
    {
      return xs[1];
    }

term 
  = unquoted_term
  / quoted_term

unquoted_term
  = term:$[^: \t\r\n\f\{\}()"+-/^~\[\]]+
    {
      return term;
    }

quoted_term
  = '"' term:$[^"]+ '"'
    {
      return term;
    }

_ "whitespace"
  = [ \t\r\n\f,]+

EOF
  = !.