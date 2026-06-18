import { BytecodeProgram, CompiledFunction } from "./instruction.js";

export interface BytecodeProgramJson {
  readonly instructions: BytecodeProgram["instructions"];
  readonly functions: CompiledFunction[];
  readonly globalLocalCount: number;
}

export function bytecodeToJson(program: BytecodeProgram): BytecodeProgramJson {
  return {
    instructions: program.instructions,
    functions: Array.from(program.functions.values()),
    globalLocalCount: program.globalLocalCount,
  };
}

export function bytecodeFromJson(value: unknown): BytecodeProgram {
  if (!isRecord(value)) {
    throw new Error("bytecode JSON must be an object");
  }

  const instructions = value.instructions;
  const functions = value.functions;
  const globalLocalCount = value.globalLocalCount;

  if (!Array.isArray(instructions)) {
    throw new Error("bytecode JSON instructions must be an array");
  }
  if (!Array.isArray(functions)) {
    throw new Error("bytecode JSON functions must be an array");
  }
  if (
    typeof globalLocalCount !== "number" ||
    !Number.isInteger(globalLocalCount) ||
    globalLocalCount < 0
  ) {
    throw new Error(
      "bytecode JSON globalLocalCount must be a non-negative integer",
    );
  }

  return {
    instructions: instructions as BytecodeProgram["instructions"],
    functions: new Map(
      functions.map((func) => {
        if (!isCompiledFunction(func)) {
          throw new Error(
            "bytecode JSON functions contains an invalid function",
          );
        }
        return [func.name, func];
      }),
    ),
    globalLocalCount,
  };
}

function isCompiledFunction(value: unknown): value is CompiledFunction {
  return (
    isRecord(value) &&
    typeof value.name === "string" &&
    Number.isInteger(value.entryPc) &&
    Number.isInteger(value.arity) &&
    Number.isInteger(value.localCount) &&
    Array.isArray(value.params) &&
    typeof value.returnType === "string" &&
    typeof value.hasReturnDomain === "boolean"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
