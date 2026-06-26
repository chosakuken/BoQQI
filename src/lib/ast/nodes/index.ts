import { SourceLocation } from "../../diagnostics/sourceLocation.js";
import { Visitor } from "../../visitor/visitor.js";
import type { ExprNode } from "./expr.js";
import { AstNode } from "./node.js";

export class IndexNode implements AstNode {
  readonly kind: "index";
  readonly target: ExprNode;
  readonly index: ExprNode;
  readonly location?: SourceLocation;

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitIndex(this);
  }

  constructor(target: ExprNode, index: ExprNode, location?: SourceLocation) {
    this.kind = "index";
    this.target = target;
    this.index = index;
    this.location = location;
  }
}
