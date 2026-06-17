import { BoqqiRuntimeError } from "../diagnostics/runtimeError.js";
import { SourceFrame } from "../diagnostics/sourceLocation.js";
import {
  BoolValue,
  FloatValue,
  IntValue,
  StringValue,
} from "../visitor/interpreter/runtimeValue/valuableValue.js";
import { RuntimeValue } from "../visitor/interpreter/runtimeValue/runtimeValue.js";
import {
  BytecodeProgram,
  DomainSpec,
  Instruction,
  LocalScope,
  ValueType,
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
}

type BuiltinFunc = (args: RuntimeValue[]) => RuntimeValue;

export class BoqqiVM {
  private pc = 0;
  private readonly stack: RuntimeValue[] = [];
  private readonly frames: CallFrame[] = [];
  private readonly funcs = new Map<string, BuiltinFunc>();
  private currentInstruction?: Instruction;

  constructor(
    private readonly program: BytecodeProgram,
    private readonly output: (text: string) => void,
  ) {
    this.frames.push({
      functionName: "global",
      returnPc: -1,
      locals: this.createLocalSlots(program.globalLocalCount),
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
      case "LOAD_LOCAL":
        this.stack.push(
          this.loadLocal(instruction.scope, instruction.slot, instruction.name),
        );
        break;
      case "STORE_LOCAL":
        this.storeLocal(
          instruction.scope,
          instruction.slot,
          instruction.name,
          this.pop(),
        );
        break;
      case "DECLARE_LOCAL":
        this.declareLocal(
          instruction.slot,
          instruction.name,
          instruction.type,
          this.pop(),
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
      case "LOAD":
      case "STORE":
      case "DECLARE":
        this.fail(`命令 ${instruction.op} は現在の VM では使用されません`);
        break;
      case "ADD":
      case "SUB":
      case "MUL":
      case "DIV":
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

  private executeBinary(op: "ADD" | "SUB" | "MUL" | "DIV"): void {
    const right = this.pop();
    const left = this.pop();

    if (typeof left.value !== "number") {
      this.fail("式の左辺には数値を入力しなければなりません");
    }
    if (typeof right.value !== "number") {
      this.fail("式の右辺には数値を入力しなければなりません");
    }

    switch (op) {
      case "ADD":
        this.stack.push(
          this.numberToRuntimeValue(
            this.numericResultType(left, right),
            left.value + right.value,
          ),
        );
        break;
      case "SUB":
        this.stack.push(
          this.numberToRuntimeValue(
            this.numericResultType(left, right),
            left.value - right.value,
          ),
        );
        break;
      case "MUL":
        this.stack.push(
          this.numberToRuntimeValue(
            this.numericResultType(left, right),
            left.value * right.value,
          ),
        );
        break;
      case "DIV":
        if (right.value === 0) {
          this.fail("0 除算が検出されました");
        }
        this.stack.push(
          this.numberToRuntimeValue(
            this.numericResultType(left, right),
            left.value / right.value,
          ),
        );
        break;
    }
  }

  private executeCompare(op: "EQ" | "NE" | "GT" | "LT" | "GE" | "LE"): void {
    const right = this.pop();
    const left = this.pop();

    switch (op) {
      case "EQ":
        this.stack.push(new BoolValue(left.value == right.value));
        break;
      case "NE":
        this.stack.push(new BoolValue(left.value != right.value));
        break;
      case "GT":
        this.stack.push(new BoolValue(left.value > right.value));
        break;
      case "LT":
        this.stack.push(new BoolValue(left.value < right.value));
        break;
      case "GE":
        this.stack.push(new BoolValue(left.value >= right.value));
        break;
      case "LE":
        this.stack.push(new BoolValue(left.value <= right.value));
        break;
    }
  }

  private declareLocal(
    slot: number,
    name: string,
    type: ValueType,
    value: RuntimeValue,
    domain: DomainSpec | undefined,
  ): void {
    const local = this.localSlot(this.currentFrame(), slot, name);

    if (local.runtimeValue !== undefined) {
      this.fail(`変数 ${name} は既に宣言済みです`);
    }
    if (value.type !== type) {
      this.fail(
        `変数 ${name} は ${type} 型ですが、${value.type} 型で初期化されようとしました`,
      );
    }

    this.assertWithinDomain(name, value, domain);
    local.name = name;
    local.type = type;
    local.domain = domain;
    local.runtimeValue = value;
  }

  private checkLocal(
    slot: number,
    name: string,
    type: ValueType,
    domain: DomainSpec | undefined,
  ): void {
    const local = this.localSlot(this.currentFrame(), slot, name);
    const value = local.runtimeValue;

    if (value === undefined) {
      this.fail(`変数 ${name} は未定義です`);
    }
    if (value.type !== type) {
      this.fail(
        `変数 ${name} は ${type} 型ですが、${value.type} 型が渡されました`,
      );
    }

    this.assertWithinDomain(name, value, domain);
    local.name = name;
    local.type = type;
    local.domain = domain;
  }

  private storeLocal(
    scope: LocalScope,
    slot: number,
    name: string,
    value: RuntimeValue,
  ): void {
    const local = this.localSlot(this.frameForScope(scope), slot, name);

    if (local.runtimeValue === undefined || local.type === undefined) {
      this.fail(`変数 ${name} は宣言されていません`);
    }
    if (value.type !== local.type) {
      this.fail(
        `変数 ${name} は ${local.type} 型ですが、${value.type} 型が代入されようとしました`,
      );
    }

    this.assertWithinDomain(name, value, local.domain);
    local.runtimeValue = value;
  }

  private loadLocal(
    scope: LocalScope,
    slot: number,
    name: string,
  ): RuntimeValue {
    const local = this.localSlot(this.frameForScope(scope), slot, name);
    const value = local.runtimeValue;

    if (value === undefined) {
      this.fail(`変数 ${name} は未定義です`);
    }

    return value;
  }

  private jump(target: number): void {
    this.assertValidJumpTarget(target);
    this.pc = target;
  }

  private jumpIfFalse(target: number): void {
    const cond = this.pop();

    if (typeof cond.value !== "boolean") {
      this.fail("if 文の条件式には真偽値を入力しなければなりません");
    }

    if (!cond.value) {
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

    const func = this.program.functions.get(name);
    if (func === undefined) {
      this.fail(`関数 ${name} は未定義です`);
    }
    if (func.arity !== argc) {
      this.fail(
        `関数 ${name} は ${String(func.arity)} 個の引数を取りますが、${String(argc)} 個渡されました`,
      );
    }

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
    });
    this.jump(func.entryPc);
  }

  private returnFromFunction(): void {
    if (this.frames.length <= 1) {
      this.fail("return 文は関数の中でのみ使用できます");
    }

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

  private popDomain(name: string, hasDomain: boolean): DomainSpec | undefined {
    if (!hasDomain) {
      return undefined;
    }

    const min = this.pop();
    const max = this.pop();

    if (typeof max.value !== "number" || typeof min.value !== "number") {
      this.fail(`変数 ${name} の定義域には数値を指定してください`);
    }

    return {
      max: max.value,
      min: min.value,
    };
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

  private assertWithinDomain(
    name: string,
    value: RuntimeValue,
    domain: DomainSpec | undefined,
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
