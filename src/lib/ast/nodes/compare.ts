import { Visitor } from "../../visitor/visitor.js";
import { SourceLocation } from "../../diagnostics/sourceLocation.js";
import { ExprNode } from "./expr.js";
import { AstNode } from "./node.js";

export type CompareOperator = "==" | "!=" | "<" | ">" | "<=" | ">=";

export class CompareNode implements AstNode {
  readonly kind: "compare";
  readonly operator: CompareOperator;
  readonly left: ExprNode;
  readonly right: ExprNode;
  readonly location?: SourceLocation;
  accept<T>(visitor: Visitor<T>) {
    return visitor.visitCompare(this);
  }
  constructor(
    operator: CompareOperator,
    left: ExprNode,
    right: ExprNode,
    location?: SourceLocation,
  ) {
    this.kind = "compare";
    this.operator = operator;
    this.left = left;
    this.right = right;
    this.location = location;
  }
}
