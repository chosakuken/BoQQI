
import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

import { BoQQIParserListener } from "./BoQQIParserListener.js";
// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;


export class BoQQIParser extends antlr.Parser {
    public static readonly IF = 1;
    public static readonly ELSE = 2;
    public static readonly WHILE = 3;
    public static readonly TRUE = 4;
    public static readonly FALSE = 5;
    public static readonly MAX = 6;
    public static readonly MIN = 7;
    public static readonly FUNC = 8;
    public static readonly RETURN = 9;
    public static readonly TYPE_INT = 10;
    public static readonly TYPE_FLOAT = 11;
    public static readonly TYPE_STRING = 12;
    public static readonly TYPE_BOOL = 13;
    public static readonly TYPE_VOID = 14;
    public static readonly PLUS = 15;
    public static readonly MINUS = 16;
    public static readonly MUL = 17;
    public static readonly DIV = 18;
    public static readonly MOD = 19;
    public static readonly EQUAL = 20;
    public static readonly EQ = 21;
    public static readonly NE = 22;
    public static readonly GE = 23;
    public static readonly LE = 24;
    public static readonly GT = 25;
    public static readonly LT = 26;
    public static readonly LPAREN = 27;
    public static readonly RPAREN = 28;
    public static readonly LBRACE = 29;
    public static readonly RBRACE = 30;
    public static readonly LBRACK = 31;
    public static readonly RBRACK = 32;
    public static readonly COMMA = 33;
    public static readonly COLON = 34;
    public static readonly SEMI = 35;
    public static readonly FLOAT = 36;
    public static readonly INT = 37;
    public static readonly STRING = 38;
    public static readonly IDENT = 39;
    public static readonly WS = 40;
    public static readonly RULE_program = 0;
    public static readonly RULE_statement = 1;
    public static readonly RULE_if = 2;
    public static readonly RULE_while = 3;
    public static readonly RULE_function = 4;
    public static readonly RULE_returnType = 5;
    public static readonly RULE_params = 6;
    public static readonly RULE_param = 7;
    public static readonly RULE_return = 8;
    public static readonly RULE_call = 9;
    public static readonly RULE_args = 10;
    public static readonly RULE_declaration = 11;
    public static readonly RULE_domain = 12;
    public static readonly RULE_assign = 13;
    public static readonly RULE_type = 14;
    public static readonly RULE_arrayType = 15;
    public static readonly RULE_elementType = 16;
    public static readonly RULE_numericType = 17;
    public static readonly RULE_nonNumericType = 18;
    public static readonly RULE_expr = 19;
    public static readonly RULE_boolean = 20;

    public static readonly literalNames = [
        null, "'if'", "'else'", "'while'", "'true'", "'false'", "'max'", 
        "'min'", "'function'", "'return'", "'int'", "'float'", "'string'", 
        "'bool'", "'void'", "'+'", "'-'", "'*'", "'/'", "'%'", "'='", "'=='", 
        "'!='", "'>='", "'<='", "'>'", "'<'", "'('", "')'", "'{'", "'}'", 
        "'['", "']'", "','", "':'", "';'"
    ];

    public static readonly symbolicNames = [
        null, "IF", "ELSE", "WHILE", "TRUE", "FALSE", "MAX", "MIN", "FUNC", 
        "RETURN", "TYPE_INT", "TYPE_FLOAT", "TYPE_STRING", "TYPE_BOOL", 
        "TYPE_VOID", "PLUS", "MINUS", "MUL", "DIV", "MOD", "EQUAL", "EQ", 
        "NE", "GE", "LE", "GT", "LT", "LPAREN", "RPAREN", "LBRACE", "RBRACE", 
        "LBRACK", "RBRACK", "COMMA", "COLON", "SEMI", "FLOAT", "INT", "STRING", 
        "IDENT", "WS"
    ];
    public static readonly ruleNames = [
        "program", "statement", "if", "while", "function", "returnType", 
        "params", "param", "return", "call", "args", "declaration", "domain", 
        "assign", "type", "arrayType", "elementType", "numericType", "nonNumericType", 
        "expr", "boolean",
    ];

    public get grammarFileName(): string { return "BoQQIParser.g4"; }
    public get literalNames(): (string | null)[] { return BoQQIParser.literalNames; }
    public get symbolicNames(): (string | null)[] { return BoQQIParser.symbolicNames; }
    public get ruleNames(): string[] { return BoQQIParser.ruleNames; }
    public get serializedATN(): number[] { return BoQQIParser._serializedATN; }

    protected createFailedPredicateException(predicate?: string, message?: string): antlr.FailedPredicateException {
        return new antlr.FailedPredicateException(this, predicate, message);
    }

