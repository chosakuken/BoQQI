parser grammar BoQQIParser;

options {
    tokenVocab = BoQQILexer;
}

program
    : statement* EOF
    ;

statement
    : if
    | function
    | call SEMI
    | declare SEMI
    | assign SEMI
    | return
    ;

if
    : IF LPAREN expr RPAREN LBRACE statement* RBRACE (ELSE LBRACE statement* RBRACE)?
    ;

function
    : FUNC IDENT LPAREN params RPAREN COLON returnType LBRACE statement* RBRACE
    ;

returnType
    : numericType domain
    | nonNumericType
    ;

params
    : param (COMMA param)*
    |
    ;

param
    : numericType domain IDENT
    | nonNumericType IDENT
    ;

return
    : RETURN expr SEMI
    ;

call
    : IDENT LPAREN args RPAREN
    ;

args
    : expr (COMMA expr)*
    |
    ;

declare
    : numericType domain IDENT
    | numericType domain IDENT EQUAL expr
    | nonNumericType IDENT
    | nonNumericType IDENT EQUAL expr
    ;

domain
    : LBRACE MAX COLON expr COMMA MIN COLON expr RBRACE
    ;

assign
    : IDENT EQUAL expr
    ;

type
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
    : expr op=(MUL | DIV) expr          # MulDiv
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
