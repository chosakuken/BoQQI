import { Command } from "commander";
import { compile } from "../lib/visitor/compiler/compile.js";
import { bytecodeToJson } from "../lib/vm/bytecodeJson.js";
import {
  handleCliError,
  parseAndAnalyze,
  readSourceFile,
  writeJson,
} from "./utils.js";

export function createCompileCommand(): Command {
  return new Command("compile")
    .description("compile a source file to bytecode JSON")
    .argument("<file>", "source file path")
    .action(async (file: string) => {
      const source = await readSourceFile(file);
      try {
        const ast = parseAndAnalyze(source);
        const bytecode = compile(ast);
        writeJson(bytecodeToJson(bytecode));
      } catch (error) {
        if (handleCliError(error, source, file)) {
          return;
        }
        throw error;
      }
    });
}