    public constructor(input: antlr.TokenStream) {
        super(input);
        this.interpreter = new antlr.ParserATNSimulator(this, BoQQIParser._ATN, BoQQIParser.decisionsToDFA, new antlr.PredictionContextCache());
    }
    public program(): ProgramContext {
        let localContext = new ProgramContext(this.context, this.state);
        this.enterRule(localContext, 0, BoQQIParser.RULE_program);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 49;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 16138) !== 0) || _la === 39) {
                {
                this.state = 47;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case BoQQIParser.IF:
                case BoQQIParser.WHILE:
                case BoQQIParser.RETURN:
                case BoQQIParser.IDENT:
                    {
                    this.state = 42;
                    this.statement();
                    }
                    break;
                case BoQQIParser.FUNC:
                    {
                    this.state = 43;
                    this.function_();
                    }
                    break;
                case BoQQIParser.TYPE_INT:
                case BoQQIParser.TYPE_FLOAT:
                case BoQQIParser.TYPE_STRING:
                case BoQQIParser.TYPE_BOOL:
                    {
                    this.state = 44;
                    this.declaration();
                    this.state = 45;
                    this.match(BoQQIParser.SEMI);
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                }
                this.state = 51;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 52;
            this.match(BoQQIParser.EOF);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public statement(): StatementContext {
        let localContext = new StatementContext(this.context, this.state);
        this.enterRule(localContext, 2, BoQQIParser.RULE_statement);
        try {
            this.state = 63;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 2, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 54;
                this.if_();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 55;
                this.while_();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 56;
                this.call();
                this.state = 57;
                this.match(BoQQIParser.SEMI);
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 59;
                this.assign();
                this.state = 60;
                this.match(BoQQIParser.SEMI);
                }
                break;
            case 5:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 62;
                this.return_();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public if_(): IfContext {
        let localContext = new IfContext(this.context, this.state);
        this.enterRule(localContext, 4, BoQQIParser.RULE_if);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 65;
            this.match(BoQQIParser.IF);
            this.state = 66;
            this.match(BoQQIParser.LPAREN);
            this.state = 67;
            this.expr(0);
            this.state = 68;
            this.match(BoQQIParser.RPAREN);
            this.state = 69;
            this.match(BoQQIParser.LBRACE);
            this.state = 73;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 522) !== 0) || _la === 39) {
                {
                {
                this.state = 70;
                this.statement();
                }
                }
                this.state = 75;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 76;
            this.match(BoQQIParser.RBRACE);
            this.state = 86;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 2) {
                {
                this.state = 77;
                this.match(BoQQIParser.ELSE);
                this.state = 78;
                this.match(BoQQIParser.LBRACE);
                this.state = 82;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 522) !== 0) || _la === 39) {
                    {
                    {
                    this.state = 79;
                    this.statement();
                    }
                    }
                    this.state = 84;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 85;
                this.match(BoQQIParser.RBRACE);
                }
            }

            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public while_(): WhileContext {
        let localContext = new WhileContext(this.context, this.state);
        this.enterRule(localContext, 6, BoQQIParser.RULE_while);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 88;
            this.match(BoQQIParser.WHILE);
            this.state = 89;
            this.match(BoQQIParser.LPAREN);
            this.state = 90;
            this.expr(0);
            this.state = 91;
            this.match(BoQQIParser.RPAREN);
            this.state = 92;
            this.match(BoQQIParser.LBRACE);
            this.state = 96;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 522) !== 0) || _la === 39) {
                {
                {
                this.state = 93;
                this.statement();
                }
                }
                this.state = 98;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 99;
            this.match(BoQQIParser.RBRACE);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public function_(): FunctionContext {
        let localContext = new FunctionContext(this.context, this.state);
        this.enterRule(localContext, 8, BoQQIParser.RULE_function);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 101;
            this.match(BoQQIParser.FUNC);
            this.state = 102;
            this.match(BoQQIParser.IDENT);
            this.state = 103;
            this.match(BoQQIParser.LPAREN);
            this.state = 104;
            this.params();
            this.state = 105;
            this.match(BoQQIParser.RPAREN);
            this.state = 106;
            this.match(BoQQIParser.COLON);
            this.state = 107;
            this.returnType();
            this.state = 108;
            this.match(BoQQIParser.LBRACE);
            this.state = 115;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 15882) !== 0) || _la === 39) {
                {
                this.state = 113;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case BoQQIParser.IF:
                case BoQQIParser.WHILE:
                case BoQQIParser.RETURN:
                case BoQQIParser.IDENT:
                    {
                    this.state = 109;
                    this.statement();
                    }
                    break;
                case BoQQIParser.TYPE_INT:
                case BoQQIParser.TYPE_FLOAT:
                case BoQQIParser.TYPE_STRING:
                case BoQQIParser.TYPE_BOOL:
                    {
                    this.state = 110;
                    this.declaration();
                    this.state = 111;
                    this.match(BoQQIParser.SEMI);
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                }
                this.state = 117;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 118;
            this.match(BoQQIParser.RBRACE);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public returnType(): ReturnTypeContext {
        let localContext = new ReturnTypeContext(this.context, this.state);
        this.enterRule(localContext, 10, BoQQIParser.RULE_returnType);
        try {
            this.state = 125;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case BoQQIParser.TYPE_INT:
            case BoQQIParser.TYPE_FLOAT:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 120;
                this.numericType();
                this.state = 121;
                this.domain();
                }
                break;
            case BoQQIParser.TYPE_STRING:
            case BoQQIParser.TYPE_BOOL:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 123;
                this.nonNumericType();
                }
                break;
            case BoQQIParser.TYPE_VOID:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 124;
                this.match(BoQQIParser.TYPE_VOID);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public params(): ParamsContext {
        let localContext = new ParamsContext(this.context, this.state);
        this.enterRule(localContext, 12, BoQQIParser.RULE_params);
        let _la: number;
        try {
            this.state = 136;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case BoQQIParser.TYPE_INT:
            case BoQQIParser.TYPE_FLOAT:
            case BoQQIParser.TYPE_STRING:
            case BoQQIParser.TYPE_BOOL:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 127;
                this.param();
                this.state = 132;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 33) {
                    {
                    {
                    this.state = 128;
                    this.match(BoQQIParser.COMMA);
                    this.state = 129;
                    this.param();
                    }
                    }
                    this.state = 134;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                }
                break;
            case BoQQIParser.RPAREN:
                this.enterOuterAlt(localContext, 2);
                // tslint:disable-next-line:no-empty
                {
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public param(): ParamContext {
        let localContext = new ParamContext(this.context, this.state);
        this.enterRule(localContext, 14, BoQQIParser.RULE_param);
        try {
            this.state = 148;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 12, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 138;
                this.numericType();
                this.state = 139;
                this.domain();
                this.state = 140;
                this.match(BoQQIParser.IDENT);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 142;
                this.nonNumericType();
                this.state = 143;
                this.match(BoQQIParser.IDENT);
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 145;
                this.arrayType();
                this.state = 146;
                this.match(BoQQIParser.IDENT);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public return_(): ReturnContext {
        let localContext = new ReturnContext(this.context, this.state);
        this.enterRule(localContext, 16, BoQQIParser.RULE_return);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 150;
            this.match(BoQQIParser.RETURN);
            this.state = 152;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 134217776) !== 0) || ((((_la - 36)) & ~0x1F) === 0 && ((1 << (_la - 36)) & 15) !== 0)) {
                {
                this.state = 151;
                this.expr(0);
                }
            }

            this.state = 154;
            this.match(BoQQIParser.SEMI);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public call(): CallContext {
        let localContext = new CallContext(this.context, this.state);
        this.enterRule(localContext, 18, BoQQIParser.RULE_call);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 156;
            this.match(BoQQIParser.IDENT);
            this.state = 157;
            this.match(BoQQIParser.LPAREN);
            this.state = 158;
            this.args();
            this.state = 159;
            this.match(BoQQIParser.RPAREN);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public args(): ArgsContext {
        let localContext = new ArgsContext(this.context, this.state);
        this.enterRule(localContext, 20, BoQQIParser.RULE_args);
        let _la: number;
        try {
            this.state = 170;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case BoQQIParser.TRUE:
            case BoQQIParser.FALSE:
            case BoQQIParser.LPAREN:
            case BoQQIParser.FLOAT:
            case BoQQIParser.INT:
            case BoQQIParser.STRING:
            case BoQQIParser.IDENT:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 161;
                this.expr(0);
                this.state = 166;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 33) {
                    {
                    {
                    this.state = 162;
                    this.match(BoQQIParser.COMMA);
                    this.state = 163;
                    this.expr(0);
                    }
                    }
                    this.state = 168;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                }
                break;
            case BoQQIParser.RPAREN:
                this.enterOuterAlt(localContext, 2);
                // tslint:disable-next-line:no-empty
                {
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public declaration(): DeclarationContext {
        let localContext = new DeclarationContext(this.context, this.state);
        this.enterRule(localContext, 22, BoQQIParser.RULE_declaration);
        let _la: number;
        try {
            this.state = 196;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 17, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 172;
                this.numericType();
                this.state = 173;
                this.domain();
                this.state = 174;
                this.match(BoQQIParser.IDENT);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 176;
                this.numericType();
                this.state = 177;
                this.domain();
                this.state = 178;
                this.match(BoQQIParser.IDENT);
                this.state = 179;
                this.match(BoQQIParser.EQUAL);
                this.state = 180;
                this.expr(0);
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 182;
                this.nonNumericType();
                this.state = 183;
                this.match(BoQQIParser.IDENT);
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 185;
                this.nonNumericType();
                this.state = 186;
                this.match(BoQQIParser.IDENT);
                this.state = 187;
                this.match(BoQQIParser.EQUAL);
                this.state = 188;
                this.expr(0);
                }
                break;
            case 5:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 190;
                this.arrayType();
                this.state = 192;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 29) {
                    {
                    this.state = 191;
                    this.domain();
                    }
                }

                this.state = 194;
                this.match(BoQQIParser.IDENT);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public domain(): DomainContext {
        let localContext = new DomainContext(this.context, this.state);
        this.enterRule(localContext, 24, BoQQIParser.RULE_domain);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 198;
            this.match(BoQQIParser.LBRACE);
            this.state = 199;
            this.match(BoQQIParser.MAX);
            this.state = 200;
            this.match(BoQQIParser.COLON);
            this.state = 201;
            this.expr(0);
            this.state = 202;
            this.match(BoQQIParser.COMMA);
            this.state = 203;
            this.match(BoQQIParser.MIN);
            this.state = 204;
            this.match(BoQQIParser.COLON);
            this.state = 205;
            this.expr(0);
            this.state = 206;
            this.match(BoQQIParser.RBRACE);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public assign(): AssignContext {
        let localContext = new AssignContext(this.context, this.state);
        this.enterRule(localContext, 26, BoQQIParser.RULE_assign);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 208;
            this.match(BoQQIParser.IDENT);
            this.state = 213;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 31) {
                {
                this.state = 209;
                this.match(BoQQIParser.LBRACK);
                this.state = 210;
                this.expr(0);
                this.state = 211;
                this.match(BoQQIParser.RBRACK);
                }
            }

            this.state = 215;
            this.match(BoQQIParser.EQUAL);
            this.state = 216;
            this.expr(0);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public type_(): TypeContext {
        let localContext = new TypeContext(this.context, this.state);
        this.enterRule(localContext, 28, BoQQIParser.RULE_type);
        try {
            this.state = 221;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 19, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 218;
                this.numericType();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 219;
                this.nonNumericType();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 220;
                this.arrayType();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public arrayType(): ArrayTypeContext {
        let localContext = new ArrayTypeContext(this.context, this.state);
        this.enterRule(localContext, 30, BoQQIParser.RULE_arrayType);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 223;
            this.elementType();
            this.state = 224;
            this.match(BoQQIParser.LBRACK);
            this.state = 225;
            this.match(BoQQIParser.INT);
            this.state = 226;
            this.match(BoQQIParser.RBRACK);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public elementType(): ElementTypeContext {
        let localContext = new ElementTypeContext(this.context, this.state);
        this.enterRule(localContext, 32, BoQQIParser.RULE_elementType);
        try {
            this.state = 230;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case BoQQIParser.TYPE_INT:
            case BoQQIParser.TYPE_FLOAT:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 228;
                this.numericType();
                }
                break;
            case BoQQIParser.TYPE_STRING:
            case BoQQIParser.TYPE_BOOL:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 229;
                this.nonNumericType();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public numericType(): NumericTypeContext {
        let localContext = new NumericTypeContext(this.context, this.state);
        this.enterRule(localContext, 34, BoQQIParser.RULE_numericType);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 232;
            _la = this.tokenStream.LA(1);
            if(!(_la === 10 || _la === 11)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public nonNumericType(): NonNumericTypeContext {
        let localContext = new NonNumericTypeContext(this.context, this.state);
        this.enterRule(localContext, 36, BoQQIParser.RULE_nonNumericType);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 234;
            _la = this.tokenStream.LA(1);
            if(!(_la === 12 || _la === 13)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public expr(): ExprContext;
    public expr(_p: number): ExprContext;
    public expr(_p?: number): ExprContext {
        if (_p === undefined) {
            _p = 0;
        }

        let parentContext = this.context;
        let parentState = this.state;
        let localContext = new ExprContext(this.context, parentState);
        let previousContext = localContext;
        let _startState = 38;
        this.enterRecursionRule(localContext, 38, BoQQIParser.RULE_expr, _p);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 247;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 21, this.context) ) {
            case 1:
                {
                localContext = new ParensContext(localContext);
                this.context = localContext;
                previousContext = localContext;

                this.state = 237;
                this.match(BoQQIParser.LPAREN);
                this.state = 238;
                this.expr(0);
                this.state = 239;
                this.match(BoQQIParser.RPAREN);
                }
                break;
            case 2:
                {
                localContext = new FloatContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 241;
                this.match(BoQQIParser.FLOAT);
                }
                break;
            case 3:
                {
                localContext = new IntContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 242;
                this.match(BoQQIParser.INT);
                }
                break;
            case 4:
                {
                localContext = new StringContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 243;
                this.match(BoQQIParser.STRING);
                }
                break;
            case 5:
                {
                localContext = new BoolContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 244;
                this.boolean_();
                }
                break;
            case 6:
                {
                localContext = new CallExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 245;
                this.call();
                }
                break;
            case 7:
                {
                localContext = new VarContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 246;
                this.match(BoQQIParser.IDENT);
                }
                break;
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 268;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 23, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 266;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 22, this.context) ) {
                    case 1:
                        {
                        localContext = new MulDivContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, BoQQIParser.RULE_expr);
                        this.state = 249;
                        if (!(this.precpred(this.context, 11))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 11)");
                        }
                        this.state = 250;
                        (localContext as MulDivContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 917504) !== 0))) {
                            (localContext as MulDivContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 251;
                        this.expr(12);
                        }
                        break;
                    case 2:
                        {
                        localContext = new AddSubContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, BoQQIParser.RULE_expr);
                        this.state = 252;
                        if (!(this.precpred(this.context, 10))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 10)");
                        }
                        this.state = 253;
                        (localContext as AddSubContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 15 || _la === 16)) {
                            (localContext as AddSubContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 254;
                        this.expr(11);
                        }
                        break;
                    case 3:
                        {
                        localContext = new CompContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, BoQQIParser.RULE_expr);
                        this.state = 255;
                        if (!(this.precpred(this.context, 9))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 9)");
                        }
                        this.state = 256;
                        (localContext as CompContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 125829120) !== 0))) {
                            (localContext as CompContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 257;
                        this.expr(10);
                        }
                        break;
                    case 4:
                        {
                        localContext = new EqContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, BoQQIParser.RULE_expr);
                        this.state = 258;
                        if (!(this.precpred(this.context, 8))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 8)");
                        }
                        this.state = 259;
                        (localContext as EqContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 21 || _la === 22)) {
                            (localContext as EqContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 260;
                        this.expr(9);
                        }
                        break;
                    case 5:
                        {
                        localContext = new IndexContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, BoQQIParser.RULE_expr);
                        this.state = 261;
                        if (!(this.precpred(this.context, 12))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 12)");
                        }
                        this.state = 262;
                        this.match(BoQQIParser.LBRACK);
                        this.state = 263;
                        this.expr(0);
                        this.state = 264;
                        this.match(BoQQIParser.RBRACK);
                        }
                        break;
                    }
                    }
                }
                this.state = 270;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 23, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.unrollRecursionContexts(parentContext);
        }
        return localContext;
    }
    public boolean_(): BooleanContext {
        let localContext = new BooleanContext(this.context, this.state);
        this.enterRule(localContext, 40, BoQQIParser.RULE_boolean);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 271;
            _la = this.tokenStream.LA(1);
            if(!(_la === 4 || _la === 5)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public override sempred(localContext: antlr.ParserRuleContext | null, ruleIndex: number, predIndex: number): boolean {
        switch (ruleIndex) {
        case 19:
            return this.expr_sempred(localContext as ExprContext, predIndex);
        }
        return true;
    }
    private expr_sempred(localContext: ExprContext | null, predIndex: number): boolean {
        switch (predIndex) {
        case 0:
            return this.precpred(this.context, 11);
        case 1:
            return this.precpred(this.context, 10);
        case 2:
            return this.precpred(this.context, 9);
        case 3:
            return this.precpred(this.context, 8);
        case 4:
            return this.precpred(this.context, 12);
        }
        return true;
    }

    public static readonly _serializedATN: number[] = [
        4,1,40,274,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,
        2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,20,
        7,20,1,0,1,0,1,0,1,0,1,0,5,0,48,8,0,10,0,12,0,51,9,0,1,0,1,0,1,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,64,8,1,1,2,1,2,1,2,1,2,1,2,1,
        2,5,2,72,8,2,10,2,12,2,75,9,2,1,2,1,2,1,2,1,2,5,2,81,8,2,10,2,12,
        2,84,9,2,1,2,3,2,87,8,2,1,3,1,3,1,3,1,3,1,3,1,3,5,3,95,8,3,10,3,
        12,3,98,9,3,1,3,1,3,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,
        1,4,5,4,114,8,4,10,4,12,4,117,9,4,1,4,1,4,1,5,1,5,1,5,1,5,1,5,3,
        5,126,8,5,1,6,1,6,1,6,5,6,131,8,6,10,6,12,6,134,9,6,1,6,3,6,137,
        8,6,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,3,7,149,8,7,1,8,1,8,
        3,8,153,8,8,1,8,1,8,1,9,1,9,1,9,1,9,1,9,1,10,1,10,1,10,5,10,165,
        8,10,10,10,12,10,168,9,10,1,10,3,10,171,8,10,1,11,1,11,1,11,1,11,
        1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,
        1,11,1,11,1,11,3,11,193,8,11,1,11,1,11,3,11,197,8,11,1,12,1,12,1,
        12,1,12,1,12,1,12,1,12,1,12,1,12,1,12,1,13,1,13,1,13,1,13,1,13,3,
        13,214,8,13,1,13,1,13,1,13,1,14,1,14,1,14,3,14,222,8,14,1,15,1,15,
        1,15,1,15,1,15,1,16,1,16,3,16,231,8,16,1,17,1,17,1,18,1,18,1,19,
        1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,3,19,248,8,19,
        1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,
        1,19,1,19,1,19,1,19,5,19,267,8,19,10,19,12,19,270,9,19,1,20,1,20,
        1,20,0,1,38,21,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,
        36,38,40,0,7,1,0,10,11,1,0,12,13,1,0,17,19,1,0,15,16,1,0,23,26,1,
        0,21,22,1,0,4,5,294,0,49,1,0,0,0,2,63,1,0,0,0,4,65,1,0,0,0,6,88,
        1,0,0,0,8,101,1,0,0,0,10,125,1,0,0,0,12,136,1,0,0,0,14,148,1,0,0,
        0,16,150,1,0,0,0,18,156,1,0,0,0,20,170,1,0,0,0,22,196,1,0,0,0,24,
        198,1,0,0,0,26,208,1,0,0,0,28,221,1,0,0,0,30,223,1,0,0,0,32,230,
        1,0,0,0,34,232,1,0,0,0,36,234,1,0,0,0,38,247,1,0,0,0,40,271,1,0,
        0,0,42,48,3,2,1,0,43,48,3,8,4,0,44,45,3,22,11,0,45,46,5,35,0,0,46,
        48,1,0,0,0,47,42,1,0,0,0,47,43,1,0,0,0,47,44,1,0,0,0,48,51,1,0,0,
        0,49,47,1,0,0,0,49,50,1,0,0,0,50,52,1,0,0,0,51,49,1,0,0,0,52,53,
        5,0,0,1,53,1,1,0,0,0,54,64,3,4,2,0,55,64,3,6,3,0,56,57,3,18,9,0,
        57,58,5,35,0,0,58,64,1,0,0,0,59,60,3,26,13,0,60,61,5,35,0,0,61,64,
        1,0,0,0,62,64,3,16,8,0,63,54,1,0,0,0,63,55,1,0,0,0,63,56,1,0,0,0,
        63,59,1,0,0,0,63,62,1,0,0,0,64,3,1,0,0,0,65,66,5,1,0,0,66,67,5,27,
        0,0,67,68,3,38,19,0,68,69,5,28,0,0,69,73,5,29,0,0,70,72,3,2,1,0,
        71,70,1,0,0,0,72,75,1,0,0,0,73,71,1,0,0,0,73,74,1,0,0,0,74,76,1,
        0,0,0,75,73,1,0,0,0,76,86,5,30,0,0,77,78,5,2,0,0,78,82,5,29,0,0,
        79,81,3,2,1,0,80,79,1,0,0,0,81,84,1,0,0,0,82,80,1,0,0,0,82,83,1,
        0,0,0,83,85,1,0,0,0,84,82,1,0,0,0,85,87,5,30,0,0,86,77,1,0,0,0,86,
        87,1,0,0,0,87,5,1,0,0,0,88,89,5,3,0,0,89,90,5,27,0,0,90,91,3,38,
        19,0,91,92,5,28,0,0,92,96,5,29,0,0,93,95,3,2,1,0,94,93,1,0,0,0,95,
        98,1,0,0,0,96,94,1,0,0,0,96,97,1,0,0,0,97,99,1,0,0,0,98,96,1,0,0,
        0,99,100,5,30,0,0,100,7,1,0,0,0,101,102,5,8,0,0,102,103,5,39,0,0,
        103,104,5,27,0,0,104,105,3,12,6,0,105,106,5,28,0,0,106,107,5,34,
        0,0,107,108,3,10,5,0,108,115,5,29,0,0,109,114,3,2,1,0,110,111,3,
        22,11,0,111,112,5,35,0,0,112,114,1,0,0,0,113,109,1,0,0,0,113,110,
        1,0,0,0,114,117,1,0,0,0,115,113,1,0,0,0,115,116,1,0,0,0,116,118,
        1,0,0,0,117,115,1,0,0,0,118,119,5,30,0,0,119,9,1,0,0,0,120,121,3,
        34,17,0,121,122,3,24,12,0,122,126,1,0,0,0,123,126,3,36,18,0,124,
        126,5,14,0,0,125,120,1,0,0,0,125,123,1,0,0,0,125,124,1,0,0,0,126,
        11,1,0,0,0,127,132,3,14,7,0,128,129,5,33,0,0,129,131,3,14,7,0,130,
        128,1,0,0,0,131,134,1,0,0,0,132,130,1,0,0,0,132,133,1,0,0,0,133,
        137,1,0,0,0,134,132,1,0,0,0,135,137,1,0,0,0,136,127,1,0,0,0,136,
        135,1,0,0,0,137,13,1,0,0,0,138,139,3,34,17,0,139,140,3,24,12,0,140,
        141,5,39,0,0,141,149,1,0,0,0,142,143,3,36,18,0,143,144,5,39,0,0,
        144,149,1,0,0,0,145,146,3,30,15,0,146,147,5,39,0,0,147,149,1,0,0,
        0,148,138,1,0,0,0,148,142,1,0,0,0,148,145,1,0,0,0,149,15,1,0,0,0,
        150,152,5,9,0,0,151,153,3,38,19,0,152,151,1,0,0,0,152,153,1,0,0,
        0,153,154,1,0,0,0,154,155,5,35,0,0,155,17,1,0,0,0,156,157,5,39,0,
        0,157,158,5,27,0,0,158,159,3,20,10,0,159,160,5,28,0,0,160,19,1,0,
        0,0,161,166,3,38,19,0,162,163,5,33,0,0,163,165,3,38,19,0,164,162,
        1,0,0,0,165,168,1,0,0,0,166,164,1,0,0,0,166,167,1,0,0,0,167,171,
        1,0,0,0,168,166,1,0,0,0,169,171,1,0,0,0,170,161,1,0,0,0,170,169,
        1,0,0,0,171,21,1,0,0,0,172,173,3,34,17,0,173,174,3,24,12,0,174,175,
        5,39,0,0,175,197,1,0,0,0,176,177,3,34,17,0,177,178,3,24,12,0,178,
        179,5,39,0,0,179,180,5,20,0,0,180,181,3,38,19,0,181,197,1,0,0,0,
        182,183,3,36,18,0,183,184,5,39,0,0,184,197,1,0,0,0,185,186,3,36,
        18,0,186,187,5,39,0,0,187,188,5,20,0,0,188,189,3,38,19,0,189,197,
        1,0,0,0,190,192,3,30,15,0,191,193,3,24,12,0,192,191,1,0,0,0,192,
        193,1,0,0,0,193,194,1,0,0,0,194,195,5,39,0,0,195,197,1,0,0,0,196,
        172,1,0,0,0,196,176,1,0,0,0,196,182,1,0,0,0,196,185,1,0,0,0,196,
        190,1,0,0,0,197,23,1,0,0,0,198,199,5,29,0,0,199,200,5,6,0,0,200,
        201,5,34,0,0,201,202,3,38,19,0,202,203,5,33,0,0,203,204,5,7,0,0,
        204,205,5,34,0,0,205,206,3,38,19,0,206,207,5,30,0,0,207,25,1,0,0,
        0,208,213,5,39,0,0,209,210,5,31,0,0,210,211,3,38,19,0,211,212,5,
        32,0,0,212,214,1,0,0,0,213,209,1,0,0,0,213,214,1,0,0,0,214,215,1,
        0,0,0,215,216,5,20,0,0,216,217,3,38,19,0,217,27,1,0,0,0,218,222,
        3,34,17,0,219,222,3,36,18,0,220,222,3,30,15,0,221,218,1,0,0,0,221,
        219,1,0,0,0,221,220,1,0,0,0,222,29,1,0,0,0,223,224,3,32,16,0,224,
        225,5,31,0,0,225,226,5,37,0,0,226,227,5,32,0,0,227,31,1,0,0,0,228,
        231,3,34,17,0,229,231,3,36,18,0,230,228,1,0,0,0,230,229,1,0,0,0,
        231,33,1,0,0,0,232,233,7,0,0,0,233,35,1,0,0,0,234,235,7,1,0,0,235,
        37,1,0,0,0,236,237,6,19,-1,0,237,238,5,27,0,0,238,239,3,38,19,0,
        239,240,5,28,0,0,240,248,1,0,0,0,241,248,5,36,0,0,242,248,5,37,0,
        0,243,248,5,38,0,0,244,248,3,40,20,0,245,248,3,18,9,0,246,248,5,
        39,0,0,247,236,1,0,0,0,247,241,1,0,0,0,247,242,1,0,0,0,247,243,1,
        0,0,0,247,244,1,0,0,0,247,245,1,0,0,0,247,246,1,0,0,0,248,268,1,
        0,0,0,249,250,10,11,0,0,250,251,7,2,0,0,251,267,3,38,19,12,252,253,
        10,10,0,0,253,254,7,3,0,0,254,267,3,38,19,11,255,256,10,9,0,0,256,
        257,7,4,0,0,257,267,3,38,19,10,258,259,10,8,0,0,259,260,7,5,0,0,
        260,267,3,38,19,9,261,262,10,12,0,0,262,263,5,31,0,0,263,264,3,38,
        19,0,264,265,5,32,0,0,265,267,1,0,0,0,266,249,1,0,0,0,266,252,1,
        0,0,0,266,255,1,0,0,0,266,258,1,0,0,0,266,261,1,0,0,0,267,270,1,
        0,0,0,268,266,1,0,0,0,268,269,1,0,0,0,269,39,1,0,0,0,270,268,1,0,
        0,0,271,272,7,6,0,0,272,41,1,0,0,0,24,47,49,63,73,82,86,96,113,115,
        125,132,136,148,152,166,170,192,196,213,221,230,247,266,268
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!BoQQIParser.__ATN) {
            BoQQIParser.__ATN = new antlr.ATNDeserializer().deserialize(BoQQIParser._serializedATN);
        }

        return BoQQIParser.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(BoQQIParser.literalNames, BoQQIParser.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return BoQQIParser.vocabulary;
    }

    private static readonly decisionsToDFA = BoQQIParser._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}

export class ProgramContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.EOF, 0)!;
    }
    public statement(): StatementContext[];
    public statement(i: number): StatementContext | null;
    public statement(i?: number): StatementContext[] | StatementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StatementContext);
        }

        return this.getRuleContext(i, StatementContext);
    }
    public function_(): FunctionContext[];
    public function_(i: number): FunctionContext | null;
    public function_(i?: number): FunctionContext[] | FunctionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(FunctionContext);
        }

        return this.getRuleContext(i, FunctionContext);
    }
    public declaration(): DeclarationContext[];
    public declaration(i: number): DeclarationContext | null;
    public declaration(i?: number): DeclarationContext[] | DeclarationContext | null {
        if (i === undefined) {
            return this.getRuleContexts(DeclarationContext);
        }

        return this.getRuleContext(i, DeclarationContext);
    }
    public SEMI(): antlr.TerminalNode[];
    public SEMI(i: number): antlr.TerminalNode | null;
    public SEMI(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(BoQQIParser.SEMI);
    	} else {
    		return this.getToken(BoQQIParser.SEMI, i);
    	}
    }
    public override get ruleIndex(): number {
        return BoQQIParser.RULE_program;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterProgram) {
             listener.enterProgram(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitProgram) {
             listener.exitProgram(this);
        }
    }
}


