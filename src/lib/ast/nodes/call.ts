import { Visitor } from "../../visitor/visitor.js";
import { SourceLocation } from "../../diagnostics/sourceLocation.js";
import type { ExprNode } from "./expr.js";
import { AstNode } from "./node.js";

export class CallNode implements AstNode {
  readonly kind: "call";
  readonly name: string;
  readonly args: ExprNode[];
  readonly location?: SourceLocation;
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitCall(this);
  }
  constructor(name: string, args: ExprNode[], location?: SourceLocation) {
    this.kind = "call";
    this.name = name;
    this.args = args;
    this.location = location;
  }
}
