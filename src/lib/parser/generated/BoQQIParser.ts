
import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

import { BoQQIParserListener } from "./BoQQIParserListener.js";
// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;


export class BoQQIParser extends antlr.Parser {
    public static readonly IF = 1;
    public static readonly ELSE = 2;
    public static readonly TRUE = 3;
    public static readonly FALSE = 4;
    public static readonly MAX = 5;
    public static readonly MIN = 6;
    public static readonly FUNC = 7;
    public static readonly RETURN = 8;
    public static readonly TYPE_INT = 9;
    public static readonly TYPE_FLOAT = 10;
    public static readonly TYPE_STRING = 11;
    public static readonly TYPE_BOOL = 12;
    public static readonly PLUS = 13;
    public static readonly MINUS = 14;
    public static readonly MUL = 15;
    public static readonly DIV = 16;
    public static readonly EQUAL = 17;
    public static readonly EQ = 18;
    public static readonly NE = 19;
    public static readonly GE = 20;
    public static readonly LE = 21;
    public static readonly GT = 22;
    public static readonly LT = 23;
    public static readonly LPAREN = 24;
    public static readonly RPAREN = 25;
    public static readonly LBRACE = 26;
    public static readonly RBRACE = 27;
    public static readonly COMMA = 28;
    public static readonly COLON = 29;
    public static readonly SEMI = 30;
    public static readonly FLOAT = 31;
    public static readonly INT = 32;
    public static readonly STRING = 33;
    public static readonly IDENT = 34;
    public static readonly WS = 35;
    public static readonly RULE_program = 0;
    public static readonly RULE_statement = 1;
    public static readonly RULE_if = 2;
    public static readonly RULE_function = 3;
    public static readonly RULE_returnType = 4;
    public static readonly RULE_params = 5;
    public static readonly RULE_param = 6;
    public static readonly RULE_return = 7;
    public static readonly RULE_call = 8;
    public static readonly RULE_args = 9;
    public static readonly RULE_declare = 10;
    public static readonly RULE_domain = 11;
    public static readonly RULE_assign = 12;
    public static readonly RULE_type = 13;
    public static readonly RULE_numericType = 14;
    public static readonly RULE_nonNumericType = 15;
    public static readonly RULE_expr = 16;
    public static readonly RULE_boolean = 17;

    public static readonly literalNames = [
        null, "'if'", "'else'", "'true'", "'false'", "'max'", "'min'", "'function'", 
        "'return'", "'int'", "'float'", "'string'", "'bool'", "'+'", "'-'", 
        "'*'", "'/'", "'='", "'=='", "'!='", "'>='", "'<='", "'>'", "'<'", 
        "'('", "')'", "'{'", "'}'", "','", "':'", "';'"
    ];

