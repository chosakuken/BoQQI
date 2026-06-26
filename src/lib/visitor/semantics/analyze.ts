import { AssignNode } from "../../ast/nodes/assign.js";
import { BinaryNode } from "../../ast/nodes/binary.js";
import { BoolNode } from "../../ast/nodes/bool.js";
import { CallNode } from "../../ast/nodes/call.js";
import { CompareNode } from "../../ast/nodes/compare.js";
import { DeclareNode, DomainNode } from "../../ast/nodes/declare.js";
import { FloatNode } from "../../ast/nodes/float.js";
import {
  FunctionNode,
  ParamNode,
  ReturnTypeNode,
} from "../../ast/nodes/function.js";
import { IfNode } from "../../ast/nodes/if.js";
import { IndexNode } from "../../ast/nodes/index.js";
import { IntNode } from "../../ast/nodes/int.js";
import { AstNode } from "../../ast/nodes/node.js";
import { ProgramNode } from "../../ast/nodes/program.js";
import { ReturnNode } from "../../ast/nodes/return.js";
import { StringNode } from "../../ast/nodes/string.js";
import { VarNode } from "../../ast/nodes/var.js";
import { WhileNode } from "../../ast/nodes/while.js";
import { BoqqiSemanticError } from "../../diagnostics/semanticError.js";
import { SourceFrame } from "../../diagnostics/sourceLocation.js";
import { Visitor } from "../visitor.js";
import { ArrayValueType, ScalarValueType } from "../../vm/instruction.js";
import {
  FunctionSymbol,
  SemanticResult,
  SemanticScope,
  SemanticType,
  VariableSymbol,
} from "./types.js";

export function semanticAnalyze(program: ProgramNode): SemanticResult {
  const analyzer = new BoqqiSemanticAnalyzer();
  return analyzer.analyze(program);
}

class BoqqiSemanticAnalyzer implements Visitor<SemanticType> {
  private readonly functions = new Map<string, FunctionSymbol>();
  private readonly scopes: SemanticScope[] = [
    { name: "global", variables: new Map<string, VariableSymbol>() },
  ];
  private readonly frames: SourceFrame[] = [];
  private currentReturnType?: SemanticType;

  constructor() {
    this.functions.set("print", {
      name: "print",
      params: "variadic",
      returnType: "int",
    });
  }

  analyze(program: ProgramNode): SemanticResult {
    program.accept(this);

    return {
      globals: this.scopes[0].variables,
      functions: this.functions,
    };
  }

  visitProgram(node: ProgramNode): SemanticType {
    return this.withFrame(node, "program", () => {
      for (const statement of node.body) {
        statement.accept(this);
      }
      return "void";
    });
  }

  visitBinary(node: BinaryNode): SemanticType {
    return this.withFrame(node, `binary '${node.operator}'`, () => {
      const left = node.left.accept(this);
      const right = node.right.accept(this);

      this.assertNumeric(left, "式の左辺には数値型が必要です");
      this.assertNumeric(right, "式の右辺には数値型が必要です");

      return left === "int" && right === "int" ? "int" : "float";
    });
  }

  visitCompare(node: CompareNode): SemanticType {
    return this.withFrame(node, `compare '${node.operator}'`, () => {
      const left = node.left.accept(this);
      const right = node.right.accept(this);

      if (node.operator === "==" || node.operator === "!=") {
        if (left === "void" || right === "void") {
          this.fail("void 型の値は比較できません");
        }
        if (left !== right) {
          this.fail(
            `比較演算子 ${node.operator} には同じ型同士を指定してください: ${left} と ${right}`,
          );
        }
        return "bool";
      }

      this.assertNumeric(left, "比較演算子の左辺には数値型が必要です");
      this.assertNumeric(right, "比較演算子の右辺には数値型が必要です");
      return "bool";
    });
  }

  visitInt(node: IntNode): SemanticType {
    return this.withFrame(node, "int literal", () => "int");
  }

  visitFloat(node: FloatNode): SemanticType {
    return this.withFrame(node, "float literal", () => "float");
  }

  visitString(node: StringNode): SemanticType {
    return this.withFrame(node, "string literal", () => "string");
  }

  visitBool(node: BoolNode): SemanticType {
    return this.withFrame(node, "bool literal", () => "bool");
  }

  visitCall(node: CallNode): SemanticType {
    return this.withFrame(node, `call ${node.name}`, () => {
      const func = this.functions.get(node.name);
      if (func === undefined) {
        this.fail(`関数 ${node.name} は未定義です`);
      }

      const argTypes = node.args.map((arg) => arg.accept(this));
      if (func.params === "variadic") {
        if (argTypes.includes("void")) {
          this.fail(`関数 ${node.name} に void 型の値は渡せません`);
        }
        return func.returnType;
      }

      if (node.args.length !== func.params.length) {
        this.fail(
          `関数 ${node.name} は ${String(func.params.length)} 個の引数を取りますが、${String(node.args.length)} 個渡されました`,
        );
      }

      for (const [index, argType] of argTypes.entries()) {
        const param = func.params[index];
        if (param.type !== argType) {
          this.fail(
            `関数 ${node.name} の引数 ${param.name} は ${param.type} 型ですが、${argType} 型が渡されました`,
          );
        }
      }

      return func.returnType;
    });
  }

