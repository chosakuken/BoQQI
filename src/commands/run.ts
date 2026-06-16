import { Command } from "commander";
import { readFile } from "node:fs/promises";
import process from "node:process";
import { parseToAst } from "../lib/ast/parseToAst.js";
import {
  BoqqiRuntimeError,
  formatRuntimeError,
} from "../lib/diagnostics/runtimeError.js";
import { compile } from "../lib/visitor/compiler/compile.js";
import { BoqqiVM } from "../lib/vm/vm.js";

export function createRunCommand(): Command {
  return new Command("run")
    .description("")
    .argument("<file>", "source file path")
    .action(async (file: string) => {
      const source = await readFile(file, "utf-8");
      try {
        const ast = parseToAst(source);
        const bytecode = compile(ast);
        const vm = new BoqqiVM(bytecode, (txt: string) => {
          process.stdout.write(txt);
        });
        vm.run();
      } catch (error) {
        if (error instanceof BoqqiRuntimeError) {
          process.stderr.write(`${formatRuntimeError(error, source, file)}\n`);
          process.exitCode = 1;
          return;
        }

        throw error;
      }
    });
}
