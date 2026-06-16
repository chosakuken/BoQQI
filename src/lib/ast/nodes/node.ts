import { Visitor } from "../../visitor/visitor.js";
import { SourceLocation } from "../../diagnostics/sourceLocation.js";

// AST の基礎単位を定義
export interface AstNode {
  readonly kind: string; // ノードの種類
  readonly location?: SourceLocation;
  accept<T>(visitor: Visitor<T>): T; // ビジター用
}
