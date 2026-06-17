
import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";


export class BoQQILexer extends antlr.Lexer {
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
    public static readonly PLUS = 14;
    public static readonly MINUS = 15;
    public static readonly MUL = 16;
    public static readonly DIV = 17;
    public static readonly EQUAL = 18;
    public static readonly EQ = 19;
    public static readonly NE = 20;
    public static readonly GE = 21;
    public static readonly LE = 22;
    public static readonly GT = 23;
    public static readonly LT = 24;
    public static readonly LPAREN = 25;
    public static readonly RPAREN = 26;
    public static readonly LBRACE = 27;
    public static readonly RBRACE = 28;
    public static readonly COMMA = 29;
    public static readonly COLON = 30;
    public static readonly SEMI = 31;
    public static readonly FLOAT = 32;
    public static readonly INT = 33;
    public static readonly STRING = 34;
    public static readonly IDENT = 35;
    public static readonly WS = 36;

    public static readonly channelNames = [
        "DEFAULT_TOKEN_CHANNEL", "HIDDEN"
    ];

    public static readonly literalNames = [
        null, "'if'", "'else'", "'while'", "'true'", "'false'", "'max'", 
        "'min'", "'function'", "'return'", "'int'", "'float'", "'string'", 
        "'bool'", "'+'", "'-'", "'*'", "'/'", "'='", "'=='", "'!='", "'>='", 
        "'<='", "'>'", "'<'", "'('", "')'", "'{'", "'}'", "','", "':'", 
        "';'"
    ];

    public static readonly symbolicNames = [
        null, "IF", "ELSE", "WHILE", "TRUE", "FALSE", "MAX", "MIN", "FUNC", 
        "RETURN", "TYPE_INT", "TYPE_FLOAT", "TYPE_STRING", "TYPE_BOOL", 
        "PLUS", "MINUS", "MUL", "DIV", "EQUAL", "EQ", "NE", "GE", "LE", 
        "GT", "LT", "LPAREN", "RPAREN", "LBRACE", "RBRACE", "COMMA", "COLON", 
        "SEMI", "FLOAT", "INT", "STRING", "IDENT", "WS"
    ];

    public static readonly modeNames = [
        "DEFAULT_MODE",
    ];

    public static readonly ruleNames = [
        "IF", "ELSE", "WHILE", "TRUE", "FALSE", "MAX", "MIN", "FUNC", "RETURN", 
        "TYPE_INT", "TYPE_FLOAT", "TYPE_STRING", "TYPE_BOOL", "PLUS", "MINUS", 
        "MUL", "DIV", "EQUAL", "EQ", "NE", "GE", "LE", "GT", "LT", "LPAREN", 
        "RPAREN", "LBRACE", "RBRACE", "COMMA", "COLON", "SEMI", "FLOAT", 
        "INT", "STRING", "IDENT", "WS",
    ];


    public constructor(input: antlr.CharStream) {
        super(input);
        this.interpreter = new antlr.LexerATNSimulator(this, BoQQILexer._ATN, BoQQILexer.decisionsToDFA, new antlr.PredictionContextCache());
    }

    public get grammarFileName(): string { return "BoQQILexer.g4"; }

    public get literalNames(): (string | null)[] { return BoQQILexer.literalNames; }
    public get symbolicNames(): (string | null)[] { return BoQQILexer.symbolicNames; }
    public get ruleNames(): string[] { return BoQQILexer.ruleNames; }

    public get serializedATN(): number[] { return BoQQILexer._serializedATN; }

    public get channelNames(): string[] { return BoQQILexer.channelNames; }

    public get modeNames(): string[] { return BoQQILexer.modeNames; }