    public static readonly symbolicNames = [
        null, "IF", "ELSE", "TRUE", "FALSE", "MAX", "MIN", "FUNC", "RETURN", 
        "TYPE_INT", "TYPE_FLOAT", "TYPE_STRING", "TYPE_BOOL", "PLUS", "MINUS", 
        "MUL", "DIV", "EQUAL", "EQ", "NE", "GE", "LE", "GT", "LT", "LPAREN", 
        "RPAREN", "LBRACE", "RBRACE", "COMMA", "COLON", "SEMI", "FLOAT", 
        "INT", "STRING", "IDENT", "WS"
    ];
    public static readonly ruleNames = [
        "program", "statement", "if", "function", "returnType", "params", 
        "param", "return", "call", "args", "declare", "domain", "assign", 
        "type", "numericType", "nonNumericType", "expr", "boolean",
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
            this.state = 39;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 8066) !== 0) || _la === 34) {
                {
                {
                this.state = 36;
                this.statement();
                }
                }
                this.state = 41;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 42;
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
            this.state = 56;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 1, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 44;
                this.if_();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 45;
                this.function_();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 46;
                this.call();
                this.state = 47;
                this.match(BoQQIParser.SEMI);
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 49;
                this.declare_();
                this.state = 50;
                this.match(BoQQIParser.SEMI);
                }
                break;
            case 5:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 52;
                this.assign();
                this.state = 53;
                this.match(BoQQIParser.SEMI);
                }
                break;
            case 6:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 55;
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
            this.state = 58;
            this.match(BoQQIParser.IF);
            this.state = 59;
            this.match(BoQQIParser.LPAREN);
            this.state = 60;
            this.expr(0);
            this.state = 61;
            this.match(BoQQIParser.RPAREN);
            this.state = 62;
            this.match(BoQQIParser.LBRACE);
            this.state = 66;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 8066) !== 0) || _la === 34) {
                {
                {
                this.state = 63;
                this.statement();
                }
                }
                this.state = 68;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 69;
            this.match(BoQQIParser.RBRACE);
            this.state = 79;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 2) {
                {
                this.state = 70;
                this.match(BoQQIParser.ELSE);
                this.state = 71;
                this.match(BoQQIParser.LBRACE);
                this.state = 75;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 8066) !== 0) || _la === 34) {
                    {
                    {
                    this.state = 72;
                    this.statement();
                    }
                    }
                    this.state = 77;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 78;
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
    public function_(): FunctionContext {
        let localContext = new FunctionContext(this.context, this.state);
        this.enterRule(localContext, 6, BoQQIParser.RULE_function);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 81;
            this.match(BoQQIParser.FUNC);
            this.state = 82;
            this.match(BoQQIParser.IDENT);
            this.state = 83;
            this.match(BoQQIParser.LPAREN);
            this.state = 84;
            this.params();
            this.state = 85;
            this.match(BoQQIParser.RPAREN);
            this.state = 86;
            this.match(BoQQIParser.COLON);
            this.state = 87;
            this.returnType();
            this.state = 88;
            this.match(BoQQIParser.LBRACE);
            this.state = 92;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 8066) !== 0) || _la === 34) {
                {
                {
                this.state = 89;
                this.statement();
                }
                }
                this.state = 94;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 95;
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
        this.enterRule(localContext, 8, BoQQIParser.RULE_returnType);
        try {
            this.state = 101;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case BoQQIParser.TYPE_INT:
            case BoQQIParser.TYPE_FLOAT:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 97;
                this.numericType();
                this.state = 98;
                this.domain();
                }
                break;
            case BoQQIParser.TYPE_STRING:
            case BoQQIParser.TYPE_BOOL:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 100;
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
    public params(): ParamsContext {
        let localContext = new ParamsContext(this.context, this.state);
        this.enterRule(localContext, 10, BoQQIParser.RULE_params);
        let _la: number;
        try {
            this.state = 112;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case BoQQIParser.TYPE_INT:
            case BoQQIParser.TYPE_FLOAT:
            case BoQQIParser.TYPE_STRING:
            case BoQQIParser.TYPE_BOOL:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 103;
                this.param();
                this.state = 108;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 28) {
                    {
                    {
                    this.state = 104;
                    this.match(BoQQIParser.COMMA);
                    this.state = 105;
                    this.param();
                    }
                    }
                    this.state = 110;
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
        this.enterRule(localContext, 12, BoQQIParser.RULE_param);
        try {
            this.state = 121;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case BoQQIParser.TYPE_INT:
            case BoQQIParser.TYPE_FLOAT:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 114;
                this.numericType();
                this.state = 115;
                this.domain();
                this.state = 116;
                this.match(BoQQIParser.IDENT);
                }
                break;
            case BoQQIParser.TYPE_STRING:
            case BoQQIParser.TYPE_BOOL:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 118;
                this.nonNumericType();
                this.state = 119;
                this.match(BoQQIParser.IDENT);
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
    public return_(): ReturnContext {
        let localContext = new ReturnContext(this.context, this.state);
        this.enterRule(localContext, 14, BoQQIParser.RULE_return);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 123;
            this.match(BoQQIParser.RETURN);
            this.state = 124;
            this.expr(0);
            this.state = 125;
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
        this.enterRule(localContext, 16, BoQQIParser.RULE_call);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 127;
            this.match(BoQQIParser.IDENT);
            this.state = 128;
            this.match(BoQQIParser.LPAREN);
            this.state = 129;
            this.args();
            this.state = 130;
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
        this.enterRule(localContext, 18, BoQQIParser.RULE_args);
        let _la: number;
        try {
            this.state = 141;
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
                this.state = 132;
                this.expr(0);
                this.state = 137;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 28) {
                    {
                    {
                    this.state = 133;
                    this.match(BoQQIParser.COMMA);
                    this.state = 134;
                    this.expr(0);
                    }
                    }
                    this.state = 139;
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
    public declare_(): DeclareContext {
        let localContext = new DeclareContext(this.context, this.state);
        this.enterRule(localContext, 20, BoQQIParser.RULE_declare);
        try {
            this.state = 161;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 12, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 143;
                this.numericType();
                this.state = 144;
                this.domain();
                this.state = 145;
                this.match(BoQQIParser.IDENT);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 147;
                this.numericType();
                this.state = 148;
                this.domain();
                this.state = 149;
                this.match(BoQQIParser.IDENT);
                this.state = 150;
                this.match(BoQQIParser.EQUAL);
                this.state = 151;
                this.expr(0);
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 153;
                this.nonNumericType();
                this.state = 154;
                this.match(BoQQIParser.IDENT);
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 156;
                this.nonNumericType();
                this.state = 157;
                this.match(BoQQIParser.IDENT);
                this.state = 158;
                this.match(BoQQIParser.EQUAL);
                this.state = 159;
                this.expr(0);
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
        this.enterRule(localContext, 22, BoQQIParser.RULE_domain);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 163;
            this.match(BoQQIParser.LBRACE);
            this.state = 164;
            this.match(BoQQIParser.MAX);
            this.state = 165;
            this.match(BoQQIParser.COLON);
            this.state = 166;
            this.expr(0);
            this.state = 167;
            this.match(BoQQIParser.COMMA);
            this.state = 168;
            this.match(BoQQIParser.MIN);
            this.state = 169;
            this.match(BoQQIParser.COLON);
            this.state = 170;
            this.expr(0);
            this.state = 171;
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
        this.enterRule(localContext, 24, BoQQIParser.RULE_assign);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 173;
            this.match(BoQQIParser.IDENT);
            this.state = 174;
            this.match(BoQQIParser.EQUAL);
            this.state = 175;
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
        this.enterRule(localContext, 26, BoQQIParser.RULE_type);
        try {
            this.state = 179;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case BoQQIParser.TYPE_INT:
            case BoQQIParser.TYPE_FLOAT:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 177;
                this.numericType();
                }
                break;
            case BoQQIParser.TYPE_STRING:
            case BoQQIParser.TYPE_BOOL:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 178;
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
        this.enterRule(localContext, 28, BoQQIParser.RULE_numericType);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 181;
            _la = this.tokenStream.LA(1);
            if(!(_la === 9 || _la === 10)) {
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
        this.enterRule(localContext, 30, BoQQIParser.RULE_nonNumericType);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 183;
            _la = this.tokenStream.LA(1);
            if(!(_la === 11 || _la === 12)) {
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
        let _startState = 32;
        this.enterRecursionRule(localContext, 32, BoQQIParser.RULE_expr, _p);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 196;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 14, this.context) ) {
            case 1:
                {
                localContext = new ParensContext(localContext);
                this.context = localContext;
                previousContext = localContext;

                this.state = 186;
                this.match(BoQQIParser.LPAREN);
                this.state = 187;
                this.expr(0);
                this.state = 188;
                this.match(BoQQIParser.RPAREN);
                }
                break;
            case 2:
                {
                localContext = new FloatContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 190;
                this.match(BoQQIParser.FLOAT);
                }
                break;
            case 3:
                {
                localContext = new IntContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 191;
                this.match(BoQQIParser.INT);
                }
                break;
            case 4:
                {
                localContext = new StringContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 192;
                this.match(BoQQIParser.STRING);
                }
                break;
            case 5:
                {
                localContext = new BoolContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 193;
                this.boolean_();
                }
                break;
            case 6:
                {
                localContext = new CallExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 194;
                this.call();
                }
                break;
            case 7:
                {
                localContext = new VarContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 195;
                this.match(BoQQIParser.IDENT);
                }
                break;
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 212;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 16, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 210;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 15, this.context) ) {
                    case 1:
                        {
                        localContext = new MulDivContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, BoQQIParser.RULE_expr);
                        this.state = 198;
                        if (!(this.precpred(this.context, 11))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 11)");
                        }
                        this.state = 199;
                        (localContext as MulDivContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 15 || _la === 16)) {
                            (localContext as MulDivContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 200;
                        this.expr(12);
                        }
                        break;
                    case 2:
                        {
                        localContext = new AddSubContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, BoQQIParser.RULE_expr);
                        this.state = 201;
                        if (!(this.precpred(this.context, 10))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 10)");
                        }
                        this.state = 202;
                        (localContext as AddSubContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 13 || _la === 14)) {
                            (localContext as AddSubContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 203;
                        this.expr(11);
                        }
                        break;
                    case 3:
                        {
                        localContext = new CompContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, BoQQIParser.RULE_expr);
                        this.state = 204;
                        if (!(this.precpred(this.context, 9))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 9)");
                        }
                        this.state = 205;
                        (localContext as CompContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 15728640) !== 0))) {
                            (localContext as CompContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 206;
                        this.expr(10);
                        }
                        break;
                    case 4:
                        {
                        localContext = new EqContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, BoQQIParser.RULE_expr);
                        this.state = 207;
                        if (!(this.precpred(this.context, 8))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 8)");
                        }
                        this.state = 208;
                        (localContext as EqContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 18 || _la === 19)) {
                            (localContext as EqContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 209;
                        this.expr(9);
                        }
                        break;
                    }
                    }
                }
                this.state = 214;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 16, this.context);
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
        this.enterRule(localContext, 34, BoQQIParser.RULE_boolean);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 215;
            _la = this.tokenStream.LA(1);
            if(!(_la === 3 || _la === 4)) {
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
        case 16:
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
        }
        return true;
    }

    public static readonly _serializedATN: number[] = [
        4,1,35,218,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,
        2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,1,0,5,0,38,8,0,10,0,12,0,
        41,9,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,
        1,57,8,1,1,2,1,2,1,2,1,2,1,2,1,2,5,2,65,8,2,10,2,12,2,68,9,2,1,2,
        1,2,1,2,1,2,5,2,74,8,2,10,2,12,2,77,9,2,1,2,3,2,80,8,2,1,3,1,3,1,
        3,1,3,1,3,1,3,1,3,1,3,1,3,5,3,91,8,3,10,3,12,3,94,9,3,1,3,1,3,1,
        4,1,4,1,4,1,4,3,4,102,8,4,1,5,1,5,1,5,5,5,107,8,5,10,5,12,5,110,
        9,5,1,5,3,5,113,8,5,1,6,1,6,1,6,1,6,1,6,1,6,1,6,3,6,122,8,6,1,7,
        1,7,1,7,1,7,1,8,1,8,1,8,1,8,1,8,1,9,1,9,1,9,5,9,136,8,9,10,9,12,
        9,139,9,9,1,9,3,9,142,8,9,1,10,1,10,1,10,1,10,1,10,1,10,1,10,1,10,
        1,10,1,10,1,10,1,10,1,10,1,10,1,10,1,10,1,10,1,10,3,10,162,8,10,
        1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,12,1,12,1,12,
        1,12,1,13,1,13,3,13,180,8,13,1,14,1,14,1,15,1,15,1,16,1,16,1,16,
        1,16,1,16,1,16,1,16,1,16,1,16,1,16,1,16,3,16,197,8,16,1,16,1,16,
        1,16,1,16,1,16,1,16,1,16,1,16,1,16,1,16,1,16,1,16,5,16,211,8,16,
        10,16,12,16,214,9,16,1,17,1,17,1,17,0,1,32,18,0,2,4,6,8,10,12,14,
        16,18,20,22,24,26,28,30,32,34,0,7,1,0,9,10,1,0,11,12,1,0,15,16,1,
        0,13,14,1,0,20,23,1,0,18,19,1,0,3,4,229,0,39,1,0,0,0,2,56,1,0,0,
        0,4,58,1,0,0,0,6,81,1,0,0,0,8,101,1,0,0,0,10,112,1,0,0,0,12,121,
        1,0,0,0,14,123,1,0,0,0,16,127,1,0,0,0,18,141,1,0,0,0,20,161,1,0,
        0,0,22,163,1,0,0,0,24,173,1,0,0,0,26,179,1,0,0,0,28,181,1,0,0,0,
        30,183,1,0,0,0,32,196,1,0,0,0,34,215,1,0,0,0,36,38,3,2,1,0,37,36,
        1,0,0,0,38,41,1,0,0,0,39,37,1,0,0,0,39,40,1,0,0,0,40,42,1,0,0,0,
        41,39,1,0,0,0,42,43,5,0,0,1,43,1,1,0,0,0,44,57,3,4,2,0,45,57,3,6,
        3,0,46,47,3,16,8,0,47,48,5,30,0,0,48,57,1,0,0,0,49,50,3,20,10,0,
        50,51,5,30,0,0,51,57,1,0,0,0,52,53,3,24,12,0,53,54,5,30,0,0,54,57,
        1,0,0,0,55,57,3,14,7,0,56,44,1,0,0,0,56,45,1,0,0,0,56,46,1,0,0,0,
        56,49,1,0,0,0,56,52,1,0,0,0,56,55,1,0,0,0,57,3,1,0,0,0,58,59,5,1,
        0,0,59,60,5,24,0,0,60,61,3,32,16,0,61,62,5,25,0,0,62,66,5,26,0,0,
        63,65,3,2,1,0,64,63,1,0,0,0,65,68,1,0,0,0,66,64,1,0,0,0,66,67,1,
        0,0,0,67,69,1,0,0,0,68,66,1,0,0,0,69,79,5,27,0,0,70,71,5,2,0,0,71,
        75,5,26,0,0,72,74,3,2,1,0,73,72,1,0,0,0,74,77,1,0,0,0,75,73,1,0,
        0,0,75,76,1,0,0,0,76,78,1,0,0,0,77,75,1,0,0,0,78,80,5,27,0,0,79,
        70,1,0,0,0,79,80,1,0,0,0,80,5,1,0,0,0,81,82,5,7,0,0,82,83,5,34,0,
        0,83,84,5,24,0,0,84,85,3,10,5,0,85,86,5,25,0,0,86,87,5,29,0,0,87,
        88,3,8,4,0,88,92,5,26,0,0,89,91,3,2,1,0,90,89,1,0,0,0,91,94,1,0,
        0,0,92,90,1,0,0,0,92,93,1,0,0,0,93,95,1,0,0,0,94,92,1,0,0,0,95,96,
        5,27,0,0,96,7,1,0,0,0,97,98,3,28,14,0,98,99,3,22,11,0,99,102,1,0,
        0,0,100,102,3,30,15,0,101,97,1,0,0,0,101,100,1,0,0,0,102,9,1,0,0,
        0,103,108,3,12,6,0,104,105,5,28,0,0,105,107,3,12,6,0,106,104,1,0,
        0,0,107,110,1,0,0,0,108,106,1,0,0,0,108,109,1,0,0,0,109,113,1,0,
        0,0,110,108,1,0,0,0,111,113,1,0,0,0,112,103,1,0,0,0,112,111,1,0,
        0,0,113,11,1,0,0,0,114,115,3,28,14,0,115,116,3,22,11,0,116,117,5,
        34,0,0,117,122,1,0,0,0,118,119,3,30,15,0,119,120,5,34,0,0,120,122,
        1,0,0,0,121,114,1,0,0,0,121,118,1,0,0,0,122,13,1,0,0,0,123,124,5,
        8,0,0,124,125,3,32,16,0,125,126,5,30,0,0,126,15,1,0,0,0,127,128,
        5,34,0,0,128,129,5,24,0,0,129,130,3,18,9,0,130,131,5,25,0,0,131,
        17,1,0,0,0,132,137,3,32,16,0,133,134,5,28,0,0,134,136,3,32,16,0,
        135,133,1,0,0,0,136,139,1,0,0,0,137,135,1,0,0,0,137,138,1,0,0,0,
        138,142,1,0,0,0,139,137,1,0,0,0,140,142,1,0,0,0,141,132,1,0,0,0,
        141,140,1,0,0,0,142,19,1,0,0,0,143,144,3,28,14,0,144,145,3,22,11,
        0,145,146,5,34,0,0,146,162,1,0,0,0,147,148,3,28,14,0,148,149,3,22,
        11,0,149,150,5,34,0,0,150,151,5,17,0,0,151,152,3,32,16,0,152,162,
        1,0,0,0,153,154,3,30,15,0,154,155,5,34,0,0,155,162,1,0,0,0,156,157,
        3,30,15,0,157,158,5,34,0,0,158,159,5,17,0,0,159,160,3,32,16,0,160,
        162,1,0,0,0,161,143,1,0,0,0,161,147,1,0,0,0,161,153,1,0,0,0,161,
        156,1,0,0,0,162,21,1,0,0,0,163,164,5,26,0,0,164,165,5,5,0,0,165,
        166,5,29,0,0,166,167,3,32,16,0,167,168,5,28,0,0,168,169,5,6,0,0,
        169,170,5,29,0,0,170,171,3,32,16,0,171,172,5,27,0,0,172,23,1,0,0,
        0,173,174,5,34,0,0,174,175,5,17,0,0,175,176,3,32,16,0,176,25,1,0,
        0,0,177,180,3,28,14,0,178,180,3,30,15,0,179,177,1,0,0,0,179,178,
        1,0,0,0,180,27,1,0,0,0,181,182,7,0,0,0,182,29,1,0,0,0,183,184,7,
        1,0,0,184,31,1,0,0,0,185,186,6,16,-1,0,186,187,5,24,0,0,187,188,
        3,32,16,0,188,189,5,25,0,0,189,197,1,0,0,0,190,197,5,31,0,0,191,
        197,5,32,0,0,192,197,5,33,0,0,193,197,3,34,17,0,194,197,3,16,8,0,
        195,197,5,34,0,0,196,185,1,0,0,0,196,190,1,0,0,0,196,191,1,0,0,0,
        196,192,1,0,0,0,196,193,1,0,0,0,196,194,1,0,0,0,196,195,1,0,0,0,
        197,212,1,0,0,0,198,199,10,11,0,0,199,200,7,2,0,0,200,211,3,32,16,
        12,201,202,10,10,0,0,202,203,7,3,0,0,203,211,3,32,16,11,204,205,
        10,9,0,0,205,206,7,4,0,0,206,211,3,32,16,10,207,208,10,8,0,0,208,
        209,7,5,0,0,209,211,3,32,16,9,210,198,1,0,0,0,210,201,1,0,0,0,210,
        204,1,0,0,0,210,207,1,0,0,0,211,214,1,0,0,0,212,210,1,0,0,0,212,
        213,1,0,0,0,213,33,1,0,0,0,214,212,1,0,0,0,215,216,7,6,0,0,216,35,
        1,0,0,0,17,39,56,66,75,79,92,101,108,112,121,137,141,161,179,196,
        210,212
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
    public function(): FunctionContext | null {
        return this.getRuleContext(0, FunctionContext);
    }
    public call(): CallContext | null {
        return this.getRuleContext(0, CallContext);
    }
    public SEMI(): antlr.TerminalNode | null {
        return this.getToken(BoQQIParser.SEMI, 0);
    }
    public declare(): DeclareContext | null {
        return this.getRuleContext(0, DeclareContext);
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
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public SEMI(): antlr.TerminalNode {
        return this.getToken(BoQQIParser.SEMI, 0)!;
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


export class DeclareContext extends antlr.ParserRuleContext {
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
    public override get ruleIndex(): number {
        return BoQQIParser.RULE_declare;
    }
    public override enterRule(listener: BoQQIParserListener): void {
        if(listener.enterDeclare) {
             listener.enterDeclare(this);
        }
    }
    public override exitRule(listener: BoQQIParserListener): void {
        if(listener.exitDeclare) {
             listener.exitDeclare(this);
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
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
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
