import { ValuableValue } from "./valuableValue.js";

export type RuntimeValue =
  | ValuableValue<number>
  | ValuableValue<boolean>
  | ValuableValue<string>
  | ValuableValue<ValuableValue<unknown>[]>
  | ValuableValue<undefined>;
