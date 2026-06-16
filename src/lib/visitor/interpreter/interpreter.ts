import { Visitor } from "../visitor.js";
import { RuntimeValue } from "./runtimeValue/runtimeValue.js";
import { ProgramNode } from "../../ast/nodes/program.js";
import {
  BoolValue,
  FloatValue,
  IntValue,
  StringValue,
} from "./runtimeValue/valuableValue.js";
import { BinaryNode } from "../../ast/nodes/binary.js";
import { BoolNode } from "../../ast/nodes/bool.js";
import { IntNode } from "../../ast/nodes/int.js";
import { CallNode } from "../../ast/nodes/call.js";
import { AssignNode } from "../../ast/nodes/assign.js";
import { VarNode } from "../../ast/nodes/var.js";
import { CompareNode } from "../../ast/nodes/compare.js";
import { IfNode } from "../../ast/nodes/if.js";
import { FloatNode } from "../../ast/nodes/float.js";
import { StringNode } from "../../ast/nodes/string.js";
import { DeclareNode } from "../../ast/nodes/declare.js";
import { AstNode } from "../../ast/nodes/node.js";
import { BoqqiRuntimeError } from "../../diagnostics/runtimeError.js";
import { SourceFrame } from "../../diagnostics/sourceLocation.js";

interface Var {
  domain?: {
    max: number;
    min: number;
  };
  runtimeValue: RuntimeValue;
}
type Func = (args: RuntimeValue[]) => RuntimeValue;

export class BoqqiInterpreter implements Visitor<RuntimeValue> {
  private funcs: Map<string, Func>; // 関数表
  private vars: Map<string, Var>; // 変数表
  private readonly frames: SourceFrame[] = [];
  private readonly output: (text: string) => void; // 出力先

