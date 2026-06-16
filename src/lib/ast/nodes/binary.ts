import { Visitor } from "../../visitor/visitor.js";
import { SourceLocation } from "../../diagnostics/sourceLocation.js";
import { ExprNode } from "./expr.js";
import { AstNode } from "./node.js";

export type BinaryOperator = "+" | "-" | "*" | "/";

export class BinaryNode implements AstNode {
  readonly kind: "binary";
  readonly operator: BinaryOperator;
  readonly left: ExprNode;
  readonly right: ExprNode;
  readonly location?: SourceLocation;
  accept<T>(visitor: Visitor<T>) {
    return visitor.visitBinary(this);
  }
  constructor(
    operator: BinaryOperator,
    left: ExprNode,
    right: ExprNode,
    location?: SourceLocation,
  ) {
    this.kind = "binary";
    this.operator = operator;
    this.left = left;
    this.right = right;
    this.location = location;
  }
}