export class StatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public if(): IfContext | null {
        return this.getRuleContext(0, IfContext);
    }
    public while(): WhileContext | null {
        return this.getRuleContext(0, WhileContext);
    }
    public call(): CallContext | null {
        return this.getRuleContext(0, CallContext);
    }
    public SEMI(): antlr.TerminalNode | null {
        return this.getToken(BoQQIParser.SEMI, 0);
    }
    public assign(): AssignContext | null {
        return this.getRuleContext(0, AssignContext);
    }
    public return(): ReturnContext | null {
        return this.getRuleContext(0, ReturnContext);
    }
    public override get ruleIndex(): number {
        return BoQQIParser.RULE_statement;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterStatement) {
             listener.enterStatement(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitStatement) {
             listener.exitStatement(this);
        }
    }
}


export class IfContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public IF(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.IF, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.LPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.RPAREN, 0)!;
    }
    public LBRACE(): antlr.TerminalNode[];
    public LBRACE(i: number): antlr.TerminalNode | null;
    public LBRACE(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(BoQQIParser.LBRACE);
    	} else {
    		return this.getToken(BoQQIParser.LBRACE, i);
    	}
    }
    public RBRACE(): antlr.TerminalNode[];
    public RBRACE(i: number): antlr.TerminalNode | null;
    public RBRACE(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(BoQQIParser.RBRACE);
    	} else {
    		return this.getToken(BoQQIParser.RBRACE, i);
    	}
    }
    public statement(): StatementContext[];
    public statement(i: number): StatementContext | null;
    public statement(i?: number): StatementContext[] | StatementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StatementContext);
        }

        return this.getRuleContext(i, StatementContext);
    }
    public ELSE(): antlr.TerminalNode | null {
        return this.getToken(BoQQIParser.ELSE, 0);
    }
    public override get ruleIndex(): number {
        return BoQQIParser.RULE_if;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterIf) {
             listener.enterIf(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitIf) {
             listener.exitIf(this);
        }
    }
}


