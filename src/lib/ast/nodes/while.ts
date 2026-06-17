import { Visitor } from "../../visitor/visitor.js";
import { SourceLocation } from "../../diagnostics/sourceLocation.js";
import { ExprNode } from "./expr.js";
import { AstNode } from "./node.js";
import { StatementNode } from "./statement.js";

export class WhileNode implements AstNode {
  readonly kind: "while";
  readonly cond: ExprNode;
  readonly body: StatementNode[];
  readonly location?: SourceLocation;

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitWhile(this);
  }

  constructor(
    cond: ExprNode,
    body: StatementNode[],
    location?: SourceLocation,
  ) {
    this.kind = "while";
    this.cond = cond;
    this.body = body;
    this.location = location;
  }
}
