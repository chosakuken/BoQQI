import { Command } from "commander";
import process from "node:process";
import { bytecodeFromJson } from "../lib/vm/bytecodeJson.js";
import { BoqqiVM } from "../lib/vm/vm.js";
import { readPipedStdin } from "./stdin.js";
import {
  handleBytecodeJsonError,
  handleCliError,
  readSourceFile,
} from "./utils.js";

export function createRunCommand(): Command {
  return new Command("run")
    .description("run bytecode JSON")
    .argument("<file>", "bytecode JSON file path")
    .option("--max-test", "run VM with domain maximum values")
    .option("--min-test", "run VM with domain minimum values")
    .action(
      async (
        file: string,
        options: { maxTest?: boolean; minTest?: boolean },
      ) => {
        const bytecodeJson = await readSourceFile(file);
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
          if (handleBytecodeJsonError(error)) {
            return;
          }
          if (handleCliError(error, bytecodeJson, file)) {
            return;
          }

          throw error;
        }
      },
    );
}