  constructor(private readonly outputDevice: (text: string) => void) {
    this.output = outputDevice;
    this.funcs = new Map<string, Func>();
    this.vars = new Map<string, Var>();
    // 組み込み関数
    this.funcs.set("print", (args: RuntimeValue[]) => {
      for (const arg of args) {
        this.output(`${String(arg.value)}\n`);
      }
      return new IntValue(0); // 正常動作として 0 を返す
    });
  }
  // ビジター
  visitProgram(node: ProgramNode): RuntimeValue {
    return this.withFrame(node, "program", () => {
      for (const child of node.body) {
        child.accept(this);
      }
      return new IntValue(0); // 正常動作として 0 を返す
    });
  }
  visitBinary(node: BinaryNode): RuntimeValue {
    return this.withFrame(node, `binary '${node.operator}'`, () => {
      const left = node.left.accept(this);
      const right = node.right.accept(this);
      // 本来は意味解析の部分で触れるが今回はここに書く
      if (typeof left.value != "number") {
        this.fail("式の左辺には数値を入力しなければなりません");
      }
      if (typeof right.value != "number") {
        this.fail("式の右辺には数値を入力しなければなりません");
      }
      // 実行
      switch (node.operator) {
        case "+":
          return this.numberToRuntimeValue(
            this.numericResultType(left, right),
            left.value + right.value,
          );
        case "-":
          return this.numberToRuntimeValue(
            this.numericResultType(left, right),
            left.value - right.value,
          );
        case "*":
          return this.numberToRuntimeValue(
            this.numericResultType(left, right),
            left.value * right.value,
          );
        case "/":
          // ゼロ除算
          if (right.value === 0) {
            this.fail("0 除算が検出されました");
          }
          return this.numberToRuntimeValue(
            this.numericResultType(left, right),
            left.value / right.value,
          );
        default:
          this.fail(`演算子 ${String(node.operator)} は未定義です`);
      }
    });
  }
  visitCompare(node: CompareNode): RuntimeValue {
    return this.withFrame(node, `compare '${node.operator}'`, () => {
      const left = node.left.accept(this);
      const right = node.right.accept(this);
      switch (node.operator) {
        case "==":
          return new BoolValue(left.value == right.value);
        case "!=":
          return new BoolValue(left.value != right.value);
        case ">=":
          return new BoolValue(left.value >= right.value);
        case "<=":
          return new BoolValue(left.value <= right.value);
        case ">":
          return new BoolValue(left.value > right.value);
        case "<":
          return new BoolValue(left.value < right.value);
        default:
          this.fail(`演算子 ${String(node.operator)} は未定義です`);
      }
    });
  }
  visitInt(node: IntNode): RuntimeValue {
    return this.withFrame(node, "int literal", () => new IntValue(node.value));
  }
  visitFloat(node: FloatNode): RuntimeValue {
    return this.withFrame(
      node,
      "float literal",
      () => new FloatValue(node.value),
    );
  }
  visitString(node: StringNode): RuntimeValue {
    return this.withFrame(
      node,
      "string literal",
      () => new StringValue(node.value),
    );
  }
  visitBool(node: BoolNode): RuntimeValue {
    return this.withFrame(
      node,
      "bool literal",
      () => new BoolValue(node.value),
    );
  }
  visitCall(node: CallNode): RuntimeValue {
    return this.withFrame(node, `call ${node.name}`, () => {
      const func = this.funcs.get(node.name);
      if (func === undefined) {
        this.fail(`関数 ${node.name} は未定義です`);
      }
      // 引数解釈
      const args: RuntimeValue[] = [];
      for (const child of node.args) {
        args.push(child.accept(this));
      }
      // 実行
      return func(args);
    });
  }
  visitAssign(node: AssignNode): RuntimeValue {
    return this.withFrame(node, `assign ${node.name}`, () => {
      const value = node.expr.accept(this);
      const currentVar = this.vars.get(node.name);
      // エラーハンドリング
      if (currentVar === undefined) {
        this.fail(`変数 ${node.name} は宣言されていません`);
      }
      if (value.type !== currentVar.runtimeValue.type) {
        this.fail(
          `変数 ${node.name} は ${currentVar.runtimeValue.type} 型ですが、${value.type} 型が代入されようとしました`,
        );
      }
      this.assertWithinDomain(node.name, value, currentVar.domain);
      this.vars.set(node.name, {
        ...currentVar,
        runtimeValue: value,
      });
      return value;
    });
  }
  visitDeclare(node: DeclareNode): RuntimeValue {
    return this.withFrame(node, `declare ${node.name}`, () => {
      if (this.vars.has(node.name)) {
        this.fail(`変数 ${node.name} は既に宣言済みです`);
      }
      const domain =
        node.domain === undefined ? undefined : this.evalDomain(node);
      const value =
        node.initValue !== undefined
          ? node.initValue.accept(this)
          : this.defaultValue(node.type);
      if (value.type !== node.type) {
        this.fail(
          `変数 ${node.name} は ${node.type} 型ですが、${value.type} 型で初期化されようとしました`,
        );
      }
      this.assertWithinDomain(node.name, value, domain);

      switch (node.type) {
        case "int":
        case "float":
        case "string":
        case "bool":
          this.vars.set(node.name, {
            domain,
            runtimeValue: value,
          });
          break;
        default:
          this.fail(`型 ${node.type} は存在しません`);
      }
      return new IntValue(0); // 正常動作として 0 を返す
    });
  }
  visitVar(node: VarNode): RuntimeValue {
    return this.withFrame(node, `load ${node.name}`, () => {
      const variable = this.vars.get(node.name);
      if (variable === undefined) {
        this.fail(`変数 ${node.name} は未定義です`);
      }
      return variable.runtimeValue;
    });
  }
  visitIf(node: IfNode): RuntimeValue {
    return this.withFrame(node, "if", () => {
      const cond = node.cond.accept(this);
      // エラーハンドリング
      if (typeof cond.value !== "boolean") {
        this.fail("if 文の条件式には真偽値を入力しなければなりません");
      }
      // 実行
      if (cond.value) {
        for (const statement of node.trueStatement) {
          statement.accept(this);
        }
      } else if (node.falseStatement !== undefined) {
        for (const statement of node.falseStatement) {
          statement.accept(this);
        }
      }
      return new IntValue(0); // 正常動作として 0 を返す
    });
  }
  // ヘルパー関数
  private numericResultType(left: RuntimeValue, right: RuntimeValue): string {
    return left.type === "int" && right.type === "int" ? "int" : "float";
  }
  private numberToRuntimeValue(type: string, value: number): RuntimeValue {
    if (!Number.isFinite(value)) {
      this.fail("計算結果が有限の数値ではありません");
    }
    if (type === "int") {
      return new IntValue(Math.floor(value));
    }
    return new FloatValue(value);
  }
  private defaultValue(type: string): RuntimeValue {
    switch (type) {
      case "int":
        return new IntValue(0);
      case "float":
        return new FloatValue(0.0);
      case "string":
        return new StringValue("");
      case "bool":
        return new BoolValue(false);
      default:
        this.fail(`型 ${type} は存在しません`);
    }
  }
  private evalDomain(node: DeclareNode): Var["domain"] {
    if (node.domain === undefined) {
      return undefined;
    }

    const max = node.domain.max.accept(this);
    const min = node.domain.min.accept(this);

    if (typeof max.value !== "number" || typeof min.value !== "number") {
      this.fail(`変数 ${node.name} の定義域には数値を指定してください`);
    }

    return {
      max: max.value,
      min: min.value,
    };
  }
  private assertWithinDomain(
    name: string,
    value: RuntimeValue,
    domain: Var["domain"],
  ): void {
    if (domain === undefined) {
      return;
    }
    if (typeof value.value !== "number") {
      this.fail(`変数 ${name} の定義域チェックには数値が必要です`);
    }
    if (value.value < domain.min || value.value > domain.max) {
      this.fail(
        `変数 ${name} に定義域 [${String(domain.min)}, ${String(domain.max)}] 外の値 ${String(value.value)} が代入されようとしました`,
      );
    }
  }

  private withFrame<T>(node: AstNode, label: string, run: () => T): T {
    this.frames.push({ label, location: node.location });
    try {
      return run();
    } catch (error) {
      if (error instanceof BoqqiRuntimeError) {
        throw error;
      }

      const message = error instanceof Error ? error.message : String(error);
      this.fail(message);
    } finally {
      this.frames.pop();
    }
  }

  private fail(message: string): never {
    throw new BoqqiRuntimeError(message, [...this.frames]);
  }
}
