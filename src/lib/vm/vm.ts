import { BoqqiRuntimeError } from "../diagnostics/runtimeError.js";
import { SourceFrame } from "../diagnostics/sourceLocation.js";
import { InputScanner } from "../io/inputScanner.js";
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
} from "../runtime/runtimeValue.js";
import type { ScalarValueType, ValueType } from "../types/valueType.js";
import {
  BytecodeProgram,
  DomainSpec,
  Instruction,
  LocalScope,
} from "./instruction.js";

interface LocalSlot {
  name?: string;
  type?: ValueType;
  domain?: DomainSpec;
  runtimeValue?: RuntimeValue;
}

interface CallFrame {
  readonly functionName: string;
  readonly returnPc: number;
  readonly locals: LocalSlot[];
  readonly returnType: ValueType;
  readonly hasReturnDomain: boolean;
  readonly boundaryTestParams: boolean;
}

export type BoqqiVMExecutionMode = "normal" | "max-test" | "min-test";

export interface BoqqiVMOptions {
  readonly mode?: BoqqiVMExecutionMode;
  readonly boundaryTestLog?: (text: string) => void;
}

export class BoqqiVM {
  private pc = 0;
  private readonly stack: RuntimeValue[] = []; // スタックマシン
  private readonly frames: CallFrame[] = []; // 変数表
  private readonly input: InputScanner;
  private readonly mode: BoqqiVMExecutionMode;
  private readonly boundaryTestLog?: (text: string) => void;
  private readonly boundaryTestedFunctions = new Set<string>();
  private currentInstruction?: Instruction;
  private didRunFunctionBoundaryTests = false;

  constructor(
    private readonly program: BytecodeProgram,
    private readonly output: (text: string) => void,
    inputSource = "",
    options: BoqqiVMOptions = {},
  ) {
    this.input = new InputScanner(inputSource);
    this.mode = options.mode ?? "normal";
    this.boundaryTestLog = options.boundaryTestLog;
    this.frames.push({
      functionName: "global",
      returnPc: -1,
      locals: this.createLocalSlots(program.globalLocalCount),
      returnType: "int",
      hasReturnDomain: false,
      boundaryTestParams: false,
    });
  }

  run(): RuntimeValue {
    if (this.isBoundaryTestMode() && !this.didRunFunctionBoundaryTests) {
      this.runFunctionBoundaryTests();
      this.boundaryTestLog?.("test of main:");
    }

    while (this.pc < this.program.instructions.length) {
      const instruction = this.program.instructions[this.pc];

      this.pc += 1;
      this.currentInstruction = instruction;
      try {
        this.execute(instruction);
      } catch (error) {
        if (error instanceof BoqqiRuntimeError) {
          throw error;
        }

        const message = error instanceof Error ? error.message : String(error);
        this.fail(message);
      } finally {
        this.currentInstruction = undefined;
      }
    }

    return new IntValue(0);
  }

  private runFunctionBoundaryTests(): void {
    this.didRunFunctionBoundaryTests = true;

    for (const func of this.program.functions.values()) {
      this.boundaryTestLog?.(`test of ${func.name}():`);
      this.runFunctionBoundaryTest(func.name, func.params);
    }
  }

  private runFunctionBoundaryTest(
    name: string,
    params: readonly { readonly type: ValueType }[],
  ): void {
    const savedPc = this.pc;
    const savedStackLength = this.stack.length;
    const savedGlobalLocals = this.frames[0].locals.map((local) => ({
      ...local,
    }));

    this.pc = -1;
    for (const param of params) {
      this.stack.push(this.defaultValueForBoundaryTest(param.type));
    }
    this.call(name, params.length);

    while (this.frames.length > 1) {
      if (this.pc < 0 || this.pc >= this.program.instructions.length) {
        this.fail(
          `関数 ${name} の境界値テスト中に不正な命令位置へ移動しました`,
        );
      }

      const instruction = this.program.instructions[this.pc];
      this.pc += 1;
      this.currentInstruction = instruction;
      try {
        this.execute(instruction);
      } catch (error) {
        if (error instanceof BoqqiRuntimeError) {
          throw error;
        }

        const message = error instanceof Error ? error.message : String(error);
        this.fail(message);
      } finally {
        this.currentInstruction = undefined;
      }
    }

    this.stack.length = savedStackLength;
    this.frames[0].locals.splice(
      0,
      this.frames[0].locals.length,
      ...savedGlobalLocals,
    );
    this.pc = savedPc;
  }

