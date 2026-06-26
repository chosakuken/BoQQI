import type { ScalarValueType } from "../vm/instruction.js";
import {
  BoolValue,
  FloatValue,
  IntValue,
  StringValue,
} from "../visitor/interpreter/runtimeValue/valuableValue.js";
import type { RuntimeValue } from "../visitor/interpreter/runtimeValue/runtimeValue.js";

export class InputScanner {
  private readonly tokens: string[];
  private offset = 0;

  constructor(source: string) {
    this.tokens = source.match(/\S+/g) ?? [];
  }

  scan(type: ScalarValueType): RuntimeValue {
    if (this.offset >= this.tokens.length) {
      throw new Error("入力が不足しています");
    }

    const token = this.tokens[this.offset];
    this.offset += 1;

    switch (type) {
      case "int":
        return new IntValue(this.parseIntToken(token));
      case "float":
        return new FloatValue(this.parseFloatToken(token));
      case "string":
        return new StringValue(token);
      case "bool":
        return new BoolValue(this.parseBoolToken(token));
    }
  }

  private parseIntToken(token: string): number {
    if (!/^[+-]?\d+$/.test(token)) {
      throw new Error(`入力 ${token} は int として読めません`);
    }

    const value = Number(token);
    if (!Number.isSafeInteger(value)) {
      throw new Error(`入力 ${token} は int の範囲外です`);
    }
    return value;
  }

  private parseFloatToken(token: string): number {
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(token)) {
      throw new Error(`入力 ${token} は float として読めません`);
    }

    const value = Number(token);
    if (!Number.isFinite(value)) {
      throw new Error(`入力 ${token} は float の範囲外です`);
    }
    return value;
  }

  private parseBoolToken(token: string): boolean {
    if (token === "true") {
      return true;
    }
    if (token === "false") {
      return false;
    }
    throw new Error(`入力 ${token} は bool として読めません`);
  }
}
