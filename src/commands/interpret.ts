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
    .option("--test", "interpret with both domain maximum and minimum values")
    .action(
      async (
        file: string,
        options: { maxTest?: boolean; minTest?: boolean; test?: boolean },
      ) => {
        const source = await readSourceFile(file);
        const input = await readCliInput();
        try {
          const ast = parseAndAnalyze(source);
          const maxTest = options.maxTest === true;
          const minTest = options.minTest === true;
          const test = options.test === true;
          if ([maxTest, minTest, test].filter(Boolean).length > 1) {
            process.stderr.write(
              "--max-test, --min-test, and --test cannot be used together\n",
            );
            process.exitCode = 1;
            return;
          }
          const modes = test
            ? (["max-test", "min-test"] as const)
            : ([
                maxTest ? "max-test" : minTest ? "min-test" : "normal",
              ] as const);
          const writeBoundaryTestLog = (txt: string): void => {
            process.stdout.write(`${txt}\n`);
          };

          for (const [index, mode] of modes.entries()) {
            if (test && index > 0) {
              process.stdout.write("==========\n");
            }
            const boundaryTest = mode !== "normal";
            const interpreter = new BoqqiInterpreter(
              (txt: string) => {
                if (boundaryTest) {
                  return;
                }
                process.stdout.write(txt);
              },
              input.source,
              {
                mode,
                boundaryTestLog: boundaryTest
                  ? writeBoundaryTestLog
                  : undefined,
                interactiveInput: input.interactive && !boundaryTest,
              },
            );
            interpreter.visitProgram(ast);
          }
        } catch (error) {
          if (handleCliError(error, source, file)) {
            return;
          }

          throw error;
        }
      },
    );
}
