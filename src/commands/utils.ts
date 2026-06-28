import { readFile } from "node:fs/promises";
import process from "node:process";
import { parseToAst } from "../lib/ast/parseToAst.js";
import type { ProgramNode } from "../lib/ast/nodes/program.js";
import {
  BoqqiRuntimeError,
  formatRuntimeError,
} from "../lib/diagnostics/runtimeError.js";
import {
  BoqqiSemanticError,
  formatSemanticError,
} from "../lib/diagnostics/semanticError.js";
import { semanticAnalyze } from "../lib/visitor/semantics/analyze.js";

export async function readSourceFile(file: string): Promise<string> {
  return readFile(file, "utf-8");
}

export function parseAndAnalyze(source: string): ProgramNode {
  const ast = parseToAst(source);
  semanticAnalyze(ast);
  return ast;
}

export function writeJson(value: unknown): void {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

export function handleCliError(
  error: unknown,
  source: string,
  file: string,
): boolean {
  if (error instanceof BoqqiSemanticError) {
    process.stderr.write(`${formatSemanticError(error, source, file)}\n`);
    process.exitCode = 1;
    return true;
  }

  if (error instanceof BoqqiRuntimeError) {
    process.stderr.write(`${formatRuntimeError(error, source, file)}\n`);
    process.exitCode = 1;
    return true;
  }

  return false;
}

export function handleBytecodeJsonError(error: unknown): boolean {
  if (error instanceof SyntaxError) {
    process.stderr.write(`Invalid bytecode JSON: ${error.message}\n`);
    process.exitCode = 1;
    return true;
  }

  if (error instanceof Error && error.message.startsWith("bytecode JSON ")) {
    process.stderr.write(`Invalid bytecode JSON: ${error.message}\n`);
    process.exitCode = 1;
    return true;
  }

  return false;
}
