import { Visitor } from "../../visitor/visitor.js";
import { SourceLocation } from "../../diagnostics/sourceLocation.js";
import { AstNode } from "./node.js";

export class BoolNode implements AstNode {
  readonly kind: "bool";
  readonly value: boolean;
  readonly location?: SourceLocation;
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitBool(this);
  }
  constructor(v: boolean, location?: SourceLocation) {
    this.kind = "bool";
    this.value = v;
    this.location = location;
  }
}
