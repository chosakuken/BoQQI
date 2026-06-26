import { Visitor } from "../../visitor/visitor.js";
import { SourceLocation } from "../../diagnostics/sourceLocation.js";
import { ExprNode } from "./expr.js";
import { AstNode } from "./node.js";

export class AssignNode implements AstNode {
  readonly kind: "assign";
  readonly name: string;
  readonly index?: ExprNode;
  readonly expr: ExprNode;
  readonly location?: SourceLocation;
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitAssign(this);
  }
  constructor(
    name: string,
    index: ExprNode | undefined,
    expr: ExprNode,
    location?: SourceLocation,
  ) {
    this.kind = "assign";
    this.name = name;
    this.index = index;
    this.expr = expr;
    this.location = location;
  }
}
