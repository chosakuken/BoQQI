import {
  AddSubContext,
  AssignContext,
  BoolContext,
  CallExprContext,
  CallContext,
  CompContext,
  DeclarationContext,
  DomainContext,
  EqContext,
  ExprContext,
  FloatContext,
  FunctionContext,
  IfContext,
  IntContext,
  MulDivContext,
  ParamContext,
  ParensContext,
  ProgramContext,
  ReturnContext,
  ReturnTypeContext,
  StatementContext,
  StringContext,
  VarContext,
  WhileContext,
} from "../parser/generated/BoQQIParser.js";
import { SourceLocation } from "../diagnostics/sourceLocation.js";
import { AssignNode } from "./nodes/assign.js";
import { BinaryNode, type BinaryOperator } from "./nodes/binary.js";
import { BoolNode } from "./nodes/bool.js";
import { CallNode } from "./nodes/call.js";
import { CompareNode, type CompareOperator } from "./nodes/compare.js";
import { DeclareNode, type DomainNode } from "./nodes/declare.js";
import type { ExprNode } from "./nodes/expr.js";
import { FloatNode } from "./nodes/float.js";
import {
  FunctionNode,
  type ParamNode,
  type ReturnTypeNode,
} from "./nodes/function.js";
import { IfNode } from "./nodes/if.js";
import { IntNode } from "./nodes/int.js";
import { ProgramNode } from "./nodes/program.js";
import { ReturnNode } from "./nodes/return.js";
import type { StatementNode } from "./nodes/statement.js";
import { StringNode } from "./nodes/string.js";
import { VarNode } from "./nodes/var.js";
import { WhileNode } from "./nodes/while.js";

export function buildProgramAst(ctx: ProgramContext): ProgramNode {
  return new ProgramNode(
    orderContexts([
      ...ctx.statement(),
      ...ctx.function_(),
      ...ctx.declaration(),
    ]).map(buildProgramItemAst),
    location(ctx),
  );
}

function buildProgramItemAst(
  ctx: StatementContext | FunctionContext | DeclarationContext,
): StatementNode {
  if (ctx instanceof StatementContext) {
    return buildStatementAst(ctx);
  }

  if (ctx instanceof FunctionContext) {
    return buildFunctionAst(ctx);
  }

  return buildDeclareAst(ctx);
}

export function buildStatementAst(ctx: StatementContext): StatementNode {
  const if_ = ctx.if();
  if (if_ !== null) {
    return buildIfAst(if_);
  }

  const while_ = ctx.while();
  if (while_ !== null) {
    return buildWhileAst(while_);
  }

  const call = ctx.call();
  if (call !== null) {
    return buildCallAst(call);
  }

  const assign = ctx.assign();
  if (assign !== null) {
    return buildAssignAst(assign);
  }

  const return_ = ctx.return();
  if (return_ !== null) {
    return buildReturnAst(return_);
  }

  throw new Error(`Unsupported statement context: ${ctx.getText()}`);
}

export function buildIfAst(ctx: IfContext): IfNode {
  const thenOpen = ctx.LBRACE(0);
  const thenClose = ctx.RBRACE(0);

  if (thenOpen === null || thenClose === null) {
    throw new Error(`If statement is missing then block: ${ctx.getText()}`);
  }

  const thenStatements = getStatementsBetween(
    ctx,
    thenOpen.getSymbol().tokenIndex,
    thenClose.getSymbol().tokenIndex,
  ).map(buildStatementAst);

  const elseToken = ctx.ELSE();
  if (elseToken === null) {
    return new IfNode(
      buildExprAst(ctx.expr()),
      thenStatements,
      undefined,
      location(ctx),
    );
  }

  const elseOpen = ctx.LBRACE(1);
  const elseClose = ctx.RBRACE(1);

  if (elseOpen === null || elseClose === null) {
    throw new Error(`If statement is missing else block: ${ctx.getText()}`);
  }

  const elseStatements = getStatementsBetween(
    ctx,
    elseOpen.getSymbol().tokenIndex,
    elseClose.getSymbol().tokenIndex,
  ).map(buildStatementAst);

  return new IfNode(
    buildExprAst(ctx.expr()),
    thenStatements,
    elseStatements,
    location(ctx),
  );
}

