import process from "node:process";

export async function readPipedStdin(): Promise<string> {
  if (process.stdin.isTTY) {
    return "";
  }

  process.stdin.setEncoding("utf-8");
  const chunks: string[] = [];
  for await (const chunk of process.stdin) {
    const value: unknown = chunk;
    chunks.push(typeof value === "string" ? value : String(value));
  }
  return chunks.join("");
}
