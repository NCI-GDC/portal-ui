// Define a grammar called GQL
// (field1 = "AAA11232" and fieldB = B_C) and fieldC is MISSING and fieldD is not MIsSING or (fieldD in [D-D, "DD sdf", D2D3D] or fieldE != E) and (field1 > 1111-11-11 and field1 <= 20) order by fieldA asc, fieldB desc
grammar GQL;

statement
  : expressions order_expression?
  | EOF
  ;

expressions
  : expression (condition_operator expressions)?
  ;

par_expression
  : NOT? LPAR expressions RPAR
  ;

condition_operator
  : OR
  | AND
  ;

expression
  : equality_expression
  | compare_expression
  | missing_expression
  | list_expression
  | par_expression
  | functions
  ;

equality_expression
  : field equality_operator term
  ;

compare_expression
  : field compare_operator comparable
  ;

comparable
  : INTEGER
  | DATE
  ;

missing_expression
  : field is_operator MISSING
  ;

is_operator
  : IS NOT?
  ;

equality_operator
  : EQUAL
  | NEQ
  ;

compare_operator
  : GT
  | GTE
  | LT
  | LTE
  ;

list_expression
  : field list_operator LBRACK terms RBRACK
  ;

list_operator
  : NOT? IN
  ;

order_expression
  : ORDER order_column (COMMA order_column)*
  ;

order_column
  : field sort?
  ;

sort
  : ASC
  | DESC
  ;

field
  : UNQUOTED_STRING
  ;

terms
  : term (COMMA term)*
  ;

term
  : UNQUOTED_STRING
  | QUOTED_STRING
  | INTEGER
  | DATE
  ;

functions
  : projects_expression
  | date_expression
  ;

projects_expression
  : PROJECTS_FIELD list_operator projects_function
  ;

projects_function
  : MY_PROJECTS_FUNC
  ;

date_expression
  : DATE_FIELD is_operator date_function
  ;

date_function
  : NOW_FUNC
  ;

// Fragments
fragment DIGIT : '0'..'9' ;
fragment ALPHA : 'a'..'z' | 'A'..'Z' ;
fragment ALPHA_NUM : ALPHA | DIGIT ;
fragment SEP : '_' | '-' | '.' ;

// Symbols
INTEGER : ('0' | '1'..'9' '0'..'9'*) ;
REAL : DIGIT+ '.' DIGIT* ;
COMMA : ',' ;
COLON : ':' ;
SEMI : ';' ;
EQUAL : '=' ;
NEQ : '!=';
GT : '>' ;
GTE : '>=' ;
LT : '<' ;
LTE : '<=';
LPAR : '(' ;
RPAR : ')' ;
LBRACE : '{';
RBRACE : '}';
LBRACK : '[';
RBRACK : ']';
DBLQ : '"' ;

// GQL Keywords
AND : [Aa][Nn][Dd] ;
ASC : [Aa][Ss][Cc] ;
DESC : [Dd][Ee][Ss][Cc] ;
FROM : [Ff][Rr][Oo][Mm] ;
IN : [Ii][Nn] ;
IS : [Ii][Ss] ;
NOT : [Nn][Oo][Tt] ;
OR : [Oo][Rr] ;
ORDER : [Oo][Rr][Dd][Ee][Rr][ ][Bb][Yy] ;
MISSING : [Mm][Ii][Ss][Ss][Ii][Nn][Gg] ;

// GQL Functions - proof of concept
PROJECTS_FIELD : 'participants.project_code' ;
MY_PROJECTS_FUNC : 'myProjects()' ;
DATE_FIELD : 'files.' ('createdAt' | 'lastModified' ) ;
NOW_FUNC : 'now()' ;

// Values
UNQUOTED_STRING : ALPHA (ALPHA_NUM | SEP)*;
QUOTED_STRING : DBLQ (ALPHA_NUM | SEP | WS)*? DBLQ ;
DATE : DIGIT DIGIT DIGIT DIGIT ('-'|'/') DIGIT DIGIT ('-'|'/') DIGIT DIGIT;

// Extra
WS : [ \t\r\n]+ -> skip ;
COMMENT : '/*' .*? '*/' -> skip;
LINE_COMMENT : '--' ~('\n'|'\r')* -> skip;