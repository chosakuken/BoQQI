import process from "node:process";

export interface CliInput {
  readonly source: string;
  readonly interactive: boolean;
}

export async function readCliInput(): Promise<CliInput> {
  if (process.stdin.isTTY) {
    return { source: "", interactive: true };
  }

  process.stdin.setEncoding("utf-8");
  const chunks: string[] = [];
  for await (const chunk of process.stdin) {
    const value: unknown = chunk;
    chunks.push(typeof value === "string" ? value : String(value));
  }
  return { source: chunks.join(""), interactive: false };
}
