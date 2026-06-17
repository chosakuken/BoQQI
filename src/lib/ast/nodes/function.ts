import { SourceLocation } from "../../diagnostics/sourceLocation.js";
import { Visitor } from "../../visitor/visitor.js";
import { DomainNode } from "./declare.js";
import { AstNode } from "./node.js";
import { StatementNode } from "./statement.js";

export interface ParamNode {
  readonly type: string;
  readonly name: string;
  readonly domain?: DomainNode;
}

export interface ReturnTypeNode {
  readonly type: string;
  readonly domain?: DomainNode;
}

export class FunctionNode implements AstNode {
  readonly kind: "function";
  readonly name: string;
  readonly params: ParamNode[];
  readonly returnType: ReturnTypeNode;
  readonly body: StatementNode[];
  readonly location?: SourceLocation;

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitFunction(this);
  }

  constructor(
    name: string,
    params: ParamNode[],
    returnType: ReturnTypeNode,
    body: StatementNode[],
    location?: SourceLocation,
  ) {
    this.kind = "function";
    this.name = name;
    this.params = params;
    this.returnType = returnType;
    this.body = body;
    this.location = location;
  }
}
