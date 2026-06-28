import { SourceFrame } from "./sourceLocation.js";

export class BoqqiRuntimeError extends Error {
  readonly frames: SourceFrame[];

  constructor(message: string, frames: SourceFrame[]) {
    super(message);
    this.name = "BoqqiRuntimeError";
    this.frames = frames;
  }
}

export function formatRuntimeError(
  error: BoqqiRuntimeError,
  source: string,
  file: string,
): string {
  const lines = source.split(/\r?\n/);
  const output: string[] = [`実行時エラー: ${error.message}`];
  const frame = error.frames.at(-1);

  if (frame === undefined) {
    return output.join("\n");
  }

  if (frame.location === undefined) {
    output.push(`  at ${frame.label}`);
    return output.join("\n");
  }

  const line = lines[frame.location.line - 1] ?? "";
  const column = frame.location.column + 1;
  output.push(
    `  at ${frame.label} (${file}:${String(frame.location.line)}:${String(column)})`,
  );
  output.push(`    ${line}`);
  output.push(`    ${" ".repeat(Math.max(0, column - 1))}^`);

  return output.join("\n");
}
