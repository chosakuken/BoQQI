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
    .action(async (file: string) => {
      const bytecodeJson = await readFile(file, "utf-8");
      const input = await readPipedStdin();
      try {
        const bytecode = bytecodeFromJson(JSON.parse(bytecodeJson));
        const vm = new BoqqiVM(
          bytecode,
          (txt: string) => {
            process.stdout.write(txt);
          },
          input,
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
    });
}
