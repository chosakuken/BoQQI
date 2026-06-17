import type { ValueType } from "../../vm/instruction.js";

export type SemanticType = ValueType;

export interface VariableSymbol {
  readonly name: string;
  readonly type: SemanticType;
}

export interface FunctionSymbol {
  readonly name: string;
  readonly params: readonly VariableSymbol[];
  readonly returnType: SemanticType;
}

export interface SemanticScope {
  readonly name: string;
  readonly variables: Map<string, VariableSymbol>;
}

export interface SemanticResult {
  readonly globals: Map<string, VariableSymbol>;
  readonly functions: Map<string, FunctionSymbol>;
}
