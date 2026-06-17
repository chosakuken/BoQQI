
import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";


export class BoQQILexer extends antlr.Lexer {
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

    public static readonly channelNames = [
        "DEFAULT_TOKEN_CHANNEL", "HIDDEN"
    ];

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

    public static readonly modeNames = [
        "DEFAULT_MODE",
    ];

    public static readonly ruleNames = [
        "IF", "ELSE", "TRUE", "FALSE", "MAX", "MIN", "FUNC", "RETURN", "TYPE_INT", 
        "TYPE_FLOAT", "TYPE_STRING", "TYPE_BOOL", "PLUS", "MINUS", "MUL", 
        "DIV", "EQUAL", "EQ", "NE", "GE", "LE", "GT", "LT", "LPAREN", "RPAREN", 
        "LBRACE", "RBRACE", "COMMA", "COLON", "SEMI", "FLOAT", "INT", "STRING", 
        "IDENT", "WS",
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
        4,0,35,217,6,-1,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,
        2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,
        13,7,13,2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,
        19,2,20,7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,24,2,25,7,25,2,
        26,7,26,2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,2,31,7,31,2,32,7,
        32,2,33,7,33,2,34,7,34,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,
        2,1,2,1,2,1,3,1,3,1,3,1,3,1,3,1,3,1,4,1,4,1,4,1,4,1,5,1,5,1,5,1,
        5,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,7,1,7,1,7,1,7,1,7,1,7,1,
        7,1,8,1,8,1,8,1,8,1,9,1,9,1,9,1,9,1,9,1,9,1,10,1,10,1,10,1,10,1,
        10,1,10,1,10,1,11,1,11,1,11,1,11,1,11,1,12,1,12,1,13,1,13,1,14,1,
        14,1,15,1,15,1,16,1,16,1,17,1,17,1,17,1,18,1,18,1,18,1,19,1,19,1,
        19,1,20,1,20,1,20,1,21,1,21,1,22,1,22,1,23,1,23,1,24,1,24,1,25,1,
        25,1,26,1,26,1,27,1,27,1,28,1,28,1,29,1,29,1,30,4,30,178,8,30,11,
        30,12,30,179,1,30,1,30,4,30,184,8,30,11,30,12,30,185,1,31,4,31,189,
        8,31,11,31,12,31,190,1,32,1,32,1,32,1,32,5,32,197,8,32,10,32,12,
        32,200,9,32,1,32,1,32,1,33,1,33,5,33,206,8,33,10,33,12,33,209,9,
        33,1,34,4,34,212,8,34,11,34,12,34,213,1,34,1,34,0,0,35,1,1,3,2,5,
        3,7,4,9,5,11,6,13,7,15,8,17,9,19,10,21,11,23,12,25,13,27,14,29,15,
        31,16,33,17,35,18,37,19,39,20,41,21,43,22,45,23,47,24,49,25,51,26,
        53,27,55,28,57,29,59,30,61,31,63,32,65,33,67,34,69,35,1,0,6,1,0,
        48,57,6,0,34,34,92,92,98,98,110,110,114,114,116,116,4,0,10,10,13,
        13,34,34,92,92,3,0,65,90,95,95,97,122,4,0,48,57,65,90,95,95,97,122,
        3,0,9,10,13,13,32,32,223,0,1,1,0,0,0,0,3,1,0,0,0,0,5,1,0,0,0,0,7,
        1,0,0,0,0,9,1,0,0,0,0,11,1,0,0,0,0,13,1,0,0,0,0,15,1,0,0,0,0,17,
        1,0,0,0,0,19,1,0,0,0,0,21,1,0,0,0,0,23,1,0,0,0,0,25,1,0,0,0,0,27,
        1,0,0,0,0,29,1,0,0,0,0,31,1,0,0,0,0,33,1,0,0,0,0,35,1,0,0,0,0,37,
        1,0,0,0,0,39,1,0,0,0,0,41,1,0,0,0,0,43,1,0,0,0,0,45,1,0,0,0,0,47,
        1,0,0,0,0,49,1,0,0,0,0,51,1,0,0,0,0,53,1,0,0,0,0,55,1,0,0,0,0,57,
        1,0,0,0,0,59,1,0,0,0,0,61,1,0,0,0,0,63,1,0,0,0,0,65,1,0,0,0,0,67,
        1,0,0,0,0,69,1,0,0,0,1,71,1,0,0,0,3,74,1,0,0,0,5,79,1,0,0,0,7,84,
        1,0,0,0,9,90,1,0,0,0,11,94,1,0,0,0,13,98,1,0,0,0,15,107,1,0,0,0,
        17,114,1,0,0,0,19,118,1,0,0,0,21,124,1,0,0,0,23,131,1,0,0,0,25,136,
        1,0,0,0,27,138,1,0,0,0,29,140,1,0,0,0,31,142,1,0,0,0,33,144,1,0,
        0,0,35,146,1,0,0,0,37,149,1,0,0,0,39,152,1,0,0,0,41,155,1,0,0,0,
        43,158,1,0,0,0,45,160,1,0,0,0,47,162,1,0,0,0,49,164,1,0,0,0,51,166,
        1,0,0,0,53,168,1,0,0,0,55,170,1,0,0,0,57,172,1,0,0,0,59,174,1,0,
        0,0,61,177,1,0,0,0,63,188,1,0,0,0,65,192,1,0,0,0,67,203,1,0,0,0,
        69,211,1,0,0,0,71,72,5,105,0,0,72,73,5,102,0,0,73,2,1,0,0,0,74,75,
        5,101,0,0,75,76,5,108,0,0,76,77,5,115,0,0,77,78,5,101,0,0,78,4,1,
        0,0,0,79,80,5,116,0,0,80,81,5,114,0,0,81,82,5,117,0,0,82,83,5,101,
        0,0,83,6,1,0,0,0,84,85,5,102,0,0,85,86,5,97,0,0,86,87,5,108,0,0,
        87,88,5,115,0,0,88,89,5,101,0,0,89,8,1,0,0,0,90,91,5,109,0,0,91,
        92,5,97,0,0,92,93,5,120,0,0,93,10,1,0,0,0,94,95,5,109,0,0,95,96,
        5,105,0,0,96,97,5,110,0,0,97,12,1,0,0,0,98,99,5,102,0,0,99,100,5,
        117,0,0,100,101,5,110,0,0,101,102,5,99,0,0,102,103,5,116,0,0,103,
        104,5,105,0,0,104,105,5,111,0,0,105,106,5,110,0,0,106,14,1,0,0,0,
        107,108,5,114,0,0,108,109,5,101,0,0,109,110,5,116,0,0,110,111,5,
        117,0,0,111,112,5,114,0,0,112,113,5,110,0,0,113,16,1,0,0,0,114,115,
        5,105,0,0,115,116,5,110,0,0,116,117,5,116,0,0,117,18,1,0,0,0,118,
        119,5,102,0,0,119,120,5,108,0,0,120,121,5,111,0,0,121,122,5,97,0,
        0,122,123,5,116,0,0,123,20,1,0,0,0,124,125,5,115,0,0,125,126,5,116,
        0,0,126,127,5,114,0,0,127,128,5,105,0,0,128,129,5,110,0,0,129,130,
        5,103,0,0,130,22,1,0,0,0,131,132,5,98,0,0,132,133,5,111,0,0,133,
        134,5,111,0,0,134,135,5,108,0,0,135,24,1,0,0,0,136,137,5,43,0,0,
        137,26,1,0,0,0,138,139,5,45,0,0,139,28,1,0,0,0,140,141,5,42,0,0,
        141,30,1,0,0,0,142,143,5,47,0,0,143,32,1,0,0,0,144,145,5,61,0,0,
        145,34,1,0,0,0,146,147,5,61,0,0,147,148,5,61,0,0,148,36,1,0,0,0,
        149,150,5,33,0,0,150,151,5,61,0,0,151,38,1,0,0,0,152,153,5,62,0,
        0,153,154,5,61,0,0,154,40,1,0,0,0,155,156,5,60,0,0,156,157,5,61,
        0,0,157,42,1,0,0,0,158,159,5,62,0,0,159,44,1,0,0,0,160,161,5,60,
        0,0,161,46,1,0,0,0,162,163,5,40,0,0,163,48,1,0,0,0,164,165,5,41,
        0,0,165,50,1,0,0,0,166,167,5,123,0,0,167,52,1,0,0,0,168,169,5,125,
        0,0,169,54,1,0,0,0,170,171,5,44,0,0,171,56,1,0,0,0,172,173,5,58,
        0,0,173,58,1,0,0,0,174,175,5,59,0,0,175,60,1,0,0,0,176,178,7,0,0,
        0,177,176,1,0,0,0,178,179,1,0,0,0,179,177,1,0,0,0,179,180,1,0,0,
        0,180,181,1,0,0,0,181,183,5,46,0,0,182,184,7,0,0,0,183,182,1,0,0,
        0,184,185,1,0,0,0,185,183,1,0,0,0,185,186,1,0,0,0,186,62,1,0,0,0,
        187,189,7,0,0,0,188,187,1,0,0,0,189,190,1,0,0,0,190,188,1,0,0,0,
        190,191,1,0,0,0,191,64,1,0,0,0,192,198,5,34,0,0,193,194,5,92,0,0,
        194,197,7,1,0,0,195,197,8,2,0,0,196,193,1,0,0,0,196,195,1,0,0,0,
        197,200,1,0,0,0,198,196,1,0,0,0,198,199,1,0,0,0,199,201,1,0,0,0,
        200,198,1,0,0,0,201,202,5,34,0,0,202,66,1,0,0,0,203,207,7,3,0,0,
        204,206,7,4,0,0,205,204,1,0,0,0,206,209,1,0,0,0,207,205,1,0,0,0,
        207,208,1,0,0,0,208,68,1,0,0,0,209,207,1,0,0,0,210,212,7,5,0,0,211,
        210,1,0,0,0,212,213,1,0,0,0,213,211,1,0,0,0,213,214,1,0,0,0,214,
        215,1,0,0,0,215,216,6,34,0,0,216,70,1,0,0,0,8,0,179,185,190,196,
        198,207,213,1,6,0,0
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