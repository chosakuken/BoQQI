parser grammar BoQQIParser;

options {
    tokenVocab = BoQQILexer;
}

program
    : (statement | function | declaration SEMI)* EOF
    ;

statement
    : if
    | while
    | call SEMI
    | assign SEMI
    | return
    ;

if
    : IF LPAREN expr RPAREN LBRACE statement* RBRACE (ELSE LBRACE statement* RBRACE)?
    ;

while
    : WHILE LPAREN expr RPAREN LBRACE statement* RBRACE
    ;

function
    : FUNC IDENT LPAREN params RPAREN COLON returnType LBRACE (statement | declaration SEMI)* RBRACE
    ;

returnType
    : numericType domain
    | nonNumericType
    | TYPE_VOID
    ;

params
    : param (COMMA param)*
    |
    ;

param
    : numericType domain IDENT
    | nonNumericType IDENT
    | arrayType IDENT
    ;

return
    : RETURN expr? SEMI
    ;

call
    : IDENT LPAREN args RPAREN
    ;

args
    : expr (COMMA expr)*
    |
    ;

declaration
    : numericType domain IDENT
    | numericType domain IDENT EQUAL expr
    | nonNumericType IDENT
    | nonNumericType IDENT EQUAL expr
    | arrayType domain? IDENT
    ;

domain
    : LBRACE MAX COLON expr COMMA MIN COLON expr RBRACE
    ;

assign
    : IDENT (LBRACK expr RBRACK)? EQUAL expr
    ;

type
    : numericType
    | nonNumericType
    | arrayType
    ;

arrayType
    : elementType LBRACK INT RBRACK
    ;

elementType
    : numericType
    | nonNumericType
    ;

numericType
    : TYPE_INT
    | TYPE_FLOAT
    ;

nonNumericType
    : TYPE_STRING
    | TYPE_BOOL
    ;

expr
    : expr LBRACK expr RBRACK           # Index
    | expr op=(MUL | DIV | MOD) expr    # MulDiv
    | expr op=(PLUS | MINUS) expr       # AddSub
    | expr op=(GE | LE | GT | LT) expr  # comp
    | expr op=(EQ | NE) expr            # eq
    | LPAREN expr RPAREN                # Parens
    | FLOAT                             # Float
    | INT                               # Int
    | STRING                            # String
    | boolean                           # bool
    | call                              # CallExpr
    | IDENT                             # Var
    ;

boolean
    : TRUE
    | FALSE
    ;
