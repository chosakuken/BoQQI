#!/usr/bin/env node

import { Command } from "commander";
import { createLexerCommand } from "./commands/lex.js";
import { createParserCommand } from "./commands/parse.js";
import { createAstDumpCommand } from "./commands/ast-dump.js";
import { createInterpreteCommand } from "./commands/interprete.js";
import { createRunCommand } from "./commands/run.js";
import { createCompileCommand } from "./commands/compile.js";

export function createCli(): Command {
  const program = new Command();

  program
    .name("boqqi")
    .description("Bounded Qualified Query Interpreter")
    .version("0.0.0")
    .action(() => {
      program.help();
    });

  program.addCommand(createLexerCommand());
  program.addCommand(createParserCommand());
  program.addCommand(createAstDumpCommand());
  program.addCommand(createInterpreteCommand());
  program.addCommand(createRunCommand());
  program.addCommand(createCompileCommand());

  return program;
}

createCli()
  .parseAsync()
  .catch((error: unknown) => {
    const message =
      error instanceof Error ? (error.stack ?? error.message) : String(error);

    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });
