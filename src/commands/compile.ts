import { Command } from "commander";
import { readFile } from "node:fs/promises";
import process from "node:process";
import { parseToAst } from "../lib/ast/parseToAst.js";
import {
  BoqqiRuntimeError,
  formatRuntimeError,
} from "../lib/diagnostics/runtimeError.js";
import {
  BoqqiSemanticError,
  formatSemanticError,
} from "../lib/diagnostics/semanticError.js";
import { compile } from "../lib/visitor/compiler/compile.js";
import { semanticAnalyze } from "../lib/visitor/semantics/analyze.js";
import { BoqqiVM } from "../lib/vm/vm.js";

export function createCompileCommand(): Command {
  return new Command("compile")
    .description("")
    .argument("<file>", "source file path")
    .action(async (file: string) => {
      const source = await readFile(file, "utf-8");
      const ast = parseToAst(source);
      semanticAnalyze(ast);
      const bytecode = compile(ast);
      process.stdout.write(`${JSON.stringify(bytecode, null, 2)}\n`);
    });
}
