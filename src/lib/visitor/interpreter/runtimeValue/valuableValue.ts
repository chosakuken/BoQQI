export interface ValuableValue<T> {
  readonly type: string;
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
