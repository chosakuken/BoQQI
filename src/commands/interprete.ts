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
import { BoqqiInterpreter } from "../lib/visitor/interpreter/interpreter.js";
import { semanticAnalyze } from "../lib/visitor/semantics/analyze.js";

export function createInterpreteCommand(): Command {
  return new Command("interprete")
    .description("")
    .argument("<file>", "source file path")
    .action(async (file: string) => {
      const source = await readFile(file, "utf-8");
      try {
        const ast = parseToAst(source);
        semanticAnalyze(ast);
        const interpreter = new BoqqiInterpreter((txt: string) => {
          process.stdout.write(txt);
        });
        interpreter.visitProgram(ast);
      } catch (error) {
        if (error instanceof BoqqiSemanticError) {
          process.stderr.write(`${formatSemanticError(error, source, file)}\n`);
          process.exitCode = 1;
          return;
        }
        if (error instanceof BoqqiRuntimeError) {
          process.stderr.write(`${formatRuntimeError(error, source, file)}\n`);
          process.exitCode = 1;
          return;
        }

        throw error;
      }
    });
}
