import { Command } from "commander";
import { parse } from "../lib/parser/parse.js";
import { readSourceFile, writeJson } from "./utils.js";

export function createParserCommand(): Command {
  return new Command("parse")
    .description("parse a source file and print the parse tree as JSON")
    .argument("<file>", "source file path")
    .action(async (file: string) => {
      const source = await readSourceFile(file);
      const result = parse(source);
      writeJson(result);
    });
}
