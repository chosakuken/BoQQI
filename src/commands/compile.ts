import { Command } from "commander";
import { readFile } from "node:fs/promises";
import process from "node:process";
import { parseToAst } from "../lib/ast/parseToAst.js";
import { compile } from "../lib/visitor/compiler/compile.js";
import { semanticAnalyze } from "../lib/visitor/semantics/analyze.js";
import { bytecodeToJson } from "../lib/vm/bytecodeJson.js";

export function createCompileCommand(): Command {
  return new Command("compile")
    .description("")
    .argument("<file>", "source file path")
    .action(async (file: string) => {
      const source = await readFile(file, "utf-8");
      const ast = parseToAst(source);
      semanticAnalyze(ast);
      const bytecode = compile(ast);
      process.stdout.write(
        `${JSON.stringify(bytecodeToJson(bytecode), null, 2)}\n`,
      );
    });
}
