import { BoqqiRuntimeError } from "../diagnostics/runtimeError.js";
import { SourceFrame } from "../diagnostics/sourceLocation.js";
import {
  BoolValue,
  FloatValue,
  IntValue,
  StringValue,
  VoidValue,
} from "../visitor/interpreter/runtimeValue/valuableValue.js";
import { RuntimeValue } from "../visitor/interpreter/runtimeValue/runtimeValue.js";
import {
  BytecodeProgram,
  Instruction,
  LocalScope,
  ValueType,
} from "./instruction.js";

interface CallFrame {
  readonly functionName: string;
  readonly returnPc: number;
  readonly locals: RuntimeValue[];
  readonly returnType: ValueType;
}

type BuiltinFunc = (args: RuntimeValue[]) => RuntimeValue;

export class BoqqiVM {
  private pc = 0;
  private readonly stack: RuntimeValue[] = []; // スタックマシン
  private readonly frames: CallFrame[] = []; // 変数表
  private readonly funcs = new Map<string, BuiltinFunc>(); // 関数表
  private currentInstruction?: Instruction;

  constructor(
    private readonly program: BytecodeProgram,
    private readonly output: (text: string) => void,
  ) {
    this.frames.push({
      functionName: "global",
      returnPc: -1,
      locals: this.createLocalSlots(program.globalLocalCount),
      returnType: "int",
    });

    this.funcs.set("print", (args: RuntimeValue[]) => {
      for (const arg of args) {
        this.output(`${String(arg.value)}\n`);
      }
      return new IntValue(0);
    });
  }

  run(): RuntimeValue {
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
        this.declareLocal(instruction.slot, instruction.name, this.pop());
        break;
      case "ASSERT_DOMAIN":
        this.assertDomain(instruction.name, instruction.kind);
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
      case "JUMP":
        this.jump(instruction.target);
        break;
      case "JUMP_IF_FALSE":
        this.jumpIfFalse(instruction.target);
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
          this.numberToRuntimeValue(
            this.numericResultType(left, right),
            leftValue + rightValue,
          ),
        );
        break;
      case "SUB":
        this.stack.push(
          this.numberToRuntimeValue(
            this.numericResultType(left, right),
            leftValue - rightValue,
          ),
        );
        break;
      case "MUL":
        this.stack.push(
          this.numberToRuntimeValue(
            this.numericResultType(left, right),
            leftValue * rightValue,
          ),
        );
        break;
      case "DIV":
        if (rightValue === 0) {
          this.fail("0 除算が検出されました");
        }
        this.stack.push(
          this.numberToRuntimeValue(
            this.numericResultType(left, right),
            leftValue / rightValue,
          ),
        );
        break;
      case "MOD":
        if (rightValue === 0) {
          this.fail("0 除算が検出されました");
        }
        this.stack.push(
          this.numberToRuntimeValue(
            this.numericResultType(left, right),
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

  private declareLocal(slot: number, name: string, value: RuntimeValue): void {
    this.setLocal(this.currentFrame(), slot, name, value);
  }

  private storeLocal(
    scope: LocalScope,
    slot: number,
    name: string,
    value: RuntimeValue,
  ): void {
    this.setLocal(this.frameForScope(scope), slot, name, value);
  }

  private loadLocal(
    scope: LocalScope,
    slot: number,
    name: string,
  ): RuntimeValue {
    return this.localSlot(this.frameForScope(scope), slot, name);
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

  private call(name: string, argc: number): void {
    const args = this.stack.splice(this.stack.length - argc, argc);
    if (args.length !== argc) {
      this.fail(`関数 ${name} の引数が不足しています`);
    }

    const builtin = this.funcs.get(name);
    if (builtin !== undefined) {
      this.stack.push(builtin(args));
      return;
    }

    const func = this.assumeDefined(
      this.program.functions.get(name),
      `Internal VM error: unresolved function ${name}`,
    );

    const locals = this.createLocalSlots(func.localCount);
    for (const [index, param] of func.params.entries()) {
      locals[param.slot] = args[index];
    }

    this.frames.push({
      functionName: name,
      returnPc: this.pc,
      locals,
      returnType: func.returnType,
    });
    this.jump(func.entryPc);
  }

  private returnFromFunction(): void {
    const value = this.pop();

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

  private assertDomain(
    name: string,
    kind: "variable" | "parameter" | "return",
  ): void {
    const min = this.pop();
    const max = this.pop();
    const value = this.pop();
    const numericValue = value.value as number;
    const minValue = min.value as number;
    const maxValue = max.value as number;

    if (numericValue < minValue || numericValue > maxValue) {
      this.failDomain(name, kind, numericValue, minValue, maxValue);
    }

    this.stack.push(value);
  }

  private numericResultType(
    left: RuntimeValue,
    right: RuntimeValue,
  ): ValueType {
    return left.type === "int" && right.type === "int" ? "int" : "float";
  }

  private numberToRuntimeValue(type: ValueType, value: number): RuntimeValue {
    if (!Number.isFinite(value)) {
      this.fail("計算結果が有限の数値ではありません");
    }
    if (type === "int") {
      return new IntValue(Math.floor(value));
    }
    return new FloatValue(value);
  }

  private failDomain(
    name: string,
    kind: "variable" | "parameter" | "return",
    value: number,
    min: number,
    max: number,
  ): void {
    switch (kind) {
      case "variable":
        return this.fail(
          `変数 ${name} に定義域 [${String(min)}, ${String(max)}] 外の値 ${String(value)} が代入されようとしました`,
        );
      case "parameter":
        return this.fail(
          `引数 ${name} に定義域 [${String(min)}, ${String(max)}] 外の値 ${String(value)} が渡されました`,
        );
      case "return":
        return this.fail(
          `関数 ${name} の戻り値として定義域 [${String(min)}, ${String(max)}] 外の値 ${String(value)} が返されました`,
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

  private localSlot(
    frame: CallFrame,
    slot: number,
    name: string,
  ): RuntimeValue {
    if (!Number.isInteger(slot) || slot < 0 || slot >= frame.locals.length) {
      this.fail(`変数 ${name} の slot ${String(slot)} は不正です`);
    }
    return this.assumeDefined(
      frame.locals[slot],
      `Internal VM error: uninitialized local ${name}`,
    );
  }

  private setLocal(
    frame: CallFrame,
    slot: number,
    name: string,
    value: RuntimeValue,
  ): void {
    if (!Number.isInteger(slot) || slot < 0 || slot >= frame.locals.length) {
      this.fail(`変数 ${name} の slot ${String(slot)} は不正です`);
    }
    frame.locals[slot] = value;
  }

  private createLocalSlots(count: number): RuntimeValue[] {
    return new Array<RuntimeValue>(count);
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
