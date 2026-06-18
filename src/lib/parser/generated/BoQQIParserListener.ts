
import { ErrorNode, ParseTreeListener, ParserRuleContext, TerminalNode } from "antlr4ng";


import { ProgramContext } from "./BoQQIParser.js";
import { StatementContext } from "./BoQQIParser.js";
import { IfContext } from "./BoQQIParser.js";
import { WhileContext } from "./BoQQIParser.js";
import { FunctionContext } from "./BoQQIParser.js";
import { ReturnTypeContext } from "./BoQQIParser.js";
import { ParamsContext } from "./BoQQIParser.js";
import { ParamContext } from "./BoQQIParser.js";
import { ReturnContext } from "./BoQQIParser.js";
import { CallContext } from "./BoQQIParser.js";
import { ArgsContext } from "./BoQQIParser.js";
import { DeclarationContext } from "./BoQQIParser.js";
import { DomainContext } from "./BoQQIParser.js";
import { AssignContext } from "./BoQQIParser.js";
import { TypeContext } from "./BoQQIParser.js";
import { NumericTypeContext } from "./BoQQIParser.js";
import { NonNumericTypeContext } from "./BoQQIParser.js";
import { ParensContext } from "./BoQQIParser.js";
import { FloatContext } from "./BoQQIParser.js";
import { IntContext } from "./BoQQIParser.js";
import { StringContext } from "./BoQQIParser.js";
import { BoolContext } from "./BoQQIParser.js";
import { CallExprContext } from "./BoQQIParser.js";
import { VarContext } from "./BoQQIParser.js";
import { MulDivContext } from "./BoQQIParser.js";
import { AddSubContext } from "./BoQQIParser.js";
import { CompContext } from "./BoQQIParser.js";
import { EqContext } from "./BoQQIParser.js";
import { BooleanContext } from "./BoQQIParser.js";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `BoQQIParser`.
 */
