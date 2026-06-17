import { SourceLocation } from "../diagnostics/sourceLocation.js";

export type ValueType = "int" | "float" | "string" | "bool";

export interface DomainSpec {
  readonly min: number;
  readonly max: number;
}

export interface LocalInfo {
  readonly name: string;
  readonly type: ValueType;
}

export interface ParamInfo extends LocalInfo {
  readonly slot: number;
  readonly hasDomain: boolean;
}

export interface CompiledFunction {
  readonly name: string;
  readonly entryPc: number;
  readonly arity: number;
  readonly localCount: number;
  readonly params: ParamInfo[];
  readonly returnType: ValueType;
  readonly hasReturnDomain: boolean;
}

export interface BytecodeProgram {
  readonly instructions: Instruction[];
  readonly functions: Map<string, CompiledFunction>;
  readonly globalLocalCount: number;
}

export type LocalScope = "local" | "global";

export type Instruction = {
  readonly location?: SourceLocation;
} & (
  | { readonly op: "PUSH_INT"; readonly value: number }
  | { readonly op: "PUSH_FLOAT"; readonly value: number }
  | { readonly op: "PUSH_STRING"; readonly value: string }
  | { readonly op: "PUSH_BOOL"; readonly value: boolean }
  | {
      readonly op: "LOAD";
      readonly slot: number;
      readonly name: string;
      readonly scope: LocalScope;
    }
  | {
      readonly op: "STORE";
      readonly slot: number;
      readonly name: string;
      readonly scope: LocalScope;
    }
  | {
      readonly op: "DECLARE";
      readonly slot: number;
      readonly name: string;
      readonly type: ValueType;
      readonly hasDomain: boolean;
    }
  | {
      readonly op: "CHECK_LOCAL";
      readonly slot: number;
      readonly name: string;
      readonly type: ValueType;
      readonly hasDomain: boolean;
    }
  | { readonly op: "ADD" }
  | { readonly op: "SUB" }
  | { readonly op: "MUL" }
  | { readonly op: "DIV" }
  | { readonly op: "EQ" }
  | { readonly op: "NE" }
  | { readonly op: "GT" }
  | { readonly op: "LT" }
  | { readonly op: "GE" }
  | { readonly op: "LE" }
  | { readonly op: "JUMP"; readonly target: number }
  | { readonly op: "JUMP_IF_FALSE"; readonly target: number }
  | { readonly op: "CALL"; readonly name: string; readonly argc: number }
  | { readonly op: "RETURN" }
  | { readonly op: "POP" }
);