export class WhileContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public WHILE(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.WHILE, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.LPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.RPAREN, 0)!;
    }
    public LBRACE(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.LBRACE, 0)!;
    }
    public RBRACE(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.RBRACE, 0)!;
    }
    public statement(): StatementContext[];
    public statement(i: number): StatementContext | null;
    public statement(i?: number): StatementContext[] | StatementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StatementContext);
        }

        return this.getRuleContext(i, StatementContext);
    }
    public override get ruleIndex(): number {
        return BoQQIParser.RULE_while;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterWhile) {
             listener.enterWhile(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitWhile) {
             listener.exitWhile(this);
        }
    }
}


export class FunctionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public FUNC(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.FUNC, 0)!;
    }
    public IDENT(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.IDENT, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.LPAREN, 0)!;
    }
    public params(): ParamsContext {
        return this.getRuleContext(0, ParamsContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.RPAREN, 0)!;
    }
    public COLON(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.COLON, 0)!;
    }
    public returnType(): ReturnTypeContext {
        return this.getRuleContext(0, ReturnTypeContext)!;
    }
    public LBRACE(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.LBRACE, 0)!;
    }
    public RBRACE(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.RBRACE, 0)!;
    }
    public statement(): StatementContext[];
    public statement(i: number): StatementContext | null;
    public statement(i?: number): StatementContext[] | StatementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StatementContext);
        }

        return this.getRuleContext(i, StatementContext);
    }
    public declaration(): DeclarationContext[];
    public declaration(i: number): DeclarationContext | null;
    public declaration(i?: number): DeclarationContext[] | DeclarationContext | null {
        if (i === undefined) {
            return this.getRuleContexts(DeclarationContext);
        }

        return this.getRuleContext(i, DeclarationContext);
    }
    public SEMI(): antlr.TerminalNode[];
    public SEMI(i: number): antlr.TerminalNode | null;
    public SEMI(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(BoQQIParser.SEMI);
    	} else {
    		return this.getToken(BoQQIParser.SEMI, i);
    	}
    }
    public override get ruleIndex(): number {
        return BoQQIParser.RULE_function;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterFunction) {
             listener.enterFunction(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitFunction) {
             listener.exitFunction(this);
        }
    }
}


