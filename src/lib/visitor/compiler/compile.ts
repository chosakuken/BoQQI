import { AssignNode } from "../../ast/nodes/assign.js";
import { BinaryNode } from "../../ast/nodes/binary.js";
import { BoolNode } from "../../ast/nodes/bool.js";
import { CallNode } from "../../ast/nodes/call.js";
import { CompareNode } from "../../ast/nodes/compare.js";
import { DeclareNode } from "../../ast/nodes/declare.js";
import { FloatNode } from "../../ast/nodes/float.js";
import { FunctionNode, ParamNode } from "../../ast/nodes/function.js";
import { IfNode } from "../../ast/nodes/if.js";
import { IntNode } from "../../ast/nodes/int.js";
import { AstNode } from "../../ast/nodes/node.js";
import { ProgramNode } from "../../ast/nodes/program.js";
import { ReturnNode } from "../../ast/nodes/return.js";
import { StatementNode } from "../../ast/nodes/statement.js";
import { StringNode } from "../../ast/nodes/string.js";
import { VarNode } from "../../ast/nodes/var.js";
import {
  BytecodeProgram,
  CompiledFunction,
  Instruction,
  LocalScope,
  ParamInfo,
  ValueType,
} from "../../vm/instruction.js";
import { Visitor } from "../visitor.js";

interface LocalSymbol {
  readonly name: string;
  readonly slot: number;
  readonly type: ValueType;
}

interface CompileContext {
  readonly name: string;
  readonly locals: Map<string, LocalSymbol>;
  localCount: number;
  readonly isFunction: boolean;
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
    const symbol = this.allocateLocal(node.name, type);

    if (node.domain !== undefined) {
      node.domain.max.accept(this);
      node.domain.min.accept(this);
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

  visitFunction(node: FunctionNode): void {
    if (this.functions.has(node.name)) {
      throw new Error(`関数 ${node.name} は既に定義済みです`);
    }

    const skipFunctionIndex = this.emit({ op: "JUMP", target: -1 }, node);
    const entryPc = this.instructions.length;
    const previousContext = this.context;
    const functionContext: CompileContext = {
      name: node.name,
      locals: new Map<string, LocalSymbol>(),
      localCount: 0,
      isFunction: true,
    };

    this.context = functionContext;
    const params = this.allocateParams(node.params);

    for (const param of node.params) {
      const symbol = this.context.locals.get(param.name);
      if (symbol === undefined) {
        throw new Error(`引数 ${param.name} の slot 割り当てに失敗しました`);
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

    this.emit({ op: "PUSH_INT", value: 0 }, node);
    this.emit({ op: "RETURN" }, node);

    this.functions.set(node.name, {
      name: node.name,
      entryPc,
      arity: node.params.length,
      localCount: functionContext.localCount,
      params,
    });

    this.context = previousContext;
    this.patchJump(skipFunctionIndex, this.instructions.length);
  }

  visitReturn(node: ReturnNode): void {
    if (!this.context.isFunction) {
      throw new Error("return 文は関数の中でのみ使用できます");
    }
    node.expr.accept(this);
    this.emit({ op: "RETURN" }, node);
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
    }
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

  private allocateLocal(name: string, type: ValueType): LocalSymbol {
    if (this.context.locals.has(name)) {
      throw new Error(`変数 ${name} は既に宣言済みです`);
    }

    const symbol = {
      name,
      slot: this.context.localCount,
      type,
    };

    this.context.locals.set(name, symbol);
    this.context.localCount += 1;
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

    throw new Error(`変数 ${name} は未定義です`);
  }

  private valueType(type: string): ValueType {
    switch (type) {
      case "int":
      case "float":
      case "string":
      case "bool":
        return type;
      default:
        throw new Error(`型 ${type} は存在しません`);
    }
  }
}
