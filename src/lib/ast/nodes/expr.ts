import { BinaryNode } from "./binary.js";
import { BoolNode } from "./bool.js";
import { CallNode } from "./call.js";
import { CompareNode } from "./compare.js";
import { FloatNode } from "./float.js";
import { IndexNode } from "./index.js";
import { IntNode } from "./int.js";
import { StringNode } from "./string.js";
import { VarNode } from "./var.js";

export type ExprNode =
  | IntNode
  | FloatNode
  | StringNode
  | BoolNode
  | BinaryNode
  | CallNode
  | VarNode
  | IndexNode
  | CompareNode;