export class ReturnTypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public numericType(): NumericTypeContext | null {
        return this.getRuleContext(0, NumericTypeContext);
    }
    public domain(): DomainContext | null {
        return this.getRuleContext(0, DomainContext);
    }
    public nonNumericType(): NonNumericTypeContext | null {
        return this.getRuleContext(0, NonNumericTypeContext);
    }
    public TYPE_VOID(): antlr.TerminalNode | null {
        return this.getToken(BoQQIParser.TYPE_VOID, 0);
    }
    public override get ruleIndex(): number {
        return BoQQIParser.RULE_returnType;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterReturnType) {
             listener.enterReturnType(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitReturnType) {
             listener.exitReturnType(this);
        }
    }
}


export class ParamsContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public param(): ParamContext[];
    public param(i: number): ParamContext | null;
    public param(i?: number): ParamContext[] | ParamContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ParamContext);
        }

        return this.getRuleContext(i, ParamContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(BoQQIParser.COMMA);
    	} else {
    		return this.getToken(BoQQIParser.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return BoQQIParser.RULE_params;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterParams) {
             listener.enterParams(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitParams) {
             listener.exitParams(this);
        }
    }
}


export class ParamContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public numericType(): NumericTypeContext | null {
        return this.getRuleContext(0, NumericTypeContext);
    }
    public domain(): DomainContext | null {
        return this.getRuleContext(0, DomainContext);
    }
    public IDENT(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.IDENT, 0)!;
    }
    public nonNumericType(): NonNumericTypeContext | null {
        return this.getRuleContext(0, NonNumericTypeContext);
    }
    public arrayType(): ArrayTypeContext | null {
        return this.getRuleContext(0, ArrayTypeContext);
    }
    public override get ruleIndex(): number {
        return BoQQIParser.RULE_param;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterParam) {
             listener.enterParam(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitParam) {
             listener.exitParam(this);
        }
    }
}


