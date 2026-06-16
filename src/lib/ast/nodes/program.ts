// program ノード
import { Visitor } from "../../visitor/visitor.js";
import { SourceLocation } from "../../diagnostics/sourceLocation.js";
import { AstNode } from "./node.js";
import { StatementNode } from "./statement.js";

export class ProgramNode implements AstNode {
  readonly kind: "program";
  readonly body: StatementNode[];
  readonly location?: SourceLocation;
  accept<T>(visitor: Visitor<T>) {
    return visitor.visitProgram(this);
  }
  constructor(body: StatementNode[], location?: SourceLocation) {
    this.kind = "program";
    this.body = body;
    this.location = location;
  }
}