  visitAssign(node: AssignNode): SemanticType {
    return this.withFrame(node, `assign ${node.name}`, () => {
      const variable = this.findVariable(node.name);
      if (variable === undefined) {
        this.fail(`変数 ${node.name} は宣言されていません`);
      }

      const valueType = node.expr.accept(this);
      if (node.index === undefined && this.isArrayType(variable.type)) {
        this.fail(`配列 ${node.name} への一括代入はできません`);
      }

      if (node.index !== undefined) {
        if (!this.isArrayType(variable.type)) {
          this.fail(`変数 ${node.name} は配列型ではありません`);
        }
        const indexType = node.index.accept(this);
        if (indexType !== "int") {
          this.fail(`配列の添え字には int 型が必要ですが、${indexType} 型です`);
        }
        const elementType = this.arrayElementType(variable.type);
        if (elementType !== valueType) {
          this.fail(
            `配列 ${node.name} の要素は ${elementType} 型ですが、${valueType} 型が代入されようとしました`,
          );
        }
        return "void";
      }

      if (variable.type !== valueType) {
        this.fail(
          `変数 ${node.name} は ${variable.type} 型ですが、${valueType} 型が代入されようとしました`,
        );
      }

      return "void";
    });
  }

  visitDeclare(node: DeclareNode): SemanticType {
    return this.withFrame(node, `declare ${node.name}`, () => {
      const type = this.valueType(node.type);
      const scope = this.currentScope();

      if (scope.variables.has(node.name)) {
        this.fail(`変数 ${node.name} は既に宣言済みです`);
      }

      if (node.domain !== undefined) {
        this.analyzeDomain(node.domain, `変数 ${node.name}`);
      }

      if (node.initValue !== undefined) {
        if (this.isArrayType(type)) {
          this.fail(`配列 ${node.name} は一括初期化できません`);
        }
        const initType = node.initValue.accept(this);
        if (type !== initType) {
          this.fail(
            `変数 ${node.name} は ${type} 型ですが、${initType} 型で初期化されようとしました`,
          );
        }
      }

      scope.variables.set(node.name, {
        name: node.name,
        type,
      });

      return "void";
    });
  }

  visitVar(node: VarNode): SemanticType {
    return this.withFrame(node, `load ${node.name}`, () => {
      const variable = this.findVariable(node.name);
      if (variable === undefined) {
        this.fail(`変数 ${node.name} は未定義です`);
      }
      return variable.type;
    });
  }

  visitIndex(node: IndexNode): SemanticType {
    return this.withFrame(node, "index", () => {
      const targetType = node.target.accept(this);
      const indexType = node.index.accept(this);

      if (!this.isArrayType(targetType)) {
        this.fail(
          `添え字アクセスの対象には配列型が必要ですが、${targetType} 型です`,
        );
      }
      if (indexType !== "int") {
        this.fail(`配列の添え字には int 型が必要ですが、${indexType} 型です`);
      }

      return this.arrayElementType(targetType);
    });
  }

  visitIf(node: IfNode): SemanticType {
    return this.withFrame(node, "if", () => {
      const condType = node.cond.accept(this);
      if (condType !== "bool") {
        this.fail("if 文の条件式には bool 型が必要です");
      }

      for (const statement of node.trueStatement) {
        statement.accept(this);
      }
      for (const statement of node.falseStatement ?? []) {
        statement.accept(this);
      }

      return "void";
    });
  }

  visitWhile(node: WhileNode): SemanticType {
    return this.withFrame(node, "while", () => {
      const condType = node.cond.accept(this);
      if (condType !== "bool") {
        this.fail("while 文の条件式には bool 型が必要です");
      }

      for (const statement of node.body) {
        statement.accept(this);
      }

      return "void";
    });
  }

