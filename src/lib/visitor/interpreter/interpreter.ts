import { Visitor } from "../visitor.js";
import { ProgramNode } from "../../ast/nodes/program.js";
import {
  BoolValue,
  FloatValue,
  IntValue,
  StringValue,
  VoidValue,
  createDefaultValue,
  createNumericValue,
  numericResultType,
  runtimeValueToString,
  type RuntimeValue,
} from "../../runtime/runtimeValue.js";
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
import { InputScanner } from "../../io/inputScanner.js";
import { SourceFrame } from "../../diagnostics/sourceLocation.js";
import { ReturnNode } from "../../ast/nodes/return.js";
import { WhileNode } from "../../ast/nodes/while.js";
import { IndexNode } from "../../ast/nodes/index.js";
import {
  arrayElementType,
  isArrayType,
  type RuntimeValueType,
  type ScalarValueType,
} from "../../types/valueType.js";

interface Var {
  domain?: {
    max: number;
    min: number;
  };
  runtimeValue?: RuntimeValue;
  arrayLength?: number;
  elementType?: RuntimeValueType;
}

interface EnvFrame {
  readonly name: string;
  readonly vars: Map<string, Var>;
  readonly boundaryTestParams: boolean;
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

export type BoqqiInterpreterExecutionMode = "normal" | "max-test" | "min-test";

export interface BoqqiInterpreterOptions {
  readonly mode?: BoqqiInterpreterExecutionMode;
  readonly boundaryTestLog?: (text: string) => void;
  readonly interactiveInput?: boolean;
}

export class BoqqiInterpreter implements Visitor<RuntimeValue> {
  private funcs: Map<string, FunctionValue>; // 関数表
  private envFrames: EnvFrame[]; // 変数表
  private readonly frames: SourceFrame[] = [];
  private readonly output: (text: string) => void; // 出力先
  private readonly input: InputScanner;
  private readonly mode: BoqqiInterpreterExecutionMode;
  private readonly boundaryTestLog?: (text: string) => void;
  private readonly boundaryTestedFunctions = new Set<string>();
  private didRunFunctionBoundaryTests = false;

  constructor(
    private readonly outputDevice: (text: string) => void,
    inputSource = "",
    options: BoqqiInterpreterOptions = {},
  ) {
    this.output = outputDevice;
    this.input = new InputScanner(inputSource, {
      interactive: options.interactiveInput === true,
    });
    this.mode = options.mode ?? "normal";
    this.boundaryTestLog = options.boundaryTestLog;
    this.funcs = new Map<string, FunctionValue>();
    this.envFrames = [
      {
        name: "global",
        vars: new Map<string, Var>(),
        boundaryTestParams: false,
      },
    ];
    // 組み込み関数
    this.funcs.set("print", {
      kind: "builtin",
      call: (args: RuntimeValue[]) => {
        for (const arg of args) {
          this.output(runtimeValueToString(arg));
        }
        return new VoidValue();
      },
    });
    this.funcs.set("println", {
      kind: "builtin",
      call: (args: RuntimeValue[]) => {
        for (const arg of args) {
          this.output(runtimeValueToString(arg));
        }
        this.output("\n");
        return new VoidValue();
      },
    });
    this.funcs.set("scanInt", {
      kind: "builtin",
      call: () => this.scanInput("int"),
    });
    this.funcs.set("scanFloat", {
      kind: "builtin",
      call: () => this.scanInput("float"),
    });
    this.funcs.set("scanString", {
      kind: "builtin",
      call: () => this.scanInput("string"),
    });
    this.funcs.set("scanBool", {
      kind: "builtin",
      call: () => this.scanInput("bool"),
    });
  }
  // ビジター
  visitProgram(node: ProgramNode): RuntimeValue {
    return this.withFrame(node, "program", () => {
      if (this.isBoundaryTestMode()) {
        this.registerProgramFunctions(node);
        if (!this.didRunFunctionBoundaryTests) {
          this.runFunctionBoundaryTests();
          this.boundaryTestLog?.("test of main:");
        }
      }

      for (const child of node.body) {
        if (this.isBoundaryTestMode() && child instanceof FunctionNode) {
          continue;
        }
        child.accept(this);
      }
      return new IntValue(0); // 正常動作として 0 を返す
    });
  }

