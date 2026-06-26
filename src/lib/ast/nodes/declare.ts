import { Visitor } from "../../visitor/visitor.js";
import { SourceLocation } from "../../diagnostics/sourceLocation.js";
import { ExprNode } from "./expr.js";
import { AstNode } from "./node.js";

export interface DomainNode {
  readonly max: ExprNode;
  readonly min: ExprNode;
}

export class DeclareNode implements AstNode {
  readonly kind: "declare";
  readonly type: string;
  readonly name: string;
  readonly arrayLength?: number;
  readonly domain?: DomainNode;
  readonly initValue?: ExprNode;
  readonly location?: SourceLocation;
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitDeclare(this);
  }
  constructor(
    t: string,
    n: string,
    arrayLength?: number,
    d?: DomainNode,
    i?: ExprNode,
    location?: SourceLocation,
  ) {
    this.kind = "declare";
    this.type = t;
    this.name = n;
    this.arrayLength = arrayLength;
    this.domain = d;
    this.initValue = i;
    this.location = location;
  }
}
