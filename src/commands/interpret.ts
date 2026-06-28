import { Command } from "commander";
import process from "node:process";
import { BoqqiInterpreter } from "../lib/visitor/interpreter/interpreter.js";
import { readPipedStdin } from "./stdin.js";
import { handleCliError, parseAndAnalyze, readSourceFile } from "./utils.js";

export function createInterpretCommand(): Command {
  return new Command("interpret")
    .description("interpret and execute a source file")
    .argument("<file>", "source file path")
    .action(async (file: string) => {
      const source = await readSourceFile(file);
      const input = await readPipedStdin();
      try {
        const ast = parseAndAnalyze(source);
        const interpreter = new BoqqiInterpreter((txt: string) => {
          process.stdout.write(txt);
        }, input);
        interpreter.visitProgram(ast);
      } catch (error) {
        if (handleCliError(error, source, file)) {
          return;
        }

        throw error;
      }
    });
}