export function buildWhileAst(ctx: WhileContext): WhileNode {
  const bodyOpen = ctx.LBRACE();
  const bodyClose = ctx.RBRACE();

  const bodyStatements = getStatementsBetween(
    ctx,
    bodyOpen.getSymbol().tokenIndex,
    bodyClose.getSymbol().tokenIndex,
  ).map(buildStatementAst);

  return new WhileNode(buildExprAst(ctx.expr()), bodyStatements, location(ctx));
}

export function buildAssignAst(ctx: AssignContext): AssignNode {
  return new AssignNode(
    ctx.IDENT().getText(),
    buildExprAst(ctx.expr()),
    location(ctx),
  );
}

export function buildFunctionAst(ctx: FunctionContext): FunctionNode {
  return new FunctionNode(
    ctx.IDENT().getText(),
    ctx.params().param().map(buildParamAst),
    buildReturnTypeAst(ctx.returnType()),
    orderContexts([...ctx.statement(), ...ctx.declaration()]).map((item) =>
      item instanceof StatementContext
        ? buildStatementAst(item)
        : buildDeclareAst(item),
    ),
    location(ctx),
  );
}

export function buildReturnTypeAst(ctx: ReturnTypeContext): ReturnTypeNode {
  const type = getReturnType(ctx);
  const domainContext = ctx.domain();
  const domain =
    domainContext === null ? undefined : buildDomainAst(domainContext);

  if ((type === "int" || type === "float") && domain === undefined) {
    throw new Error(`${type} 型の戻り値には定義域が必要です: ${ctx.getText()}`);
  }

  return {
    type,
    domain,
  };
}

function getReturnType(ctx: ReturnTypeContext): string {
  const type = ctx.getChild(0)?.getText();
  if (type === undefined) {
    throw new Error(`戻り値の型が見つかりません: ${ctx.getText()}`);
  }
  return type;
}

export function buildParamAst(ctx: ParamContext): ParamNode {
  const type = getParamType(ctx);
  const domainContext = ctx.domain();
  const domain =
    domainContext === null ? undefined : buildDomainAst(domainContext);

  if ((type === "int" || type === "float") && domain === undefined) {
    throw new Error(`${type} 型の引数には定義域が必要です: ${ctx.getText()}`);
  }

  return {
    type,
    name: ctx.IDENT().getText(),
    domain,
  };
}

function getParamType(ctx: ParamContext): string {
  const type = ctx.getChild(0)?.getText();
  if (type === undefined) {
    throw new Error(`引数の型が見つかりません: ${ctx.getText()}`);
  }
  return type;
}

export function buildReturnAst(ctx: ReturnContext): ReturnNode {
  const expr = ctx.expr();
  return new ReturnNode(
    expr === null ? undefined : buildExprAst(expr),
    location(ctx),
  );
}

export function buildDeclareAst(ctx: DeclarationContext): DeclareNode {
  const initExpr = ctx.expr();
  const type = getDeclaredType(ctx);
  const domainContext = ctx.domain();
  const domain =
    domainContext === null ? undefined : buildDomainAst(domainContext);

  if ((type === "int" || type === "float") && domain === undefined) {
    throw new Error(`${type} 型の宣言には定義域が必要です: ${ctx.getText()}`);
  }

  return new DeclareNode(
    type,
    ctx.IDENT().getText(),
    domain,
    initExpr === null ? undefined : buildExprAst(initExpr),
    location(ctx),
  );
}

function getDeclaredType(ctx: DeclarationContext): string {
  const type = ctx.getChild(0)?.getText();
  if (type === undefined) {
    throw new Error(`宣言の型が見つかりません: ${ctx.getText()}`);
  }
  return type;
}

export function buildDomainAst(ctx: DomainContext): DomainNode {
  const max = ctx.expr(0);
  const min = ctx.expr(1);

  if (max === null || min === null) {
    throw new Error(`定義域に max/min が不足しています: ${ctx.getText()}`);
  }

  return {
    max: buildExprAst(max),
    min: buildExprAst(min),
  };
}

export function buildCallAst(ctx: CallContext): CallNode {
  return new CallNode(
    ctx.IDENT().getText(),
    ctx.args().expr().map(buildExprAst),
    location(ctx),
  );
}

