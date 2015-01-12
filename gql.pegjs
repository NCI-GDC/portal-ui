start = sexp

sexp = "(" ops:ops ")"
       { return ops }

ops = group_op / list_op / value_op

// Group Operators take >1 sexps
group_op = op:group_op_terms spaces args:group_args
           { return {"op": op, "content": args} }

group_op_terms = "and" / "or"

group_args = xs:sexps+ x:sexp
             { xs.push(x); return xs  }

sexps = xs:(sexp spaces)
        { return xs[0] }

// List Operators take a field and a list of terms
list_op = op:list_op_terms spaces args:list_args
          { return {"op": op, "content": args}}

list_op_terms = "in" / "out"

list_args = f:word spaces "[" v:terms "]"
            { return {"field": f, "value": v }}

// Value Operators take a field and a value
value_op = op:value_op_terms spaces args:value_args
           { return {"op": op, "content": args}}

value_op_terms = "is" / "not" / "gt" / "gte" / "lt" / "lte"

value_args = f:word spaces v:term
             { return {"field": f, "value": v }}

arg = xs:(term / sexp)

terms = xs:_terms+ x:term
        { xs.push(x); return xs }

_terms = xs:(term spaces)
         {return xs[0] }

term = word / text

text = quote .+ quote

quote = '"'

word = cs:$char+
       { return cs }

char = [A-Za-z0-9_-]

spaces = [ \t\n]+