import { Command } from "commander";
import process from "node:process";
import { BoqqiInterpreter } from "../lib/visitor/interpreter/interpreter.js";
import { readCliInput } from "./stdin.js";
import { handleCliError, parseAndAnalyze, readSourceFile } from "./utils.js";

export function createInterpretCommand(): Command {
  return new Command("interpret")
    .description("interpret and execute a source file")
    .argument("<file>", "source file path")
    .option("--max-test", "interpret with domain maximum values")
    .option("--min-test", "interpret with domain minimum values")
    .action(
      async (
        file: string,
        options: { maxTest?: boolean; minTest?: boolean },
      ) => {
        const source = await readSourceFile(file);
        const input = await readCliInput();
        try {
          const ast = parseAndAnalyze(source);
          const maxTest = options.maxTest === true;
          const minTest = options.minTest === true;
          if (maxTest && minTest) {
            process.stderr.write(
              "--max-test and --min-test cannot be used together\n",
            );
            process.exitCode = 1;
            return;
          }
          const boundaryTest = maxTest || minTest;
          const writeBoundaryTestLog = (txt: string): void => {
            process.stdout.write(`${txt}\n`);
          };

          const interpreter = new BoqqiInterpreter(
            (txt: string) => {
              if (boundaryTest) {
                return;
              }
              process.stdout.write(txt);
            },
            input.source,
            {
              mode: maxTest ? "max-test" : minTest ? "min-test" : "normal",
              boundaryTestLog: boundaryTest ? writeBoundaryTestLog : undefined,
              interactiveInput: input.interactive && !boundaryTest,
            },
          );
          interpreter.visitProgram(ast);
        } catch (error) {
          if (handleCliError(error, source, file)) {
            return;
          }

          throw error;
        }
      },
    );
}
