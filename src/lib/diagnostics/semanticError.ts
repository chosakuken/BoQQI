import { SourceFrame } from "./sourceLocation.js";

export class BoqqiSemanticError extends Error {
  readonly frames: SourceFrame[];

  constructor(message: string, frames: SourceFrame[]) {
    super(message);
    this.name = "BoqqiSemanticError";
    this.frames = frames;
  }
}

export function formatSemanticError(
  error: BoqqiSemanticError,
  source: string,
  file: string,
): string {
  const lines = source.split(/\r?\n/);
  const output: string[] = [`意味解析エラー: ${error.message}`];

  for (const frame of [...error.frames].reverse()) {
    if (frame.location === undefined) {
      output.push(`  at ${frame.label}`);
      continue;
    }

    const line = lines[frame.location.line - 1] ?? "";
    const column = frame.location.column + 1;
    output.push(
      `  at ${frame.label} (${file}:${String(frame.location.line)}:${String(column)})`,
    );
    output.push(`    ${line}`);
    output.push(`    ${" ".repeat(Math.max(0, column - 1))}^`);
  }

  return output.join("\n");
}
