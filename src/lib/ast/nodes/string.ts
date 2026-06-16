import { Visitor } from "../../visitor/visitor.js";
import { SourceLocation } from "../../diagnostics/sourceLocation.js";
import { AstNode } from "./node.js";

export class StringNode implements AstNode {
  readonly kind: "string";
  readonly value: string;
  readonly location?: SourceLocation;
  accept<T>(visitor: Visitor<T>) {
    return visitor.visitString(this);
  }
  constructor(value: string, location?: SourceLocation) {
    this.kind = "string";
    this.value = value;
    this.location = location;
  }
}
