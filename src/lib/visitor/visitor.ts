import { AssignNode } from "../ast/nodes/assign.js";
import { BinaryNode } from "../ast/nodes/binary.js";
import { BoolNode } from "../ast/nodes/bool.js";
import { CallNode } from "../ast/nodes/call.js";
import { CompareNode } from "../ast/nodes/compare.js";
import { DeclareNode } from "../ast/nodes/declare.js";
import { FloatNode } from "../ast/nodes/float.js";
import { FunctionNode } from "../ast/nodes/function.js";
import { IfNode } from "../ast/nodes/if.js";
import { IndexNode } from "../ast/nodes/index.js";
import { IntNode } from "../ast/nodes/int.js";
import { ProgramNode } from "../ast/nodes/program.js";
import { ReturnNode } from "../ast/nodes/return.js";
import { StringNode } from "../ast/nodes/string.js";
import { VarNode } from "../ast/nodes/var.js";
import { WhileNode } from "../ast/nodes/while.js";

// visitor の 雛形を明記
export interface Visitor<T> {
  visitProgram(node: ProgramNode): T;
  visitBinary(node: BinaryNode): T;
  visitCompare(node: CompareNode): T;
  visitInt(node: IntNode): T;
  visitFloat(node: FloatNode): T;
  visitString(node: StringNode): T;
  visitBool(node: BoolNode): T;
  visitCall(node: CallNode): T;
  visitAssign(node: AssignNode): T;
  visitDeclare(node: DeclareNode): T;
  visitVar(node: VarNode): T;
  visitIndex(node: IndexNode): T;
  visitIf(node: IfNode): T;
  visitWhile(node: WhileNode): T;
  visitFunction(node: FunctionNode): T;
  visitReturn(node: ReturnNode): T;
}
