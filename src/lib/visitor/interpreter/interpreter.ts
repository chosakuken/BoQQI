import { Visitor } from "../visitor.js";
import { RuntimeValue } from "./runtimeValue/runtimeValue.js";
import { ProgramNode } from "../../ast/nodes/program.js";
import {
  BoolValue,
  FloatValue,
  IntValue,
  StringValue,
  VoidValue,
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
import {
  FunctionNode,
  ParamNode,
  ReturnTypeNode,
} from "../../ast/nodes/function.js";
import { StringNode } from "../../ast/nodes/string.js";
import { DeclareNode } from "../../ast/nodes/declare.js";
import { AstNode } from "../../ast/nodes/node.js";
import { BoqqiRuntimeError } from "../../diagnostics/runtimeError.js";
import { SourceFrame } from "../../diagnostics/sourceLocation.js";
import { ReturnNode } from "../../ast/nodes/return.js";
import { WhileNode } from "../../ast/nodes/while.js";

interface Var {
  domain?: {
    max: number;
    min: number;
  };
  runtimeValue: RuntimeValue;
}

interface EnvFrame {
  readonly name: string;
  readonly vars: Map<string, Var>;
}

interface UserFunction {
  readonly name: string;
  readonly params: ParamNode[];
  readonly returnType: ReturnTypeNode;
  readonly body: FunctionNode["body"];
  readonly location: FunctionNode["location"];
}

type FunctionValue =
  | {
      readonly kind: "builtin";
      readonly call: (args: RuntimeValue[]) => RuntimeValue;
    }
  | { readonly kind: "user"; readonly fn: UserFunction };

class ReturnSignal extends Error {
  constructor(readonly value: RuntimeValue) {
    super("return");
  }
}

export class BoqqiInterpreter implements Visitor<RuntimeValue> {
  private funcs: Map<string, FunctionValue>; // 関数表
  private envFrames: EnvFrame[]; // 変数表
  private readonly frames: SourceFrame[] = [];
  private readonly output: (text: string) => void; // 出力先

  constructor(private readonly outputDevice: (text: string) => void) {
    this.output = outputDevice;
    this.funcs = new Map<string, FunctionValue>();
    this.envFrames = [{ name: "global", vars: new Map<string, Var>() }];
    // 組み込み関数
    this.funcs.set("print", {
      kind: "builtin",
      call: (args: RuntimeValue[]) => {
        for (const arg of args) {
          if (arg.type === "void") {
            this.fail("void 型の値は出力できません");
          }
          this.output(`${String(arg.value)}\n`);
        }
        return new IntValue(0); // 正常動作として 0 を返す
      },
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
      if (left.value === undefined || right.value === undefined) {
        this.fail("void 型の値は比較できません");
      }
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
      if (func.kind === "builtin") {
        return func.call(args);
      }

      return this.callUserFunction(func.fn, args);
    });
  }
  visitAssign(node: AssignNode): RuntimeValue {
    return this.withFrame(node, `assign ${node.name}`, () => {
      const value = node.expr.accept(this);
      const currentVar = this.findVar(node.name);
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
      currentVar.runtimeValue = value;
      return value;
    });
  }
  visitDeclare(node: DeclareNode): RuntimeValue {
    return this.withFrame(node, `declare ${node.name}`, () => {
      const vars = this.currentEnvFrame().vars;
      if (vars.has(node.name)) {
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
          vars.set(node.name, {
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
      const variable = this.findVar(node.name);
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
  visitWhile(node: WhileNode): RuntimeValue {
    return this.withFrame(node, "while", () => {
      let shouldContinue = this.evalWhileCondition(node);
      while (shouldContinue) {
        for (const statement of node.body) {
          statement.accept(this);
        }
        shouldContinue = this.evalWhileCondition(node);
      }
      return new IntValue(0);
    });
  }
  visitFunction(node: FunctionNode): RuntimeValue {
    return this.withFrame(node, `function ${node.name}`, () => {
      if (this.funcs.has(node.name)) {
        this.fail(`関数 ${node.name} は既に定義済みです`);
      }
      this.funcs.set(node.name, {
        kind: "user",
        fn: {
          name: node.name,
          params: node.params,
          returnType: node.returnType,
          body: node.body,
          location: node.location,
        },
      });
      return new IntValue(0);
    });
  }
  visitReturn(node: ReturnNode): RuntimeValue {
    return this.withFrame(node, "return", () => {
      // 関数環境内で実行されない場合、エラーとする
      if (this.envFrames.length <= 1) {
        this.fail("return 文は関数の中でのみ使用できます");
      }
      // 例外として中断する形式
      throw new ReturnSignal(
        node.expr === undefined ? new VoidValue() : node.expr.accept(this),
      );
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
  private evalWhileCondition(node: WhileNode): boolean {
    const cond = node.cond.accept(this);
    if (typeof cond.value !== "boolean") {
      this.fail("while 文の条件式には真偽値を入力しなければなりません");
    }
    return cond.value;
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
  // ユーザ定義の関数を呼び出す
  private callUserFunction(
    func: UserFunction,
    args: RuntimeValue[],
  ): RuntimeValue {
    if (args.length !== func.params.length) {
      this.fail(
        `関数 ${func.name} は ${String(func.params.length)} 個の引数を取りますが、${String(args.length)} 個渡されました`,
      );
    }
    // 新環境として、フレームをスタックに積む
    const frame: EnvFrame = {
      name: func.name,
      vars: new Map<string, Var>(),
    };
    this.envFrames.push(frame);
    try {
      // 引数の設定(型チェック)
      for (const [index, param] of func.params.entries()) {
        const value = args[index];

        if (value.type !== param.type) {
          this.fail(
            `関数 ${func.name} の引数 ${param.name} は ${param.type} 型ですが、${value.type} 型が渡されました`,
          );
        }

        frame.vars.set(param.name, {
          runtimeValue: value,
        });
      }
      // 引数の初期化(実値代入)
      for (const param of func.params) {
        const variable = frame.vars.get(param.name);
        if (variable === undefined) {
          this.fail(`引数 ${param.name} の初期化に失敗しました`);
        }

        const domain =
          param.domain === undefined ? undefined : this.evalParamDomain(param);
        this.assertWithinDomain(param.name, variable.runtimeValue, domain);

        variable.domain = domain;
      }
      // 関数の実行
      for (const statement of func.body) {
        statement.accept(this);
      }
      return this.assertReturnValue(func, new VoidValue());
    } catch (error) {
      if (error instanceof ReturnSignal) {
        return this.assertReturnValue(func, error.value);
      }
      throw error;
    } finally {
      this.envFrames.pop();
    }
  }

  private assertReturnValue(
    func: UserFunction,
    value: RuntimeValue,
  ): RuntimeValue {
    if (value.type !== func.returnType.type) {
      this.fail(
        `関数 ${func.name} は ${func.returnType.type} 型を返す必要がありますが、${value.type} 型が返されました`,
      );
    }

    const domain =
      func.returnType.domain === undefined
        ? undefined
        : this.evalReturnDomain(func);
    this.assertReturnWithinDomain(func.name, value, domain);

    return value;
  }

  private assertReturnWithinDomain(
    name: string,
    value: RuntimeValue,
    domain: Var["domain"],
  ): void {
    if (domain === undefined) {
      return;
    }
    if (typeof value.value !== "number") {
      this.fail(`関数 ${name} の戻り値の定義域チェックには数値が必要です`);
    }
    if (value.value < domain.min || value.value > domain.max) {
      this.fail(
        `関数 ${name} の戻り値として定義域 [${String(domain.min)}, ${String(domain.max)}] 外の値 ${String(value.value)} が返されました`,
      );
    }
  }

  private evalReturnDomain(func: UserFunction): Var["domain"] {
    if (func.returnType.domain === undefined) {
      return undefined;
    }

    const max = func.returnType.domain.max.accept(this);
    const min = func.returnType.domain.min.accept(this);

    if (typeof max.value !== "number" || typeof min.value !== "number") {
      this.fail(`関数 ${func.name} の戻り値の定義域には数値を指定してください`);
    }

    return {
      max: max.value,
      min: min.value,
    };
  }

  private evalParamDomain(param: ParamNode): Var["domain"] {
    if (param.domain === undefined) {
      return undefined;
    }

    const max = param.domain.max.accept(this);
    const min = param.domain.min.accept(this);

    if (typeof max.value !== "number" || typeof min.value !== "number") {
      this.fail(`引数 ${param.name} の定義域には数値を指定してください`);
    }

    return {
      max: max.value,
      min: min.value,
    };
  }

  private findVar(name: string): Var | undefined {
    const currentFrame = this.currentEnvFrame();
    const current = currentFrame.vars.get(name);
    if (current !== undefined) {
      return current;
    }

    if (this.envFrames.length <= 1) {
      return undefined;
    }

    return this.envFrames[0].vars.get(name);
  }

  private currentEnvFrame(): EnvFrame {
    const frame = this.envFrames.at(-1);
    if (frame === undefined) {
      this.fail("実行環境が存在しません");
    }
    return frame;
  }

  private withFrame<T>(node: AstNode, label: string, run: () => T): T {
    this.frames.push({ label, location: node.location });
    try {
      return run();
    } catch (error) {
      if (error instanceof BoqqiRuntimeError) {
        throw error;
      }
      if (error instanceof ReturnSignal) {
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
