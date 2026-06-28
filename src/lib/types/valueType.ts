export type ScalarValueType = "int" | "float" | "string" | "bool";
export type ArrayValueType = `${ScalarValueType}[]`;
export type ValueType = ScalarValueType | ArrayValueType | "void";
export type RuntimeValueType = ScalarValueType | "void";

export function isScalarType(type: string): type is ScalarValueType {
  return (
    type === "int" || type === "float" || type === "string" || type === "bool"
  );
}

export function isArrayType(type: string): type is ArrayValueType {
  return (
    type === "int[]" ||
    type === "float[]" ||
    type === "string[]" ||
    type === "bool[]"
  );
}

export function isValueType(type: string): type is ValueType {
  return type === "void" || isScalarType(type) || isArrayType(type);
}

export function parseValueType(type: string): ValueType | undefined {
  return isValueType(type) ? type : undefined;
}

export function assertValueType(type: string): ValueType {
  const parsed = parseValueType(type);
  if (parsed === undefined) {
    throw new Error(`型 ${type} は存在しません`);
  }
  return parsed;
}

export function arrayElementType(type: ArrayValueType): ScalarValueType {
  return type.slice(0, -2) as ScalarValueType;
}

export function isNumericType(type: ValueType): type is "int" | "float" {
  return type === "int" || type === "float";
}

export function isNumericArrayType(
  type: ValueType,
): type is "int[]" | "float[]" {
  return type === "int[]" || type === "float[]";
}