    public static readonly _serializedATN: number[] = [
        4,0,36,225,6,-1,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,
        2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,
        13,7,13,2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,
        19,2,20,7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,24,2,25,7,25,2,
        26,7,26,2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,2,31,7,31,2,32,7,
        32,2,33,7,33,2,34,7,34,2,35,7,35,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,
        1,2,1,2,1,2,1,2,1,2,1,2,1,3,1,3,1,3,1,3,1,3,1,4,1,4,1,4,1,4,1,4,
        1,4,1,5,1,5,1,5,1,5,1,6,1,6,1,6,1,6,1,7,1,7,1,7,1,7,1,7,1,7,1,7,
        1,7,1,7,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,9,1,9,1,9,1,9,1,10,1,10,1,
        10,1,10,1,10,1,10,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,12,1,12,1,
        12,1,12,1,12,1,13,1,13,1,14,1,14,1,15,1,15,1,16,1,16,1,17,1,17,1,
        18,1,18,1,18,1,19,1,19,1,19,1,20,1,20,1,20,1,21,1,21,1,21,1,22,1,
        22,1,23,1,23,1,24,1,24,1,25,1,25,1,26,1,26,1,27,1,27,1,28,1,28,1,
        29,1,29,1,30,1,30,1,31,4,31,186,8,31,11,31,12,31,187,1,31,1,31,4,
        31,192,8,31,11,31,12,31,193,1,32,4,32,197,8,32,11,32,12,32,198,1,
        33,1,33,1,33,1,33,5,33,205,8,33,10,33,12,33,208,9,33,1,33,1,33,1,
        34,1,34,5,34,214,8,34,10,34,12,34,217,9,34,1,35,4,35,220,8,35,11,
        35,12,35,221,1,35,1,35,0,0,36,1,1,3,2,5,3,7,4,9,5,11,6,13,7,15,8,
        17,9,19,10,21,11,23,12,25,13,27,14,29,15,31,16,33,17,35,18,37,19,
        39,20,41,21,43,22,45,23,47,24,49,25,51,26,53,27,55,28,57,29,59,30,
        61,31,63,32,65,33,67,34,69,35,71,36,1,0,6,1,0,48,57,6,0,34,34,92,
        92,98,98,110,110,114,114,116,116,4,0,10,10,13,13,34,34,92,92,3,0,
        65,90,95,95,97,122,4,0,48,57,65,90,95,95,97,122,3,0,9,10,13,13,32,
        32,231,0,1,1,0,0,0,0,3,1,0,0,0,0,5,1,0,0,0,0,7,1,0,0,0,0,9,1,0,0,
        0,0,11,1,0,0,0,0,13,1,0,0,0,0,15,1,0,0,0,0,17,1,0,0,0,0,19,1,0,0,
        0,0,21,1,0,0,0,0,23,1,0,0,0,0,25,1,0,0,0,0,27,1,0,0,0,0,29,1,0,0,
        0,0,31,1,0,0,0,0,33,1,0,0,0,0,35,1,0,0,0,0,37,1,0,0,0,0,39,1,0,0,
        0,0,41,1,0,0,0,0,43,1,0,0,0,0,45,1,0,0,0,0,47,1,0,0,0,0,49,1,0,0,
        0,0,51,1,0,0,0,0,53,1,0,0,0,0,55,1,0,0,0,0,57,1,0,0,0,0,59,1,0,0,
        0,0,61,1,0,0,0,0,63,1,0,0,0,0,65,1,0,0,0,0,67,1,0,0,0,0,69,1,0,0,
        0,0,71,1,0,0,0,1,73,1,0,0,0,3,76,1,0,0,0,5,81,1,0,0,0,7,87,1,0,0,
        0,9,92,1,0,0,0,11,98,1,0,0,0,13,102,1,0,0,0,15,106,1,0,0,0,17,115,
        1,0,0,0,19,122,1,0,0,0,21,126,1,0,0,0,23,132,1,0,0,0,25,139,1,0,
        0,0,27,144,1,0,0,0,29,146,1,0,0,0,31,148,1,0,0,0,33,150,1,0,0,0,
        35,152,1,0,0,0,37,154,1,0,0,0,39,157,1,0,0,0,41,160,1,0,0,0,43,163,
        1,0,0,0,45,166,1,0,0,0,47,168,1,0,0,0,49,170,1,0,0,0,51,172,1,0,
        0,0,53,174,1,0,0,0,55,176,1,0,0,0,57,178,1,0,0,0,59,180,1,0,0,0,
        61,182,1,0,0,0,63,185,1,0,0,0,65,196,1,0,0,0,67,200,1,0,0,0,69,211,
        1,0,0,0,71,219,1,0,0,0,73,74,5,105,0,0,74,75,5,102,0,0,75,2,1,0,
        0,0,76,77,5,101,0,0,77,78,5,108,0,0,78,79,5,115,0,0,79,80,5,101,
        0,0,80,4,1,0,0,0,81,82,5,119,0,0,82,83,5,104,0,0,83,84,5,105,0,0,
        84,85,5,108,0,0,85,86,5,101,0,0,86,6,1,0,0,0,87,88,5,116,0,0,88,
        89,5,114,0,0,89,90,5,117,0,0,90,91,5,101,0,0,91,8,1,0,0,0,92,93,
        5,102,0,0,93,94,5,97,0,0,94,95,5,108,0,0,95,96,5,115,0,0,96,97,5,
        101,0,0,97,10,1,0,0,0,98,99,5,109,0,0,99,100,5,97,0,0,100,101,5,
        120,0,0,101,12,1,0,0,0,102,103,5,109,0,0,103,104,5,105,0,0,104,105,
        5,110,0,0,105,14,1,0,0,0,106,107,5,102,0,0,107,108,5,117,0,0,108,
        109,5,110,0,0,109,110,5,99,0,0,110,111,5,116,0,0,111,112,5,105,0,
        0,112,113,5,111,0,0,113,114,5,110,0,0,114,16,1,0,0,0,115,116,5,114,
        0,0,116,117,5,101,0,0,117,118,5,116,0,0,118,119,5,117,0,0,119,120,
        5,114,0,0,120,121,5,110,0,0,121,18,1,0,0,0,122,123,5,105,0,0,123,
        124,5,110,0,0,124,125,5,116,0,0,125,20,1,0,0,0,126,127,5,102,0,0,
        127,128,5,108,0,0,128,129,5,111,0,0,129,130,5,97,0,0,130,131,5,116,
        0,0,131,22,1,0,0,0,132,133,5,115,0,0,133,134,5,116,0,0,134,135,5,
        114,0,0,135,136,5,105,0,0,136,137,5,110,0,0,137,138,5,103,0,0,138,
        24,1,0,0,0,139,140,5,98,0,0,140,141,5,111,0,0,141,142,5,111,0,0,
        142,143,5,108,0,0,143,26,1,0,0,0,144,145,5,43,0,0,145,28,1,0,0,0,
        146,147,5,45,0,0,147,30,1,0,0,0,148,149,5,42,0,0,149,32,1,0,0,0,
        150,151,5,47,0,0,151,34,1,0,0,0,152,153,5,61,0,0,153,36,1,0,0,0,
        154,155,5,61,0,0,155,156,5,61,0,0,156,38,1,0,0,0,157,158,5,33,0,
        0,158,159,5,61,0,0,159,40,1,0,0,0,160,161,5,62,0,0,161,162,5,61,
        0,0,162,42,1,0,0,0,163,164,5,60,0,0,164,165,5,61,0,0,165,44,1,0,
        0,0,166,167,5,62,0,0,167,46,1,0,0,0,168,169,5,60,0,0,169,48,1,0,
        0,0,170,171,5,40,0,0,171,50,1,0,0,0,172,173,5,41,0,0,173,52,1,0,
        0,0,174,175,5,123,0,0,175,54,1,0,0,0,176,177,5,125,0,0,177,56,1,
        0,0,0,178,179,5,44,0,0,179,58,1,0,0,0,180,181,5,58,0,0,181,60,1,
        0,0,0,182,183,5,59,0,0,183,62,1,0,0,0,184,186,7,0,0,0,185,184,1,
        0,0,0,186,187,1,0,0,0,187,185,1,0,0,0,187,188,1,0,0,0,188,189,1,
        0,0,0,189,191,5,46,0,0,190,192,7,0,0,0,191,190,1,0,0,0,192,193,1,
        0,0,0,193,191,1,0,0,0,193,194,1,0,0,0,194,64,1,0,0,0,195,197,7,0,
        0,0,196,195,1,0,0,0,197,198,1,0,0,0,198,196,1,0,0,0,198,199,1,0,
        0,0,199,66,1,0,0,0,200,206,5,34,0,0,201,202,5,92,0,0,202,205,7,1,
        0,0,203,205,8,2,0,0,204,201,1,0,0,0,204,203,1,0,0,0,205,208,1,0,
        0,0,206,204,1,0,0,0,206,207,1,0,0,0,207,209,1,0,0,0,208,206,1,0,
        0,0,209,210,5,34,0,0,210,68,1,0,0,0,211,215,7,3,0,0,212,214,7,4,
        0,0,213,212,1,0,0,0,214,217,1,0,0,0,215,213,1,0,0,0,215,216,1,0,
        0,0,216,70,1,0,0,0,217,215,1,0,0,0,218,220,7,5,0,0,219,218,1,0,0,
        0,220,221,1,0,0,0,221,219,1,0,0,0,221,222,1,0,0,0,222,223,1,0,0,
        0,223,224,6,35,0,0,224,72,1,0,0,0,8,0,187,193,198,204,206,215,221,
        1,6,0,0
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!BoQQILexer.__ATN) {
            BoQQILexer.__ATN = new antlr.ATNDeserializer().deserialize(BoQQILexer._serializedATN);
        }

        return BoQQILexer.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(BoQQILexer.literalNames, BoQQILexer.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return BoQQILexer.vocabulary;
    }

    private static readonly decisionsToDFA = BoQQILexer._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}