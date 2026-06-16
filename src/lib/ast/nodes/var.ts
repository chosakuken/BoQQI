import { Visitor } from "../../visitor/visitor.js";
import { SourceLocation } from "../../diagnostics/sourceLocation.js";
import { AstNode } from "./node.js";

export class VarNode implements AstNode {
  readonly kind: "var";
  readonly name: string;
  readonly location?: SourceLocation;
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitVar(this);
  }
  constructor(name: string, location?: SourceLocation) {
    this.kind = "var";
    this.name = name;
    this.location = location;
  }
}