export function buildExprAst(ctx: ExprContext): ExprNode {
  if (ctx instanceof IntContext) {
    return new IntNode(
      Number(ctx.INT().getText()),
      undefined,
      undefined,
      location(ctx),
    );
  }

  if (ctx instanceof FloatContext) {
    return new FloatNode(
      Number(ctx.FLOAT().getText()),
      undefined,
      undefined,
      location(ctx),
    );
  }

  if (ctx instanceof StringContext) {
    return new StringNode(
      parseStringLiteral(ctx.STRING().getText()),
      location(ctx),
    );
  }

  if (ctx instanceof BoolContext) {
    return new BoolNode(ctx.boolean().TRUE() !== null, location(ctx));
  }

  if (ctx instanceof ParensContext) {
    return buildExprAst(ctx.expr());
  }

  if (ctx instanceof CallExprContext) {
    return buildCallAst(ctx.call());
  }

  if (ctx instanceof VarContext) {
    return new VarNode(ctx.IDENT().getText(), location(ctx));
  }

  if (ctx instanceof AddSubContext || ctx instanceof MulDivContext) {
    const left = ctx.expr(0);
    const right = ctx.expr(1);
    const operator = ctx._op?.text;

    if (left === null || right === null) {
      throw new Error(
        `Binary expression is missing operands: ${ctx.getText()}`,
      );
    }

    if (!isBinaryOperator(operator)) {
      throw new Error(
        `Unsupported binary operator: ${operator ?? "<missing>"}`,
      );
    }

    return new BinaryNode(
      operator,
      buildExprAst(left),
      buildExprAst(right),
      location(ctx),
    );
  }

  if (ctx instanceof CompContext || ctx instanceof EqContext) {
    const left = ctx.expr(0);
    const right = ctx.expr(1);
    const operator = ctx._op?.text;

    if (left === null || right === null) {
      throw new Error(
        `Compare expression is missing operands: ${ctx.getText()}`,
      );
    }

    if (!isCompareOperator(operator)) {
      throw new Error(
        `Unsupported compare operator: ${operator ?? "<missing>"}`,
      );
    }

    return new CompareNode(
      operator,
      buildExprAst(left),
      buildExprAst(right),
      location(ctx),
    );
  }

  throw new Error(`Unsupported expression context: ${ctx.constructor.name}`);
}

function location(ctx: {
  start?: { line: number; column: number } | null;
}): SourceLocation | undefined {
  if (ctx.start === undefined || ctx.start === null) {
    return undefined;
  }

  return {
    line: ctx.start.line,
    column: ctx.start.column,
  };
}

function parseStringLiteral(value: string): string {
  return value.slice(1, -1).replace(/\\([btnr"\\])/g, (_, escaped: string) => {
    switch (escaped) {
      case "b":
        return "\b";
      case "t":
        return "\t";
      case "n":
        return "\n";
      case "r":
        return "\r";
      case '"':
        return '"';
      case "\\":
        return "\\";
      default:
        return escaped;
    }
  });
}

function isBinaryOperator(value: string | undefined): value is BinaryOperator {
  return (
    value === "+" ||
    value === "-" ||
    value === "*" ||
    value === "/" ||
    value === "%"
  );
}

function isCompareOperator(
  value: string | undefined,
): value is CompareOperator {
  return (
    value === "==" ||
    value === "!=" ||
    value === "<" ||
    value === ">" ||
    value === "<=" ||
    value === ">="
  );
}

function orderContexts<
  T extends StatementContext | FunctionContext | DeclarationContext,
>(contexts: T[]): T[] {
  return [...contexts].sort((left: T, right: T) => {
    const leftIndex = left.start?.tokenIndex ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = right.start?.tokenIndex ?? Number.MAX_SAFE_INTEGER;
    return leftIndex - rightIndex;
  });
}

function getStatementsBetween(
  ctx: IfContext | WhileContext,
  startTokenIndex: number,
  stopTokenIndex: number,
): StatementContext[] {
  return ctx.statement().filter((statement) => {
    const start = statement.start?.tokenIndex;
    const stop = statement.stop?.tokenIndex;

    return (
      start !== undefined &&
      stop !== undefined &&
      start > startTokenIndex &&
      stop < stopTokenIndex
    );
  });
}
