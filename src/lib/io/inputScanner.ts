import { readSync } from "node:fs";
import { StringDecoder } from "node:string_decoder";
import type { ScalarValueType } from "../types/valueType.js";
import {
  BoolValue,
  FloatValue,
  IntValue,
  StringValue,
  type RuntimeValue,
} from "../runtime/runtimeValue.js";

export interface InputScannerOptions {
  readonly interactive?: boolean;
  readonly fd?: number;
}

export class InputScanner {
  private readonly tokens: string[];
  private offset = 0;
  private readonly interactive: boolean;
  private readonly fd: number;
  private readonly decoder = new StringDecoder("utf-8");

  constructor(source: string, options: InputScannerOptions = {}) {
    this.tokens = source.match(/\S+/g) ?? [];
    this.interactive = options.interactive === true;
    this.fd = options.fd ?? 0;
  }

  scan(type: ScalarValueType): RuntimeValue {
    if (this.offset >= this.tokens.length) {
      if (!this.interactive) {
        throw new Error("入力が不足しています");
      }
      this.tokens.push(this.readInteractiveToken());
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

  private readInteractiveToken(): string {
    const buffer = Buffer.alloc(1);
    let token = "";
    let started = false;

    for (;;) {
      const bytesRead = this.readByte(buffer);
      if (bytesRead === 0) {
        if (started) {
          return token;
        }
        throw new Error("入力が不足しています");
      }

      const text = this.decoder.write(buffer.subarray(0, bytesRead));
      for (const char of text) {
        if (/\s/u.test(char)) {
          if (started) {
            return token;
          }
          continue;
        }

        token += char;
        started = true;
      }
    }
  }

  private readByte(buffer: Buffer): number {
    for (;;) {
      try {
        return readSync(this.fd, buffer, 0, buffer.length, null);
      } catch (error) {
        if (this.isInputPending(error)) {
          this.waitForInput();
          continue;
        }
        throw error;
      }
    }
  }

  private isInputPending(error: unknown): boolean {
    return (
      error instanceof Error &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code === "EAGAIN"
    );
  }

  private waitForInput(): void {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
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