export class ReturnContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public RETURN(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.RETURN, 0)!;
    }
    public SEMI(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.SEMI, 0)!;
    }
    public expr(): ExprContext | null {
        return this.getRuleContext(0, ExprContext);
    }
    public override get ruleIndex(): number {
        return BoQQIParser.RULE_return;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterReturn) {
             listener.enterReturn(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitReturn) {
             listener.exitReturn(this);
        }
    }
}


export class CallContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public IDENT(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.IDENT, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.LPAREN, 0)!;
    }
    public args(): ArgsContext {
        return this.getRuleContext(0, ArgsContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.RPAREN, 0)!;
    }
    public override get ruleIndex(): number {
        return BoQQIParser.RULE_call;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterCall) {
             listener.enterCall(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitCall) {
             listener.exitCall(this);
        }
    }
}


export class ArgsContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(BoQQIParser.COMMA);
    	} else {
    		return this.getToken(BoQQIParser.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return BoQQIParser.RULE_args;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterArgs) {
             listener.enterArgs(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitArgs) {
             listener.exitArgs(this);
        }
    }
}


export class DeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public numericType(): NumericTypeContext | null {
        return this.getRuleContext(0, NumericTypeContext);
    }
    public domain(): DomainContext | null {
        return this.getRuleContext(0, DomainContext);
    }
    public IDENT(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.IDENT, 0)!;
    }
    public EQUAL(): antlr.TerminalNode | null {
        return this.getToken(BoQQIParser.EQUAL, 0);
    }
    public expr(): ExprContext | null {
        return this.getRuleContext(0, ExprContext);
    }
    public nonNumericType(): NonNumericTypeContext | null {
        return this.getRuleContext(0, NonNumericTypeContext);
    }
    public arrayType(): ArrayTypeContext | null {
        return this.getRuleContext(0, ArrayTypeContext);
    }
    public override get ruleIndex(): number {
        return BoQQIParser.RULE_declaration;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterDeclaration) {
             listener.enterDeclaration(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitDeclaration) {
             listener.exitDeclaration(this);
        }
    }
}