  visitFunction(node: FunctionNode): SemanticType {
    return this.withFrame(node, `function ${node.name}`, () => {
      if (this.functions.has(node.name)) {
        this.fail(`関数 ${node.name} は既に定義済みです`);
      }

      const params = this.buildParamSymbols(node.params);
      const returnType = this.returnType(node.returnType);

      this.functions.set(node.name, {
        name: node.name,
        params,
        returnType,
      });

      const previousReturnType = this.currentReturnType;
      this.currentReturnType = returnType;
      this.scopes.push({
        name: node.name,
        variables: new Map<string, VariableSymbol>(),
      });

      try {
        const scope = this.currentScope();
        for (const param of node.params) {
          const type = this.valueType(param.type);
          if (param.domain !== undefined) {
            this.analyzeDomain(param.domain, `引数 ${param.name}`);
          }
          scope.variables.set(param.name, {
            name: param.name,
            type,
          });
        }

        if (node.returnType.domain !== undefined) {
          this.analyzeDomain(
            node.returnType.domain,
            `関数 ${node.name} の戻り値`,
          );
        }

        for (const statement of node.body) {
          statement.accept(this);
        }

        if (returnType !== "void" && !this.hasGuaranteedReturn(node.body)) {
          this.fail(
            `関数 ${node.name} は ${returnType} 型の値を返す必要があります`,
          );
        }
      } finally {
        this.scopes.pop();
        this.currentReturnType = previousReturnType;
      }

      return "void";
    });
  }

  visitReturn(node: ReturnNode): SemanticType {
    return this.withFrame(node, "return", () => {
      if (this.currentReturnType === undefined) {
        this.fail("return 文は関数の中でのみ使用できます");
      }

      const valueType =
        node.expr === undefined ? "void" : node.expr.accept(this);
      if (valueType !== this.currentReturnType) {
        this.fail(
          `関数は ${this.currentReturnType} 型を返す必要がありますが、${valueType} 型が返されました`,
        );
      }

      return "void";
    });
  }

  private buildParamSymbols(params: readonly ParamNode[]): VariableSymbol[] {
    const symbols: VariableSymbol[] = [];
    const names = new Set<string>();

    for (const param of params) {
      if (names.has(param.name)) {
        this.fail(`引数 ${param.name} は既に宣言済みです`);
      }
      names.add(param.name);
      symbols.push({
        name: param.name,
        type: this.valueType(param.type),
      });
    }

    return symbols;
  }

  private hasGuaranteedReturn(statements: readonly AstNode[]): boolean {
    for (const statement of statements) {
      if (statement instanceof ReturnNode) {
        return true;
      }
      if (
        statement instanceof IfNode &&
        statement.falseStatement !== undefined &&
        this.hasGuaranteedReturn(statement.trueStatement) &&
        this.hasGuaranteedReturn(statement.falseStatement)
      ) {
        return true;
      }
    }

    return false;
  }

  private analyzeDomain(domain: DomainNode, owner: string): void {
    const maxType = domain.max.accept(this);
    const minType = domain.min.accept(this);

    if (!this.isNumeric(maxType) || !this.isNumeric(minType)) {
      this.fail(`${owner} の定義域には数値型を指定してください`);
    }
  }

  private returnType(returnType: ReturnTypeNode): SemanticType {
    return this.valueType(returnType.type);
  }

  private valueType(type: string): SemanticType {
    if (
      type === "int" ||
      type === "float" ||
      type === "string" ||
      type === "bool" ||
      type === "void" ||
      this.isArrayType(type)
    ) {
      return type;
    }

    this.fail(`型 ${type} は存在しません`);
  }

  private assertNumeric(type: SemanticType, message: string): void {
    if (!this.isNumeric(type)) {
      this.fail(message);
    }
  }

  private isNumeric(type: SemanticType): boolean {
    return type === "int" || type === "float";
  }

  private isScalarType(type: SemanticType): type is ScalarValueType {
    return (
      type === "int" || type === "float" || type === "string" || type === "bool"
    );
  }

  private isArrayType(
    type: string,
  ): type is `${"int" | "float" | "string" | "bool"}[]` {
    return (
      type === "int[]" ||
      type === "float[]" ||
      type === "string[]" ||
      type === "bool[]"
    );
  }

  private arrayType(elementType: ScalarValueType): ArrayValueType {
    return `${elementType}[]`;
  }

  private arrayElementType(type: SemanticType): SemanticType {
    if (!this.isArrayType(type)) {
      this.fail(`${type} 型は配列型ではありません`);
    }
    return type.slice(0, -2) as SemanticType;
  }

  private findVariable(name: string): VariableSymbol | undefined {
    const current = this.currentScope().variables.get(name);
    if (current !== undefined) {
      return current;
    }

    if (this.scopes.length <= 1) {
      return undefined;
    }

    return this.scopes[0].variables.get(name);
  }

  private currentScope(): SemanticScope {
    return this.scopes[this.scopes.length - 1];
  }

  private withFrame<T>(node: AstNode, label: string, run: () => T): T {
    this.frames.push({ label, location: node.location });
    try {
      return run();
    } catch (error) {
      if (error instanceof BoqqiSemanticError) {
        throw error;
      }

      const message = error instanceof Error ? error.message : String(error);
      this.fail(message);
    } finally {
      this.frames.pop();
    }
  }

  private fail(message: string): never {
    throw new BoqqiSemanticError(message, [...this.frames]);
  }
}
