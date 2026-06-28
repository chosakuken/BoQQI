import { Command } from "commander";
import { parseToAst } from "../lib/ast/parseToAst.js";
import { readSourceFile, writeJson } from "./utils.js";

export function createAstDumpCommand(): Command {
  return new Command("ast-dump")
    .description("parse a source file and print its AST as JSON")
    .argument("<file>", "source file path")
    .action(async (file: string) => {
      const source = await readSourceFile(file);
      const result = parseToAst(source);
      writeJson(result);
    });
}