export class DomainContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LBRACE(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.LBRACE, 0)!;
    }
    public MAX(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.MAX, 0)!;
    }
    public COLON(): antlr.TerminalNode[];
    public COLON(i: number): antlr.TerminalNode | null;
    public COLON(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(BoQQIParser.COLON);
    	} else {
    		return this.getToken(BoQQIParser.COLON, i);
    	}
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public COMMA(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.COMMA, 0)!;
    }
    public MIN(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.MIN, 0)!;
    }
    public RBRACE(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.RBRACE, 0)!;
    }
    public override get ruleIndex(): number {
        return BoQQIParser.RULE_domain;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterDomain) {
             listener.enterDomain(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitDomain) {
             listener.exitDomain(this);
        }
    }
}


export class AssignContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public IDENT(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.IDENT, 0)!;
    }
    public EQUAL(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.EQUAL, 0)!;
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public LBRACK(): antlr.TerminalNode | null {
        return this.getToken(BoQQIParser.LBRACK, 0);
    }
    public RBRACK(): antlr.TerminalNode | null {
        return this.getToken(BoQQIParser.RBRACK, 0);
    }
    public override get ruleIndex(): number {
        return BoQQIParser.RULE_assign;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterAssign) {
             listener.enterAssign(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitAssign) {
             listener.exitAssign(this);
        }
    }
}


export class TypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public numericType(): NumericTypeContext | null {
        return this.getRuleContext(0, NumericTypeContext);
    }
    public nonNumericType(): NonNumericTypeContext | null {
        return this.getRuleContext(0, NonNumericTypeContext);
    }
    public arrayType(): ArrayTypeContext | null {
        return this.getRuleContext(0, ArrayTypeContext);
    }
    public override get ruleIndex(): number {
        return BoQQIParser.RULE_type;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterType) {
             listener.enterType(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitType) {
             listener.exitType(this);
        }
    }
}