  private defaultValueForBoundaryTest(type: ValueType): RuntimeValue {
    if (
      type === "int" ||
      type === "float" ||
      type === "string" ||
      type === "bool" ||
      type === "void"
    ) {
      return createDefaultValue(type);
    }
    this.fail(`関数テスト用の引数型 ${type} は未対応です`);
  }

  private execute(instruction: Instruction): void {
    switch (instruction.op) {
      case "PUSH_INT":
        this.stack.push(new IntValue(instruction.value));
        break;
      case "PUSH_FLOAT":
        this.stack.push(new FloatValue(instruction.value));
        break;
      case "PUSH_STRING":
        this.stack.push(new StringValue(instruction.value));
        break;
      case "PUSH_BOOL":
        this.stack.push(new BoolValue(instruction.value));
        break;
      case "PUSH_VOID":
        this.stack.push(new VoidValue());
        break;
      case "LOAD":
        this.stack.push(
          this.loadLocal(instruction.scope, instruction.slot, instruction.name),
        );
        break;
      case "STORE":
        this.storeLocal(
          instruction.scope,
          instruction.slot,
          instruction.name,
          this.pop(),
        );
        break;
      case "DECLARE":
        this.declareLocal(
          instruction.slot,
          instruction.name,
          instruction.type,
          this.pop(),
          this.popDomain(instruction.name, instruction.hasDomain),
        );
        break;
      case "DECLARE_ARRAY":
        this.declareArrayLocal(
          instruction.slot,
          instruction.name,
          instruction.elementType,
          instruction.length,
          this.popArrayValues(instruction.name, instruction.length),
          this.popDomain(instruction.name, instruction.hasDomain),
        );
        break;
      case "CHECK_LOCAL":
        this.checkLocal(
          instruction.slot,
          instruction.name,
          instruction.type,
          this.popDomain(instruction.name, instruction.hasDomain),
        );
        break;
      case "ADD":
      case "SUB":
      case "MUL":
      case "DIV":
      case "MOD":
        this.executeBinary(instruction.op);
        break;
      case "EQ":
      case "NE":
      case "GT":
      case "LT":
      case "GE":
      case "LE":
        this.executeCompare(instruction.op);
        break;
      case "LOAD_INDEX":
        this.executeLoadIndex(
          instruction.scope,
          instruction.slot,
          instruction.name,
          instruction.length,
        );
        break;
      case "STORE_INDEX":
        this.executeStoreIndex(
          instruction.scope,
          instruction.slot,
          instruction.name,
          instruction.length,
        );
        break;
      case "JUMP":
        this.jump(instruction.target);
        break;
      case "JUMP_IF_FALSE":
        this.jumpIfFalse(instruction.target);
        break;
      case "WRITE":
        this.write(instruction.newline);
        break;
      case "SCAN":
        this.stack.push(this.input.scan(instruction.valueType));
        break;
      case "CALL":
        this.call(instruction.name, instruction.argc);
        break;
      case "RETURN":
        this.returnFromFunction();
        break;
      case "POP":
        this.pop();
        break;
    }
  }

  private executeBinary(op: "ADD" | "SUB" | "MUL" | "DIV" | "MOD"): void {
    const right = this.pop();
    const left = this.pop();
    const leftValue = Number(left.value);
    const rightValue = Number(right.value);

    switch (op) {
      case "ADD":
        this.stack.push(
          createNumericValue(
            numericResultType(left, right),
            leftValue + rightValue,
          ),
        );
        break;
      case "SUB":
        this.stack.push(
          createNumericValue(
            numericResultType(left, right),
            leftValue - rightValue,
          ),
        );
        break;
      case "MUL":
        this.stack.push(
          createNumericValue(
            numericResultType(left, right),
            leftValue * rightValue,
          ),
        );
        break;
      case "DIV":
        if (rightValue === 0) {
          this.fail("0 除算が検出されました");
        }
        this.stack.push(
          createNumericValue(
            numericResultType(left, right),
            leftValue / rightValue,
          ),
        );
        break;
      case "MOD":
        if (rightValue === 0) {
          this.fail("0 除算が検出されました");
        }
        this.stack.push(
          createNumericValue(
            numericResultType(left, right),
            leftValue % rightValue,
          ),
        );
        break;
    }
  }

