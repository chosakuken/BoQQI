import { Command } from "commander";
import { readFile } from "node:fs/promises";
import process from "node:process";
import {
  BoqqiRuntimeError,
  formatRuntimeError,
} from "../lib/diagnostics/runtimeError.js";
import {
  BoqqiSemanticError,
  formatSemanticError,
} from "../lib/diagnostics/semanticError.js";
import { bytecodeFromJson } from "../lib/vm/bytecodeJson.js";
import { BoqqiVM } from "../lib/vm/vm.js";
import { readPipedStdin } from "./stdin.js";

export function createRunCommand(): Command {
  return new Command("run")
    .description("")
    .argument("<file>", "bytecode JSON file path")
    .option("--max-test", "run VM with domain maximum values")
    .option("--min-test", "run VM with domain minimum values")
    .action(
      async (
        file: string,
        options: { maxTest?: boolean; minTest?: boolean },
      ) => {
        const bytecodeJson = await readFile(file, "utf-8");
        const input = await readPipedStdin();
        try {
          const bytecode = bytecodeFromJson(JSON.parse(bytecodeJson));
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

          const vm = new BoqqiVM(
            bytecode,
            (txt: string) => {
              if (boundaryTest) {
                return;
              }
              process.stdout.write(txt);
            },
            input,
            {
              mode: maxTest ? "max-test" : minTest ? "min-test" : "normal",
              boundaryTestLog: boundaryTest ? writeBoundaryTestLog : undefined,
            },
          );
          vm.run();
        } catch (error) {
          if (error instanceof SyntaxError) {
            process.stderr.write(`Invalid bytecode JSON: ${error.message}\n`);
            process.exitCode = 1;
            return;
          }
          if (
            error instanceof Error &&
            error.message.startsWith("bytecode JSON ")
          ) {
            process.stderr.write(`Invalid bytecode JSON: ${error.message}\n`);
            process.exitCode = 1;
            return;
          }
          if (error instanceof BoqqiSemanticError) {
            process.stderr.write(
              `${formatSemanticError(error, bytecodeJson, file)}\n`,
            );
            process.exitCode = 1;
            return;
          }
          if (error instanceof BoqqiRuntimeError) {
            process.stderr.write(
              `${formatRuntimeError(error, bytecodeJson, file)}\n`,
            );
            process.exitCode = 1;
            return;
          }

          throw error;
        }
      },
    );
}