  visitBinary(node: BinaryNode): RuntimeValue {
    return this.withFrame(node, `binary '${node.operator}'`, () => {
      const left = node.left.accept(this);
      const right = node.right.accept(this);
      const leftValue = Number(left.value);
      const rightValue = Number(right.value);
      // 実行
      switch (node.operator) {
        case "+":
          return createNumericValue(
            numericResultType(left, right),
            leftValue + rightValue,
          );
        case "-":
          return createNumericValue(
            numericResultType(left, right),
            leftValue - rightValue,
          );
        case "*":
          return createNumericValue(
            numericResultType(left, right),
            leftValue * rightValue,
          );
        case "/":
          // ゼロ除算
          if (rightValue === 0) {
            this.fail("0 除算が検出されました");
          }
          return createNumericValue(
            numericResultType(left, right),
            leftValue / rightValue,
          );
        case "%":
          if (rightValue === 0) {
            this.fail("0 除算が検出されました");
          }
          return createNumericValue(
            numericResultType(left, right),
            leftValue % rightValue,
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
      const leftValue = left.value ?? false;
      const rightValue = right.value ?? false;
      switch (node.operator) {
        case "==":
          return new BoolValue(leftValue == rightValue);
        case "!=":
          return new BoolValue(leftValue != rightValue);
        case ">=":
          return new BoolValue(leftValue >= rightValue);
        case "<=":
          return new BoolValue(leftValue <= rightValue);
        case ">":
          return new BoolValue(leftValue > rightValue);
        case "<":
          return new BoolValue(leftValue < rightValue);
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
      const func = this.assumeDefined(
        this.funcs.get(node.name),
        `Internal interpreter error: unresolved function ${node.name}`,
      );
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
      const currentVar = this.assumeDefined(
        this.findVar(node.name),
        `Internal interpreter error: unresolved variable ${node.name}`,
      );
      if (node.index !== undefined) {
        const index = node.index.accept(this);
        this.storeArrayElement(node.name, currentVar, index, value);
        return value;
      }
      this.assertWithinDomain(node.name, value, currentVar.domain);
      if (currentVar.runtimeValue === undefined) {
        this.fail(`配列 ${node.name} への一括代入はできません`);
      }
      currentVar.runtimeValue = value;
      return value;
    });
  }
  visitDeclare(node: DeclareNode): RuntimeValue {
    return this.withFrame(node, `declare ${node.name}`, () => {
      const vars = this.currentEnvFrame().vars;
      const domain =
        node.domain === undefined ? undefined : this.evalDomain(node);
      if (isArrayType(node.type)) {
        const length = node.arrayLength ?? 0;
        const elementType = arrayElementType(node.type);
        vars.set(node.name, {
          domain,
          arrayLength: length,
          elementType,
        });
        for (let index = 0; index < length; index += 1) {
          const value = this.defaultValue(elementType);
          this.assertWithinDomain(
            `${node.name}[${String(index)}]`,
            value,
            domain,
          );
          vars.set(`${node.name}[${String(index)}]`, {
            domain,
            runtimeValue: this.boundaryTestValue(
              `${node.name}[${String(index)}]`,
              value,
              domain,
            ),
          });
        }
        return new IntValue(0);
      }

      const value =
        node.initValue !== undefined
          ? node.initValue.accept(this)
          : this.defaultValue(node.type);
      this.assertWithinDomain(node.name, value, domain);

      vars.set(node.name, {
        domain,
        runtimeValue: this.boundaryTestValue(node.name, value, domain),
      });
      return new IntValue(0); // 正常動作として 0 を返す
    });
  }
  visitVar(node: VarNode): RuntimeValue {
    return this.withFrame(node, `load ${node.name}`, () => {
      const variable = this.assumeDefined(
        this.findVar(node.name),
        `Internal interpreter error: unresolved variable ${node.name}`,
      );
      if (variable.runtimeValue === undefined) {
        this.fail(`配列 ${node.name} は値として読み出せません`);
      }
      return variable.runtimeValue;
    });
  }

  visitIndex(node: IndexNode): RuntimeValue {
    return this.withFrame(node, "index", () => {
      if (!(node.target instanceof VarNode)) {
        this.fail("添え字アクセスの対象には配列変数が必要です");
      }
      const index = node.index.accept(this);
      return this.loadArrayElement(node.target.name, index);
    });
  }

  visitIf(node: IfNode): RuntimeValue {
    return this.withFrame(node, "if", () => {
      const cond = node.cond.accept(this);
      // 実行
      if (cond.value === true) {
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
      // 例外として中断する形式
      throw new ReturnSignal(
        node.expr === undefined ? new VoidValue() : node.expr.accept(this),
      );
    });
  }
  // ヘルパー関数
  private evalWhileCondition(node: WhileNode): boolean {
    const cond = node.cond.accept(this);
    return cond.value as boolean;
  }
  private registerProgramFunctions(node: ProgramNode): void {
    for (const child of node.body) {
      if (child instanceof FunctionNode) {
        child.accept(this);
      }
    }
  }

  private runFunctionBoundaryTests(): void {
    this.didRunFunctionBoundaryTests = true;

    for (const [name, func] of this.funcs.entries()) {
      if (func.kind !== "user") {
        continue;
      }
      this.boundaryTestLog?.(`test of ${name}():`);
      this.runFunctionBoundaryTest(func.fn);
    }
  }

  private runFunctionBoundaryTest(func: UserFunction): void {
    const savedGlobalVars = new Map<string, Var>(
      Array.from(this.envFrames[0].vars.entries(), ([name, variable]) => [
        name,
        { ...variable },
      ]),
    );
    const args = func.params.map((param) =>
      this.defaultValueForBoundaryTest(param.type),
    );

    try {
      this.callUserFunction(func, args);
    } finally {
      this.envFrames[0].vars.clear();
      for (const [name, variable] of savedGlobalVars) {
        this.envFrames[0].vars.set(name, variable);
      }
    }
  }

  private defaultValueForBoundaryTest(type: string): RuntimeValue {
    switch (type) {
      case "int":
      case "float":
      case "string":
      case "bool":
      case "void":
        return createDefaultValue(type);
      default:
        this.fail(`関数テスト用の引数型 ${type} は未対応です`);
    }
  }

  private defaultValue(type: string): RuntimeValue {
    switch (type) {
      case "int":
      case "float":
      case "string":
      case "bool":
        return createDefaultValue(type);
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

    return {
      max: max.value as number,
      min: min.value as number,
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
    const numericValue = value.value as number;
    if (numericValue < domain.min || numericValue > domain.max) {
      this.fail(
        `変数 ${name} に定義域 [${String(domain.min)}, ${String(domain.max)}] 外の値 ${String(numericValue)} が代入されようとしました`,
      );
    }
  }

  private boundaryTestValue(
    name: string,
    value: RuntimeValue,
    domain: Var["domain"],
  ): RuntimeValue {
    if (!this.isBoundaryTestMode() || domain === undefined) {
      return value;
    }

    switch (value.type) {
      case "int":
      case "float": {
        const boundaryValue = createNumericValue(
          value.type,
          this.mode === "max-test" ? domain.max : domain.min,
        );
        this.logBoundaryTestAssignment(name, boundaryValue);
        return boundaryValue;
      }
      default:
        return value;
    }
  }

  private shouldBoundaryTestFunctionParams(name: string): boolean {
    if (!this.isBoundaryTestMode() || this.boundaryTestedFunctions.has(name)) {
      return false;
    }

    this.boundaryTestedFunctions.add(name);
    return true;
  }

  private logBoundaryTestAssignment(
    name: string,
    boundaryValue: RuntimeValue,
  ): void {
    this.boundaryTestLog?.(
      `[${this.mode}] ${name} <- ${runtimeValueToString(boundaryValue)}`,
    );
  }

  private isBoundaryTestMode(): boolean {
    return this.mode === "max-test" || this.mode === "min-test";
  }

  private scanInput(type: ScalarValueType): RuntimeValue {
    if (this.isBoundaryTestMode()) {
      return createDefaultValue(type);
    }
    return this.input.scan(type);
  }

  private storeArrayElement(
    name: string,
    variable: Var,
    index: RuntimeValue,
    value: RuntimeValue,
  ): void {
    if (variable.arrayLength === undefined) {
      this.fail(`変数 ${name} は配列ではありません`);
    }
    const indexValue = this.arrayIndex(name, index, variable.arrayLength);
    const element = this.assumeDefined(
      this.findVar(`${name}[${String(indexValue)}]`),
      `Internal interpreter error: unresolved variable ${name}[${String(indexValue)}]`,
    );
    this.assertWithinDomain(
      `${name}[${String(indexValue)}]`,
      value,
      variable.domain,
    );
    element.runtimeValue = value;
  }
  // ユーザ定義の関数を呼び出す
  private callUserFunction(
    func: UserFunction,
    args: RuntimeValue[],
  ): RuntimeValue {
    // 新環境として、フレームをスタックに積む
    const frame: EnvFrame = {
      name: func.name,
      vars: new Map<string, Var>(),
      boundaryTestParams: this.shouldBoundaryTestFunctionParams(func.name),
    };
    this.envFrames.push(frame);
    try {
      // 引数の設定
      for (const [index, param] of func.params.entries()) {
        const value = this.assumeDefined(
          args[index],
          `Internal interpreter error: missing argument ${param.name}`,
        );
        frame.vars.set(param.name, {
          runtimeValue: value,
        });
      }
      // 引数の初期化(実値代入)
      for (const param of func.params) {
        const variable = this.assumeDefined(
          frame.vars.get(param.name),
          `Internal interpreter error: uninitialized argument ${param.name}`,
        );

        const domain =
          param.domain === undefined ? undefined : this.evalParamDomain(param);
        variable.runtimeValue = this.boundaryTestValue(
          param.name,
          this.assumeDefined(
            variable.runtimeValue,
            `Internal interpreter error: uninitialized argument ${param.name}`,
          ),
          frame.boundaryTestParams ? domain : undefined,
        );
        this.assertWithinDomain(
          param.name,
          this.assumeDefined(
            variable.runtimeValue,
            `Internal interpreter error: uninitialized argument ${param.name}`,
          ),
          domain,
        );

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
    const numericValue = value.value as number;
    if (numericValue < domain.min || numericValue > domain.max) {
      this.fail(
        `関数 ${name} の戻り値として定義域 [${String(domain.min)}, ${String(domain.max)}] 外の値 ${String(numericValue)} が返されました`,
      );
    }
  }

  private evalReturnDomain(func: UserFunction): Var["domain"] {
    if (func.returnType.domain === undefined) {
      return undefined;
    }

    const max = func.returnType.domain.max.accept(this);
    const min = func.returnType.domain.min.accept(this);

    return {
      max: max.value as number,
      min: min.value as number,
    };
  }

  private evalParamDomain(param: ParamNode): Var["domain"] {
    if (param.domain === undefined) {
      return undefined;
    }

    const max = param.domain.max.accept(this);
    const min = param.domain.min.accept(this);

    return {
      max: max.value as number,
      min: min.value as number,
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

  private loadArrayElement(name: string, index: RuntimeValue): RuntimeValue {
    const variable = this.assumeDefined(
      this.findVar(name),
      `Internal interpreter error: unresolved variable ${name}`,
    );
    if (variable.arrayLength === undefined) {
      this.fail(`変数 ${name} は配列ではありません`);
    }
    const indexValue = this.arrayIndex(name, index, variable.arrayLength);
    const element = this.assumeDefined(
      this.findVar(`${name}[${String(indexValue)}]`),
      `Internal interpreter error: unresolved variable ${name}[${String(indexValue)}]`,
    );
    return this.assumeDefined(
      element.runtimeValue,
      `Internal interpreter error: uninitialized variable ${name}[${String(indexValue)}]`,
    );
  }

  private arrayIndex(
    name: string,
    index: RuntimeValue,
    length: number,
  ): number {
    if (
      index.type !== "int" ||
      typeof index.value !== "number" ||
      !Number.isInteger(index.value)
    ) {
      this.fail(`配列の添え字には int 型が必要です`);
    }
    const indexValue = index.value;
    if (indexValue < 0 || indexValue >= length) {
      this.fail(
        `配列 ${name} の添え字 ${String(indexValue)} は範囲外です (長さ ${String(length)})`,
      );
    }
    return indexValue;
  }

  private currentEnvFrame(): EnvFrame {
    const frame = this.envFrames.at(-1);
    if (frame === undefined) {
      this.fail("実行環境が存在しません");
    }
    return frame;
  }

  private assumeDefined<T>(value: T | undefined, message: string): T {
    if (value === undefined) {
      this.fail(message);
    }
    return value;
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
