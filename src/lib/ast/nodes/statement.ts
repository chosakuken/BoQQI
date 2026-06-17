import { AssignNode } from "./assign.js";
import { CallNode } from "./call.js";
import { DeclareNode } from "./declare.js";
import { FunctionNode } from "./function.js";
import { IfNode } from "./if.js";
import { ReturnNode } from "./return.js";
import { WhileNode } from "./while.js";

export type StatementNode =
  | AssignNode
  | CallNode
  | IfNode
  | WhileNode
  | DeclareNode
  | FunctionNode
  | ReturnNode;