export class BoQQIParserListener implements ParseTreeListener {
    /**
     * Enter a parse tree produced by `BoQQIParser.program`.
     * @param ctx the parse tree
     */
    enterProgram?: (ctx: ProgramContext) => void;
    /**
     * Exit a parse tree produced by `BoQQIParser.program`.
     * @param ctx the parse tree
     */
    exitProgram?: (ctx: ProgramContext) => void;
    /**
     * Enter a parse tree produced by `BoQQIParser.statement`.
     * @param ctx the parse tree
     */
    enterStatement?: (ctx: StatementContext) => void;
    /**
     * Exit a parse tree produced by `BoQQIParser.statement`.
     * @param ctx the parse tree
     */
    exitStatement?: (ctx: StatementContext) => void;
    /**
     * Enter a parse tree produced by `BoQQIParser.if`.
     * @param ctx the parse tree
     */
    enterIf?: (ctx: IfContext) => void;
    /**
     * Exit a parse tree produced by `BoQQIParser.if`.
     * @param ctx the parse tree
     */
    exitIf?: (ctx: IfContext) => void;
    /**
     * Enter a parse tree produced by `BoQQIParser.while`.
     * @param ctx the parse tree
     */
    enterWhile?: (ctx: WhileContext) => void;
    /**
     * Exit a parse tree produced by `BoQQIParser.while`.
     * @param ctx the parse tree
     */
    exitWhile?: (ctx: WhileContext) => void;
    /**
     * Enter a parse tree produced by `BoQQIParser.function`.
     * @param ctx the parse tree
     */
    enterFunction?: (ctx: FunctionContext) => void;
    /**
     * Exit a parse tree produced by `BoQQIParser.function`.
     * @param ctx the parse tree
     */
    exitFunction?: (ctx: FunctionContext) => void;
    /**
     * Enter a parse tree produced by `BoQQIParser.returnType`.
     * @param ctx the parse tree
     */
    enterReturnType?: (ctx: ReturnTypeContext) => void;
    /**
     * Exit a parse tree produced by `BoQQIParser.returnType`.
     * @param ctx the parse tree
     */
    exitReturnType?: (ctx: ReturnTypeContext) => void;
    /**
     * Enter a parse tree produced by `BoQQIParser.params`.
     * @param ctx the parse tree
     */
    enterParams?: (ctx: ParamsContext) => void;
    /**
     * Exit a parse tree produced by `BoQQIParser.params`.
     * @param ctx the parse tree
     */
    exitParams?: (ctx: ParamsContext) => void;
    /**
     * Enter a parse tree produced by `BoQQIParser.param`.
     * @param ctx the parse tree
     */
    enterParam?: (ctx: ParamContext) => void;
    /**
     * Exit a parse tree produced by `BoQQIParser.param`.
     * @param ctx the parse tree
     */
    exitParam?: (ctx: ParamContext) => void;
    /**
     * Enter a parse tree produced by `BoQQIParser.return`.
     * @param ctx the parse tree
     */
    enterReturn?: (ctx: ReturnContext) => void;
    /**
     * Exit a parse tree produced by `BoQQIParser.return`.
     * @param ctx the parse tree
     */
    exitReturn?: (ctx: ReturnContext) => void;
    /**
     * Enter a parse tree produced by `BoQQIParser.call`.
     * @param ctx the parse tree
     */
    enterCall?: (ctx: CallContext) => void;
    /**
     * Exit a parse tree produced by `BoQQIParser.call`.
     * @param ctx the parse tree
     */
    exitCall?: (ctx: CallContext) => void;
    /**
     * Enter a parse tree produced by `BoQQIParser.args`.
     * @param ctx the parse tree
     */
    enterArgs?: (ctx: ArgsContext) => void;
    /**
     * Exit a parse tree produced by `BoQQIParser.args`.
     * @param ctx the parse tree
     */
    exitArgs?: (ctx: ArgsContext) => void;
    /**
     * Enter a parse tree produced by `BoQQIParser.declaration`.
     * @param ctx the parse tree
     */
    enterDeclaration?: (ctx: DeclarationContext) => void;
    /**
     * Exit a parse tree produced by `BoQQIParser.declaration`.
     * @param ctx the parse tree
     */
    exitDeclaration?: (ctx: DeclarationContext) => void;
    /**
     * Enter a parse tree produced by `BoQQIParser.domain`.
     * @param ctx the parse tree
     */
    enterDomain?: (ctx: DomainContext) => void;
    /**
     * Exit a parse tree produced by `BoQQIParser.domain`.
     * @param ctx the parse tree
     */
    exitDomain?: (ctx: DomainContext) => void;
    /**
     * Enter a parse tree produced by `BoQQIParser.assign`.
     * @param ctx the parse tree
     */
    enterAssign?: (ctx: AssignContext) => void;
    /**
     * Exit a parse tree produced by `BoQQIParser.assign`.
     * @param ctx the parse tree
     */
    exitAssign?: (ctx: AssignContext) => void;
    /**
     * Enter a parse tree produced by `BoQQIParser.type`.
     * @param ctx the parse tree
     */
    enterType?: (ctx: TypeContext) => void;
    /**
     * Exit a parse tree produced by `BoQQIParser.type`.
     * @param ctx the parse tree
     */
    exitType?: (ctx: TypeContext) => void;
    /**
     * Enter a parse tree produced by `BoQQIParser.numericType`.
     * @param ctx the parse tree
     */
    enterNumericType?: (ctx: NumericTypeContext) => void;
    /**
     * Exit a parse tree produced by `BoQQIParser.numericType`.
     * @param ctx the parse tree
     */
    exitNumericType?: (ctx: NumericTypeContext) => void;
    /**
     * Enter a parse tree produced by `BoQQIParser.nonNumericType`.
     * @param ctx the parse tree
     */
    enterNonNumericType?: (ctx: NonNumericTypeContext) => void;
    /**
     * Exit a parse tree produced by `BoQQIParser.nonNumericType`.
     * @param ctx the parse tree
     */
    exitNonNumericType?: (ctx: NonNumericTypeContext) => void;
    /**
     * Enter a parse tree produced by the `Parens`
     * labeled alternative in `BoQQIParser.expr`.
     * @param ctx the parse tree
     */
    enterParens?: (ctx: ParensContext) => void;
    /**
     * Exit a parse tree produced by the `Parens`
     * labeled alternative in `BoQQIParser.expr`.
     * @param ctx the parse tree
     */
    exitParens?: (ctx: ParensContext) => void;
    /**
     * Enter a parse tree produced by the `Float`
     * labeled alternative in `BoQQIParser.expr`.
     * @param ctx the parse tree
     */
    enterFloat?: (ctx: FloatContext) => void;
    /**
     * Exit a parse tree produced by the `Float`
     * labeled alternative in `BoQQIParser.expr`.
     * @param ctx the parse tree
     */
    exitFloat?: (ctx: FloatContext) => void;
    /**
     * Enter a parse tree produced by the `Int`
     * labeled alternative in `BoQQIParser.expr`.
     * @param ctx the parse tree
     */
    enterInt?: (ctx: IntContext) => void;
    /**
     * Exit a parse tree produced by the `Int`
     * labeled alternative in `BoQQIParser.expr`.
     * @param ctx the parse tree
     */
    exitInt?: (ctx: IntContext) => void;
    /**
     * Enter a parse tree produced by the `String`
     * labeled alternative in `BoQQIParser.expr`.
     * @param ctx the parse tree
     */
    enterString?: (ctx: StringContext) => void;
    /**
     * Exit a parse tree produced by the `String`
     * labeled alternative in `BoQQIParser.expr`.
     * @param ctx the parse tree
     */
    exitString?: (ctx: StringContext) => void;
    /**
     * Enter a parse tree produced by the `bool`
     * labeled alternative in `BoQQIParser.expr`.
     * @param ctx the parse tree
     */
    enterBool?: (ctx: BoolContext) => void;
    /**
     * Exit a parse tree produced by the `bool`
     * labeled alternative in `BoQQIParser.expr`.
     * @param ctx the parse tree
     */
    exitBool?: (ctx: BoolContext) => void;
    /**
     * Enter a parse tree produced by the `CallExpr`
     * labeled alternative in `BoQQIParser.expr`.
     * @param ctx the parse tree
     */
    enterCallExpr?: (ctx: CallExprContext) => void;
    /**
     * Exit a parse tree produced by the `CallExpr`
     * labeled alternative in `BoQQIParser.expr`.
     * @param ctx the parse tree
     */
    exitCallExpr?: (ctx: CallExprContext) => void;
    /**
     * Enter a parse tree produced by the `Var`
     * labeled alternative in `BoQQIParser.expr`.
     * @param ctx the parse tree
     */
    enterVar?: (ctx: VarContext) => void;
    /**
     * Exit a parse tree produced by the `Var`
     * labeled alternative in `BoQQIParser.expr`.
     * @param ctx the parse tree
     */
    exitVar?: (ctx: VarContext) => void;
    /**
     * Enter a parse tree produced by the `MulDiv`
     * labeled alternative in `BoQQIParser.expr`.
     * @param ctx the parse tree
     */
    enterMulDiv?: (ctx: MulDivContext) => void;
    /**
     * Exit a parse tree produced by the `MulDiv`
     * labeled alternative in `BoQQIParser.expr`.
     * @param ctx the parse tree
     */
    exitMulDiv?: (ctx: MulDivContext) => void;
    /**
     * Enter a parse tree produced by the `AddSub`
     * labeled alternative in `BoQQIParser.expr`.
     * @param ctx the parse tree
     */
    enterAddSub?: (ctx: AddSubContext) => void;
    /**
     * Exit a parse tree produced by the `AddSub`
     * labeled alternative in `BoQQIParser.expr`.
     * @param ctx the parse tree
     */
    exitAddSub?: (ctx: AddSubContext) => void;
    /**
     * Enter a parse tree produced by the `comp`
     * labeled alternative in `BoQQIParser.expr`.
     * @param ctx the parse tree
     */
    enterComp?: (ctx: CompContext) => void;
    /**
     * Exit a parse tree produced by the `comp`
     * labeled alternative in `BoQQIParser.expr`.
     * @param ctx the parse tree
     */
    exitComp?: (ctx: CompContext) => void;
    /**
     * Enter a parse tree produced by the `eq`
     * labeled alternative in `BoQQIParser.expr`.
     * @param ctx the parse tree
     */
    enterEq?: (ctx: EqContext) => void;
    /**
     * Exit a parse tree produced by the `eq`
     * labeled alternative in `BoQQIParser.expr`.
     * @param ctx the parse tree
     */
    exitEq?: (ctx: EqContext) => void;
    /**
     * Enter a parse tree produced by `BoQQIParser.boolean`.
     * @param ctx the parse tree
     */
    enterBoolean?: (ctx: BooleanContext) => void;
    /**
     * Exit a parse tree produced by `BoQQIParser.boolean`.
     * @param ctx the parse tree
     */
    exitBoolean?: (ctx: BooleanContext) => void;

    visitTerminal(node: TerminalNode): void {}
    visitErrorNode(node: ErrorNode): void {}
    enterEveryRule(node: ParserRuleContext): void {}
    exitEveryRule(node: ParserRuleContext): void {}
}

