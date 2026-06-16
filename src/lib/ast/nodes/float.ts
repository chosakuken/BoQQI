import { Visitor } from "../../visitor/visitor.js";
import { SourceLocation } from "../../diagnostics/sourceLocation.js";
import { AstNode } from "./node.js";

export class FloatNode implements AstNode {
  readonly kind: "float";
  readonly value: number;
  readonly max?: number;
  readonly min?: number;
  readonly location?: SourceLocation;
  accept<T>(visitor: Visitor<T>) {
    return visitor.visitFloat(this);
  }
  constructor(
    value: number,
    max?: number,
    min?: number,
    location?: SourceLocation,
  ) {
    this.kind = "float";
    this.value = value;
    this.max = max;
    this.min = min;
    this.location = location;
  }
}
