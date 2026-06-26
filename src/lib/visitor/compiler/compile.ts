import { AssignNode } from "../../ast/nodes/assign.js";
import { BinaryNode } from "../../ast/nodes/binary.js";
import { BoolNode } from "../../ast/nodes/bool.js";
import { CallNode } from "../../ast/nodes/call.js";
import { CompareNode } from "../../ast/nodes/compare.js";
import { DeclareNode } from "../../ast/nodes/declare.js";
import { FloatNode } from "../../ast/nodes/float.js";
import {
  FunctionNode,
  ParamNode,
  ReturnTypeNode,
} from "../../ast/nodes/function.js";
import { IfNode } from "../../ast/nodes/if.js";
import { IndexNode } from "../../ast/nodes/index.js";
import { IntNode } from "../../ast/nodes/int.js";
import { AstNode } from "../../ast/nodes/node.js";
import { ProgramNode } from "../../ast/nodes/program.js";
import { ReturnNode } from "../../ast/nodes/return.js";
import { StatementNode } from "../../ast/nodes/statement.js";
import { StringNode } from "../../ast/nodes/string.js";
import { VarNode } from "../../ast/nodes/var.js";
import { WhileNode } from "../../ast/nodes/while.js";
import {
  BytecodeProgram,
  CompiledFunction,
  Instruction,
  LocalScope,
  ParamInfo,
  ScalarValueType,
  ValueType,
} from "../../vm/instruction.js";
import { Visitor } from "../visitor.js";

interface LocalSymbol {
  readonly name: string;
  readonly slot: number;
  readonly type: ValueType;
  readonly arrayLength?: number;
}

interface CompileContext {
  readonly name: string;
  readonly locals: Map<string, LocalSymbol>;
  localCount: number;
  readonly isFunction: boolean;
  readonly returnType?: ReturnTypeNode;
}

export function compile(program: ProgramNode): BytecodeProgram {
  const compiler = new BoqqiCompiler();
  return compiler.compile(program);
}

class BoqqiCompiler implements Visitor<void> {
  private readonly instructions: Instruction[] = [];
  private readonly functions = new Map<string, CompiledFunction>();
  private readonly globalContext: CompileContext = {
    name: "global",
    locals: new Map<string, LocalSymbol>(),
    localCount: 0,
    isFunction: false,
  };
  private context: CompileContext = this.globalContext;

  compile(program: ProgramNode): BytecodeProgram {
    program.accept(this);

    return {
      instructions: this.instructions,
      functions: this.functions,
      globalLocalCount: this.globalContext.localCount,
    };
  }

  visitProgram(node: ProgramNode): void {
    for (const statement of node.body) {
      this.compileStatement(statement);
    }
  }

  visitBinary(node: BinaryNode): void {
    node.left.accept(this);
    node.right.accept(this);

    switch (node.operator) {
      case "+":
        this.emit({ op: "ADD" }, node);
        break;
      case "-":
        this.emit({ op: "SUB" }, node);
        break;
      case "*":
        this.emit({ op: "MUL" }, node);
        break;
      case "/":
        this.emit({ op: "DIV" }, node);
        break;
      case "%":
        this.emit({ op: "MOD" }, node);
        break;
    }
  }

  visitCompare(node: CompareNode): void {
    node.left.accept(this);
    node.right.accept(this);

    switch (node.operator) {
      case "==":
        this.emit({ op: "EQ" }, node);
        break;
      case "!=":
        this.emit({ op: "NE" }, node);
        break;
      case ">":
        this.emit({ op: "GT" }, node);
        break;
      case "<":
        this.emit({ op: "LT" }, node);
        break;
      case ">=":
        this.emit({ op: "GE" }, node);
        break;
      case "<=":
        this.emit({ op: "LE" }, node);
        break;
    }
  }

  visitInt(node: IntNode): void {
    this.emit({ op: "PUSH_INT", value: node.value }, node);
  }

  visitFloat(node: FloatNode): void {
    this.emit({ op: "PUSH_FLOAT", value: node.value }, node);
  }

  visitString(node: StringNode): void {
    this.emit({ op: "PUSH_STRING", value: node.value }, node);
  }

  visitBool(node: BoolNode): void {
    this.emit({ op: "PUSH_BOOL", value: node.value }, node);
  }

  visitCall(node: CallNode): void {
    for (const arg of node.args) {
      arg.accept(this);
    }
    this.emit({ op: "CALL", name: node.name, argc: node.args.length }, node);
  }

