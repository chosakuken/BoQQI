import type { RuntimeValueType } from "../types/valueType.js";

export interface ValuableValue<T> {
  readonly type: RuntimeValueType;
  readonly value: T;
}

export class IntValue implements ValuableValue<number> {
  readonly type: "int";
  readonly value: number;

  constructor(v: number) {
    this.type = "int";
    this.value = v;
  }
}

export class BoolValue implements ValuableValue<boolean> {
  readonly type: "bool";
  readonly value: boolean;

  constructor(v: boolean) {
    this.type = "bool";
    this.value = v;
  }
}

export class FloatValue implements ValuableValue<number> {
  readonly type: "float";
  readonly value: number;

  constructor(v: number) {
    this.type = "float";
    this.value = v;
  }
}

export class StringValue implements ValuableValue<string> {
  readonly type: "string";
  readonly value: string;

  constructor(v: string) {
    this.type = "string";
    this.value = v;
  }
}

export class VoidValue implements ValuableValue<undefined> {
  readonly type: "void";
  readonly value: undefined;

  constructor() {
    this.type = "void";
    this.value = undefined;
  }
}

export type RuntimeValue =
  | IntValue
  | FloatValue
  | BoolValue
  | StringValue
  | VoidValue;

export function createDefaultValue(type: RuntimeValueType): RuntimeValue {
  switch (type) {
    case "int":
      return new IntValue(0);
    case "float":
      return new FloatValue(0.0);
    case "string":
      return new StringValue("");
    case "bool":
      return new BoolValue(false);
    case "void":
      return new VoidValue();
  }
}

export function createNumericValue(
  type: "int" | "float",
  value: number,
): RuntimeValue {
  assertFiniteNumber(value);
  if (type === "int") {
    return new IntValue(Math.floor(value));
  }
  return new FloatValue(value);
}

export function numericResultType(
  left: RuntimeValue,
  right: RuntimeValue,
): "int" | "float" {
  return left.type === "int" && right.type === "int" ? "int" : "float";
}

export function assertFiniteNumber(value: number): void {
  if (!Number.isFinite(value)) {
    throw new Error("計算結果が有限の数値ではありません");
  }
}

export function runtimeValueToString(value: ValuableValue<unknown>): string {
  switch (typeof value.value) {
    case "number":
    case "boolean":
    case "string":
      return String(value.value);
    case "undefined":
      return "undefined";
    default:
      return "";
  }
}