  private executeCompare(op: "EQ" | "NE" | "GT" | "LT" | "GE" | "LE"): void {
    const right = this.pop();
    const left = this.pop();
    const leftValue = left.value ?? false;
    const rightValue = right.value ?? false;

    switch (op) {
      case "EQ":
        this.stack.push(new BoolValue(leftValue == rightValue));
        break;
      case "NE":
        this.stack.push(new BoolValue(leftValue != rightValue));
        break;
      case "GT":
        this.stack.push(new BoolValue(leftValue > rightValue));
        break;
      case "LT":
        this.stack.push(new BoolValue(leftValue < rightValue));
        break;
      case "GE":
        this.stack.push(new BoolValue(leftValue >= rightValue));
        break;
      case "LE":
        this.stack.push(new BoolValue(leftValue <= rightValue));
        break;
    }
  }

  private executeLoadIndex(
    scope: LocalScope,
    slot: number,
    name: string,
    length: number,
  ): void {
    const index = this.pop();
    const indexValue = this.indexValue(name, index, length);
    const local = this.localSlot(
      this.frameForScope(scope),
      slot + indexValue,
      `${name}[${String(indexValue)}]`,
    );
    this.stack.push(
      this.assumeDefined(
        local.runtimeValue,
        `Internal VM error: uninitialized local ${name}[${String(indexValue)}]`,
      ),
    );
  }

  private executeStoreIndex(
    scope: LocalScope,
    slot: number,
    name: string,
    length: number,
  ): void {
    const value = this.pop();
    const index = this.pop();
    const indexValue = this.indexValue(name, index, length);
    const local = this.localSlot(
      this.frameForScope(scope),
      slot + indexValue,
      `${name}[${String(indexValue)}]`,
    );
    const elementName = `${name}[${String(indexValue)}]`;

    this.assertWithinDomain(elementName, value, local.domain);
    local.runtimeValue = value;
  }

  private declareLocal(
    slot: number,
    name: string,
    type: ValueType,
    value: RuntimeValue,
    domain: DomainSpec | undefined,
  ): void {
    const local = this.localSlot(this.currentFrame(), slot, name);

    this.assertWithinDomain(name, value, domain);
    local.name = name;
    local.type = type;
    local.domain = domain;
    local.runtimeValue = this.boundaryTestValue(name, value, domain);
  }

  private declareArrayLocal(
    slot: number,
    name: string,
    elementType: ScalarValueType,
    length: number,
    values: RuntimeValue[],
    domain: DomainSpec | undefined,
  ): void {
    if (!Number.isInteger(length) || length < 0) {
      this.fail(`配列 ${name} の長さ ${String(length)} は不正です`);
    }

    const frame = this.currentFrame();
    for (let index = 0; index < length; index += 1) {
      const elementName = `${name}[${String(index)}]`;
      const value = this.assumeDefined(
        values[index],
        `Internal VM error: missing initial value ${elementName}`,
      );
      const local = this.localSlot(frame, slot + index, elementName);

      this.assertWithinDomain(elementName, value, domain);
      local.name = elementName;
      local.type = elementType;
      local.domain = domain;
      local.runtimeValue = this.boundaryTestValue(elementName, value, domain);
    }
  }

  private checkLocal(
    slot: number,
    name: string,
    type: ValueType,
    domain: DomainSpec | undefined,
  ): void {
    const local = this.localSlot(this.currentFrame(), slot, name);
    let value = this.assumeDefined(
      local.runtimeValue,
      `Internal VM error: uninitialized local ${name}`,
    );

    if (this.currentFrame().boundaryTestParams) {
      value = this.boundaryTestValue(name, value, domain);
    }
    this.assertWithinDomain(name, value, domain);
    local.name = name;
    local.type = type;
    local.domain = domain;
    local.runtimeValue = value;
  }

  private storeLocal(
    scope: LocalScope,
    slot: number,
    name: string,
    value: RuntimeValue,
  ): void {
    const local = this.localSlot(this.frameForScope(scope), slot, name);

    this.assertWithinDomain(name, value, local.domain);
    local.runtimeValue = value;
  }

  private loadLocal(
    scope: LocalScope,
    slot: number,
    name: string,
  ): RuntimeValue {
    const local = this.localSlot(this.frameForScope(scope), slot, name);
    return this.assumeDefined(
      local.runtimeValue,
      `Internal VM error: uninitialized local ${name}`,
    );
  }

  private jump(target: number): void {
    this.assertValidJumpTarget(target);
    this.pc = target;
  }

  private jumpIfFalse(target: number): void {
    const cond = this.pop();
    if (cond.value !== true) {
      this.jump(target);
    }
  }

  private write(newline: boolean): void {
    const suffix = newline ? "\n" : "";
    this.output(`${runtimeValueToString(this.pop())}${suffix}`);
  }