  visitAssign(node: AssignNode): void {
    const resolved = this.resolveLocal(node.name);
    if (node.index !== undefined) {
      const length = this.arrayLength(resolved.symbol);
      node.index.accept(this);
      node.expr.accept(this);
      this.emit(
        {
          op: "STORE_INDEX",
          slot: resolved.symbol.slot,
          name: resolved.symbol.name,
          scope: resolved.scope,
          length,
        },
        node,
      );
      return;
    }
    node.expr.accept(this);
    this.emit(
      {
        op: "STORE",
        slot: resolved.symbol.slot,
        name: resolved.symbol.name,
        scope: resolved.scope,
      },
      node,
    );
  }

  visitDeclare(node: DeclareNode): void {
    const type = this.valueType(node.type);
    const symbol = this.allocateLocal(node.name, type, node.arrayLength);

    if (node.domain !== undefined) {
      node.domain.max.accept(this);
      node.domain.min.accept(this);
    }

    if (this.isArrayType(type)) {
      if (node.initValue !== undefined) {
        throw new Error(`配列 ${node.name} は一括初期化できません`);
      }

      const length = this.arrayLength(symbol);
      const elementType = this.arrayElementType(type);
      for (let index = 0; index < length; index += 1) {
        this.emitDefaultValue(elementType, node);
      }
      this.emit(
        {
          op: "DECLARE_ARRAY",
          slot: symbol.slot,
          name: symbol.name,
          elementType,
          length,
          hasDomain: node.domain !== undefined,
        },
        node,
      );
      return;
    }

    if (node.initValue !== undefined) {
      node.initValue.accept(this);
    } else {
      this.emitDefaultValue(type, node);
    }

    this.emit(
      {
        op: "DECLARE",
        slot: symbol.slot,
        name: symbol.name,
        type,
        hasDomain: node.domain !== undefined,
      },
      node,
    );
  }

  visitVar(node: VarNode): void {
    const resolved = this.resolveLocal(node.name);
    if (this.isArrayType(resolved.symbol.type)) {
      throw new Error(`配列 ${node.name} は値として読み出せません`);
    }
    this.emit(
      {
        op: "LOAD",
        slot: resolved.symbol.slot,
        name: resolved.symbol.name,
        scope: resolved.scope,
      },
      node,
    );
  }

  visitIndex(node: IndexNode): void {
    if (!(node.target instanceof VarNode)) {
      throw new Error("添え字アクセスの対象には配列変数が必要です");
    }
    const resolved = this.resolveLocal(node.target.name);
    const length = this.arrayLength(resolved.symbol);
    node.index.accept(this);
    this.emit(
      {
        op: "LOAD_INDEX",
        slot: resolved.symbol.slot,
        name: resolved.symbol.name,
        scope: resolved.scope,
        length,
      },
      node,
    );
  }

  visitIf(node: IfNode): void {
    node.cond.accept(this);
    const jumpIfFalseIndex = this.emit(
      {
        op: "JUMP_IF_FALSE",
        target: -1,
      },
      node,
    );

    for (const statement of node.trueStatement) {
      this.compileStatement(statement);
    }

    if (node.falseStatement === undefined) {
      this.patchJump(jumpIfFalseIndex, this.instructions.length);
      return;
    }

    const jumpToEndIndex = this.emit({ op: "JUMP", target: -1 }, node);
    this.patchJump(jumpIfFalseIndex, this.instructions.length);

    for (const statement of node.falseStatement) {
      this.compileStatement(statement);
    }

    this.patchJump(jumpToEndIndex, this.instructions.length);
  }

  visitWhile(node: WhileNode): void {
    const loopStartIndex = this.instructions.length;
    node.cond.accept(this);
    const jumpIfFalseIndex = this.emit(
      {
        op: "JUMP_IF_FALSE",
        target: -1,
      },
      node,
    );

    for (const statement of node.body) {
      this.compileStatement(statement);
    }

    this.emit({ op: "JUMP", target: loopStartIndex }, node);
    this.patchJump(jumpIfFalseIndex, this.instructions.length);
  }

  visitFunction(node: FunctionNode): void {
    const skipFunctionIndex = this.emit({ op: "JUMP", target: -1 }, node);
    const entryPc = this.instructions.length;
    const previousContext = this.context;
    const functionContext: CompileContext = {
      name: node.name,
      locals: new Map<string, LocalSymbol>(),
      localCount: 0,
      isFunction: true,
      returnType: node.returnType,
    };

    this.context = functionContext;
    const params = this.allocateParams(node.params);

    for (const param of node.params) {
      const symbol = this.context.locals.get(param.name);
      if (symbol === undefined) {
        throw new Error(
          `Internal compiler error: unallocated parameter ${param.name}`,
        );
      }

      if (param.domain !== undefined) {
        param.domain.max.accept(this);
        param.domain.min.accept(this);
      }

      this.emit(
        {
          op: "CHECK_LOCAL",
          slot: symbol.slot,
          name: symbol.name,
          type: symbol.type,
          hasDomain: param.domain !== undefined,
        },
        node,
      );
    }

    for (const statement of node.body) {
      this.compileStatement(statement);
    }

    const returnType = this.valueType(node.returnType.type);
    this.emitDefaultValue(returnType, node);
    this.emitReturn(node.returnType, node);

    this.functions.set(node.name, {
      name: node.name,
      entryPc,
      arity: node.params.length,
      localCount: functionContext.localCount,
      params,
      returnType: this.valueType(node.returnType.type),
      hasReturnDomain: node.returnType.domain !== undefined,
    });

    this.context = previousContext;
    this.patchJump(skipFunctionIndex, this.instructions.length);
  }

