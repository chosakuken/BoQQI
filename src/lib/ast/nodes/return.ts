import { SourceLocation } from "../../diagnostics/sourceLocation.js";
import { Visitor } from "../../visitor/visitor.js";
import { ExprNode } from "./expr.js";
import { AstNode } from "./node.js";

export class ReturnNode implements AstNode {
  readonly kind: "return";
  readonly expr: ExprNode;
  readonly location?: SourceLocation;

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitReturn(this);
  }

  constructor(expr: ExprNode, location?: SourceLocation) {
    this.kind = "return";
    this.expr = expr;
    this.location = location;
  }
}
