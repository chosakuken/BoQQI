lexer grammar BoQQILexer;

IF : 'if' ;
ELSE : 'else' ;
WHILE : 'while' ;
TRUE : 'true' ;
FALSE : 'false' ;
MAX : 'max' ;
MIN : 'min' ;
FUNC : 'function' ;
RETURN : 'return' ;

TYPE_INT : 'int' ;
TYPE_FLOAT : 'float' ;
TYPE_STRING : 'string' ;
TYPE_BOOL : 'bool';
TYPE_VOID : 'void' ;

PLUS  : '+' ;
MINUS : '-' ;
MUL   : '*' ;
DIV   : '/' ;
MOD   : '%' ;

EQUAL : '=' ;

EQ : '==' ;
NE : '!=' ;
GE : '>=' ;
LE : '<=' ;
GT : '>' ;
LT : '<' ;

LPAREN : '(' ;
RPAREN : ')' ;
LBRACE : '{' ;
RBRACE : '}' ;
LBRACK : '[' ;
RBRACK : ']' ;
COMMA : ',' ;
COLON : ':' ;
SEMI : ';' ;

FLOAT : [0-9]+ '.' [0-9]+ ;
INT : [0-9]+ ;
STRING : '"' ( '\\' [btnr"\\] | ~["\\\r\n] )* '"' ;
IDENT : [a-zA-Z_][a-zA-Z0-9_]* ;

WS : [ \t\r\n]+ -> skip ;
LINE_COMMENT : '//' ~[\r\n]* -> skip ;