  visitReturn(node: ReturnNode): void {
    const returnType = this.context.returnType;
    if (returnType === undefined) {
      throw new Error("Internal compiler error: missing return type");
    }

    if (node.expr === undefined) {
      this.emit({ op: "PUSH_VOID" }, node);
    } else {
      node.expr.accept(this);
    }
    this.emitReturn(returnType, node);
  }

  private emit(instruction: Instruction, node?: AstNode): number {
    this.instructions.push({
      ...instruction,
      location: node?.location,
    });
    return this.instructions.length - 1;
  }

  private compileStatement(statement: StatementNode): void {
    statement.accept(this);
    if (statement instanceof CallNode) {
      this.emit({ op: "POP" }, statement);
    }
  }

  private patchJump(index: number, target: number): void {
    const instruction = this.instructions[index];
    if (instruction.op !== "JUMP" && instruction.op !== "JUMP_IF_FALSE") {
      throw new Error("ジャンプ命令の生成に失敗しました");
    }

    this.instructions[index] = {
      ...instruction,
      target,
    };
  }

  private emitDefaultValue(type: ValueType, node: AstNode): void {
    switch (type) {
      case "int":
        this.emit({ op: "PUSH_INT", value: 0 }, node);
        break;
      case "float":
        this.emit({ op: "PUSH_FLOAT", value: 0.0 }, node);
        break;
      case "string":
        this.emit({ op: "PUSH_STRING", value: "" }, node);
        break;
      case "bool":
        this.emit({ op: "PUSH_BOOL", value: false }, node);
        break;
      case "int[]":
      case "float[]":
      case "string[]":
      case "bool[]":
        throw new Error(`配列型 ${type} は値として生成できません`);
      case "void":
        this.emit({ op: "PUSH_VOID" }, node);
        break;
    }
  }

  private emitReturn(returnType: ReturnTypeNode, node: AstNode): void {
    if (returnType.domain !== undefined) {
      returnType.domain.max.accept(this);
      returnType.domain.min.accept(this);
    }

    this.emit({ op: "RETURN" }, node);
  }

  private allocateParams(params: ParamNode[]): ParamInfo[] {
    return params.map((param) => {
      const type = this.valueType(param.type);
      const symbol = this.allocateLocal(param.name, type);

      return {
        name: param.name,
        slot: symbol.slot,
        type,
        hasDomain: param.domain !== undefined,
      };
    });
  }

  private allocateLocal(
    name: string,
    type: ValueType,
    arrayLength?: number,
  ): LocalSymbol {
    const symbol = {
      name,
      slot: this.context.localCount,
      type,
      arrayLength,
    };

    this.context.locals.set(name, symbol);
    this.context.localCount += arrayLength ?? 1;
    return symbol;
  }

  private resolveLocal(name: string): {
    readonly symbol: LocalSymbol;
    readonly scope: LocalScope;
  } {
    const local = this.context.locals.get(name);
    if (local !== undefined) {
      return { symbol: local, scope: "local" };
    }

    const global = this.globalContext.locals.get(name);
    if (global !== undefined) {
      return { symbol: global, scope: "global" };
    }

    throw new Error(`Internal compiler error: unresolved variable ${name}`);
  }

  private valueType(type: string): ValueType {
    switch (type) {
      case "int":
      case "float":
      case "string":
      case "bool":
      case "int[]":
      case "float[]":
      case "string[]":
      case "bool[]":
      case "void":
        return type;
      default:
        throw new Error(`型 ${type} は存在しません`);
    }
  }

  private isArrayType(type: ValueType): type is `${ScalarValueType}[]` {
    return (
      type === "int[]" ||
      type === "float[]" ||
      type === "string[]" ||
      type === "bool[]"
    );
  }

  private arrayElementType(type: `${ScalarValueType}[]`): ScalarValueType {
    return type.slice(0, -2) as ScalarValueType;
  }

  private arrayLength(symbol: LocalSymbol): number {
    if (!this.isArrayType(symbol.type) || symbol.arrayLength === undefined) {
      throw new Error(`変数 ${symbol.name} は配列型ではありません`);
    }
    return symbol.arrayLength;
  }
}
