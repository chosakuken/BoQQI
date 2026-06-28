import { Command } from "commander";
import { tokenize } from "../lib/lexer/tokenize.js";
import { readSourceFile, writeJson } from "./utils.js";

export function createLexerCommand(): Command {
  return new Command("lex")
    .description("tokenize a source file and print tokens as JSON")
    .argument("<file>", "source file path")
    .action(async (file: string) => {
      const source = await readSourceFile(file);
      const result = tokenize(source);
      writeJson(result);
    });
}