  private call(name: string, argc: number): void {
    const args = this.stack.splice(this.stack.length - argc, argc);
    if (args.length !== argc) {
      this.fail(`関数 ${name} の引数が不足しています`);
    }

    const func = this.assumeDefined(
      this.program.functions.get(name),
      `Internal VM error: unresolved function ${name}`,
    );

    const locals = this.createLocalSlots(func.localCount);
    for (const [index, param] of func.params.entries()) {
      locals[param.slot] = {
        name: param.name,
        type: param.type,
        runtimeValue: args[index],
      };
    }

    this.frames.push({
      functionName: name,
      returnPc: this.pc,
      locals,
      returnType: func.returnType,
      hasReturnDomain: func.hasReturnDomain,
      boundaryTestParams: this.shouldBoundaryTestFunctionParams(name),
    });
    this.jump(func.entryPc);
  }

  private returnFromFunction(): void {
    const currentFrame = this.currentFrame();
    const domain = this.popDomain(
      currentFrame.functionName,
      currentFrame.hasReturnDomain,
    );
    const value = this.pop();
    this.assertReturnWithinDomain(currentFrame.functionName, value, domain);

    const frame = this.frames.pop();
    if (frame === undefined) {
      this.fail("関数フレームが存在しません");
    }

    this.pc = frame.returnPc;
    this.stack.push(value);
  }

  private pop(): RuntimeValue {
    const value = this.stack.pop();
    if (value === undefined) {
      this.fail("スタックが空です");
    }

    return value;
  }

  private popDomain(name: string, hasDomain: boolean): DomainSpec | undefined {
    if (!hasDomain) {
      return undefined;
    }

    const min = this.pop();
    const max = this.pop();

    return {
      max: max.value as number,
      min: min.value as number,
    };
  }

  private popArrayValues(name: string, length: number): RuntimeValue[] {
    if (!Number.isInteger(length) || length < 0) {
      this.fail(`配列 ${name} の長さ ${String(length)} は不正です`);
    }

    const values = this.stack.splice(this.stack.length - length, length);
    if (values.length !== length) {
      this.fail(`配列 ${name} の初期値が不足しています`);
    }
    return values;
  }

  private boundaryTestValue(
    name: string,
    value: RuntimeValue,
    domain: DomainSpec | undefined,
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

  private assertWithinDomain(
    name: string,
    value: RuntimeValue,
    domain: DomainSpec | undefined,
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

  private assertReturnWithinDomain(
    name: string,
    value: RuntimeValue,
    domain: DomainSpec | undefined,
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

  private assertValidJumpTarget(target: number): void {
    if (
      !Number.isInteger(target) ||
      target < 0 ||
      target > this.program.instructions.length
    ) {
      this.fail(`ジャンプ先 ${String(target)} は不正です`);
    }
  }

  private indexValue(
    name: string,
    index: RuntimeValue,
    length: number,
  ): number {
    if (
      index.type !== "int" ||
      typeof index.value !== "number" ||
      !Number.isInteger(index.value)
    ) {
      this.fail("配列の添え字には int 型が必要です");
    }

    const indexValue = index.value;
    if (indexValue < 0 || indexValue >= length) {
      this.fail(
        `配列 ${name} の添え字 ${String(indexValue)} は範囲外です (長さ ${String(length)})`,
      );
    }
    return indexValue;
  }

  private frameForScope(scope: LocalScope): CallFrame {
    if (scope === "global") {
      return this.frames[0];
    }

    return this.currentFrame();
  }

  private currentFrame(): CallFrame {
    return this.frames[this.frames.length - 1];
  }

  private assumeDefined<T>(value: T | undefined, message: string): T {
    if (value === undefined) {
      this.fail(message);
    }
    return value;
  }

  private localSlot(frame: CallFrame, slot: number, name: string): LocalSlot {
    if (!Number.isInteger(slot) || slot < 0 || slot >= frame.locals.length) {
      this.fail(`変数 ${name} の slot ${String(slot)} は不正です`);
    }
    return frame.locals[slot];
  }

  private createLocalSlots(count: number): LocalSlot[] {
    return Array.from({ length: count }, () => ({}));
  }

  private fail(message: string): never {
    const frame: SourceFrame = {
      label:
        this.currentInstruction === undefined
          ? "vm"
          : `vm ${this.currentInstruction.op}`,
      location: this.currentInstruction?.location,
    };

    throw new BoqqiRuntimeError(message, [frame]);
  }
}