export class ArrayTypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public elementType(): ElementTypeContext {
        return this.getRuleContext(0, ElementTypeContext)!;
    }
    public LBRACK(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.LBRACK, 0)!;
    }
    public INT(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.INT, 0)!;
    }
    public RBRACK(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.RBRACK, 0)!;
    }
    public override get ruleIndex(): number {
        return BoQQIParser.RULE_arrayType;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterArrayType) {
             listener.enterArrayType(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitArrayType) {
             listener.exitArrayType(this);
        }
    }
}


export class ElementTypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public numericType(): NumericTypeContext | null {
        return this.getRuleContext(0, NumericTypeContext);
    }
    public nonNumericType(): NonNumericTypeContext | null {
        return this.getRuleContext(0, NonNumericTypeContext);
    }
    public override get ruleIndex(): number {
        return BoQQIParser.RULE_elementType;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterElementType) {
             listener.enterElementType(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitElementType) {
             listener.exitElementType(this);
        }
    }
}


export class NumericTypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public TYPE_INT(): antlr.TerminalNode | null {
        return this.getToken(BoQQIParser.TYPE_INT, 0);
    }
    public TYPE_FLOAT(): antlr.TerminalNode | null {
        return this.getToken(BoQQIParser.TYPE_FLOAT, 0);
    }
    public override get ruleIndex(): number {
        return BoQQIParser.RULE_numericType;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterNumericType) {
             listener.enterNumericType(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitNumericType) {
             listener.exitNumericType(this);
        }
    }
}


export class NonNumericTypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public TYPE_STRING(): antlr.TerminalNode | null {
        return this.getToken(BoQQIParser.TYPE_STRING, 0);
    }
    public TYPE_BOOL(): antlr.TerminalNode | null {
        return this.getToken(BoQQIParser.TYPE_BOOL, 0);
    }
    public override get ruleIndex(): number {
        return BoQQIParser.RULE_nonNumericType;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterNonNumericType) {
             listener.enterNonNumericType(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitNonNumericType) {
             listener.exitNonNumericType(this);
        }
    }
}


export class ExprContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return BoQQIParser.RULE_expr;
    }
    public override copyFrom(ctx: ExprContext): void {
        super.copyFrom(ctx);
    }
}
export class ParensContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.LPAREN, 0)!;
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.RPAREN, 0)!;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterParens) {
             listener.enterParens(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitParens) {
             listener.exitParens(this);
        }
    }
}
export class FloatContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public FLOAT(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.FLOAT, 0)!;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterFloat) {
             listener.enterFloat(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitFloat) {
             listener.exitFloat(this);
        }
    }
}
export class IntContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public INT(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.INT, 0)!;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterInt) {
             listener.enterInt(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitInt) {
             listener.exitInt(this);
        }
    }
}
export class StringContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public STRING(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.STRING, 0)!;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterString) {
             listener.enterString(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitString) {
             listener.exitString(this);
        }
    }
}
export class BoolContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public boolean(): BooleanContext {
        return this.getRuleContext(0, BooleanContext)!;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterBool) {
             listener.enterBool(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitBool) {
             listener.exitBool(this);
        }
    }
}
export class CallExprContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public call(): CallContext {
        return this.getRuleContext(0, CallContext)!;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterCallExpr) {
             listener.enterCallExpr(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitCallExpr) {
             listener.exitCallExpr(this);
        }
    }
}
export class VarContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public IDENT(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.IDENT, 0)!;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterVar) {
             listener.enterVar(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitVar) {
             listener.exitVar(this);
        }
    }
}
export class MulDivContext extends ExprContext {
    public _op?: Token | null;
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public MUL(): antlr.TerminalNode | null {
        return this.getToken(BoQQIParser.MUL, 0);
    }
    public DIV(): antlr.TerminalNode | null {
        return this.getToken(BoQQIParser.DIV, 0);
    }
    public MOD(): antlr.TerminalNode | null {
        return this.getToken(BoQQIParser.MOD, 0);
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterMulDiv) {
             listener.enterMulDiv(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitMulDiv) {
             listener.exitMulDiv(this);
        }
    }
}
export class AddSubContext extends ExprContext {
    public _op?: Token | null;
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public PLUS(): antlr.TerminalNode | null {
        return this.getToken(BoQQIParser.PLUS, 0);
    }
    public MINUS(): antlr.TerminalNode | null {
        return this.getToken(BoQQIParser.MINUS, 0);
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterAddSub) {
             listener.enterAddSub(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitAddSub) {
             listener.exitAddSub(this);
        }
    }
}
export class CompContext extends ExprContext {
    public _op?: Token | null;
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public GE(): antlr.TerminalNode | null {
        return this.getToken(BoQQIParser.GE, 0);
    }
    public LE(): antlr.TerminalNode | null {
        return this.getToken(BoQQIParser.LE, 0);
    }
    public GT(): antlr.TerminalNode | null {
        return this.getToken(BoQQIParser.GT, 0);
    }
    public LT(): antlr.TerminalNode | null {
        return this.getToken(BoQQIParser.LT, 0);
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterComp) {
             listener.enterComp(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitComp) {
             listener.exitComp(this);
        }
    }
}
export class EqContext extends ExprContext {
    public _op?: Token | null;
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public EQ(): antlr.TerminalNode | null {
        return this.getToken(BoQQIParser.EQ, 0);
    }
    public NE(): antlr.TerminalNode | null {
        return this.getToken(BoQQIParser.NE, 0);
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterEq) {
             listener.enterEq(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitEq) {
             listener.exitEq(this);
        }
    }
}
export class IndexContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public LBRACK(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.LBRACK, 0)!;
    }
    public RBRACK(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.RBRACK, 0)!;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterIndex) {
             listener.enterIndex(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitIndex) {
             listener.exitIndex(this);
        }
    }
}


export class BooleanContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public TRUE(): antlr.TerminalNode | null {
        return this.getToken(BoQQIParser.TRUE, 0);
    }
    public FALSE(): antlr.TerminalNode | null {
        return this.getToken(BoQQIParser.FALSE, 0);
    }
    public override get ruleIndex(): number {
        return BoQQIParser.RULE_boolean;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterBoolean) {
             listener.enterBoolean(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitBoolean) {
             listener.exitBoolean(this);
        }
    }
}
