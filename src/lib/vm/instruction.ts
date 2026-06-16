import { SourceLocation } from "../diagnostics/sourceLocation.js";

export type ValueType = "int" | "float" | "string" | "bool";

export interface DomainSpec {
  readonly min: number;
  readonly max: number;
}

export type Instruction = {
  readonly location?: SourceLocation;
} & (
  | { readonly op: "PUSH_INT"; readonly value: number }
  | { readonly op: "PUSH_FLOAT"; readonly value: number }
  | { readonly op: "PUSH_STRING"; readonly value: string }
  | { readonly op: "PUSH_BOOL"; readonly value: boolean }
  | { readonly op: "LOAD"; readonly name: string }
  | { readonly op: "STORE"; readonly name: string }
  | {
      readonly op: "DECLARE";
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
  | { readonly op: "POP" }
);
