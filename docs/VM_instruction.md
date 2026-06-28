# VM 命令一覧

| opcode          | operand                                                                                                | 説明                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `PUSH_INT`      | `value: number`                                                                                        | `int` 値をスタックに積む                                                                             |
| `PUSH_FLOAT`    | `value: number`                                                                                        | `float` 値をスタックに積む                                                                           |
| `PUSH_STRING`   | `value: string`                                                                                        | `string` 値をスタックに積む                                                                          |
| `PUSH_BOOL`     | `value: boolean`                                                                                       | `bool` 値をスタックに積む                                                                            |
| `PUSH_VOID`     | なし                                                                                                   | `void` 値をスタックに積む                                                                            |
| `LOAD`          | `slot: number`, `name: string`, `scope: "local" \| "global"`                                           | 指定したスコープの変数を読み出してスタックに積む                                                     |
| `STORE`         | `slot: number`, `name: string`, `scope: "local" \| "global"`                                           | スタックから値を取り出し、指定したスコープの変数へ代入する                                           |
| `DECLARE`       | `slot: number`, `name: string`, `type: ValueType`, `hasDomain: boolean`                                | ローカル変数を宣言し、スタック上の初期値を保存する。`hasDomain` が `true` の場合は範囲チェックも行う |
| `DECLARE_ARRAY` | `slot: number`, `name: string`, `elementType: ScalarValueType`, `length: number`, `hasDomain: boolean` | 固定長配列を連続した local slot として宣言する。`slot` は先頭要素の slot                             |
| `CHECK_LOCAL`   | `slot: number`, `name: string`, `type: ValueType`, `hasDomain: boolean`                                | 既存のローカル変数を検査する。主に関数引数の domain チェックに使う                                   |
| `ADD`           | なし                                                                                                   | スタックから 2 値を取り出して加算し、結果を積む                                                      |
| `SUB`           | なし                                                                                                   | スタックから 2 値を取り出して減算し、結果を積む                                                      |
| `MUL`           | なし                                                                                                   | スタックから 2 値を取り出して乗算し、結果を積む                                                      |
| `DIV`           | なし                                                                                                   | スタックから 2 値を取り出して除算し、結果を積む                                                      |
| `MOD`           | なし                                                                                                   | スタックから 2 値を取り出して剰余を計算し、結果を積む                                                |
| `EQ`            | なし                                                                                                   | スタックから 2 値を取り出し、`==` の結果を `bool` で積む                                             |
| `NE`            | なし                                                                                                   | スタックから 2 値を取り出し、`!=` の結果を `bool` で積む                                             |
| `GT`            | なし                                                                                                   | スタックから 2 値を取り出し、`>` の結果を `bool` で積む                                              |
| `LT`            | なし                                                                                                   | スタックから 2 値を取り出し、`<` の結果を `bool` で積む                                              |
| `GE`            | なし                                                                                                   | スタックから 2 値を取り出し、`>=` の結果を `bool` で積む                                             |
| `LE`            | なし                                                                                                   | スタックから 2 値を取り出し、`<=` の結果を `bool` で積む                                             |
| `LOAD_INDEX`    | `slot: number`, `name: string`, `scope: "local" \| "global"`, `length: number`                         | スタックから添え字を取り出し、`slot + index` の local slot から配列要素を読む                        |
| `STORE_INDEX`   | `slot: number`, `name: string`, `scope: "local" \| "global"`, `length: number`                         | スタックから値と添え字を取り出し、`slot + index` の local slot へ配列要素を書き込む                  |
| `JUMP`          | `target: number`                                                                                       | `pc` を `target` に移動する                                                                          |
| `JUMP_IF_FALSE` | `target: number`                                                                                       | スタックから条件値を取り出し、`true` でなければ `pc` を `target` に移動する                          |
| `WRITE`         | `newline: boolean`                                                                                     | スタックから値を取り出して出力する。`newline` が `true` の場合は末尾に改行を付ける                   |
| `SCAN`          | `valueType: ScalarValueType`                                                                           | 標準入力から `valueType` の値を 1 つ読み、スタックに積む                                             |
| `CALL`          | `name: string`, `argc: number`                                                                         | 関数を呼び出す。スタック上の `argc` 個の値を引数として使い、戻り値を積む                             |
| `RETURN`        | なし                                                                                                   | 現在の関数から戻る。スタック上の戻り値を呼び出し元へ返す                                             |
| `POP`           | なし                                                                                                   | スタックの先頭値を捨てる                                                                             |

各命令には任意で `location: { line: number, column: number }` が付く。実行時エラーの表示では、この位置情報を使って元のソース位置を示す。

`ScalarValueType` は `"int" | "float" | "string" | "bool"`。
`ValueType` は `"int" | "float" | "string" | "bool" | "int[]" | "float[]" | "string[]" | "bool[]" | "void"`。

## Bytecode JSON

`boqqi compile` は次の形の JSON を標準出力に出す。

```ts
{
  instructions: Instruction[];
  functions: CompiledFunction[];
  globalLocalCount: number;
}
```

`CompiledFunction` は関数呼び出しに必要なメタ情報を持つ。

```ts
{
  name: string;
  entryPc: number;
  arity: number;
  localCount: number;
  params: {
    name: string;
    slot: number;
    type: ValueType;
    hasDomain: boolean;
  }[];
  returnType: ValueType;
  hasReturnDomain: boolean;
}
```

VM 内では `functions` は `Map<string, CompiledFunction>` として扱う。JSON では `Map` を直接表現できないため、配列として保存する。

## スタックと local slot

VM はスタックマシンとして動作する。式の評価結果、関数引数、戻り値、domain の `max` / `min` はスタック経由で受け渡す。

変数は call frame 内の local slot に保存する。関数内からグローバル変数を参照する場合、`scope: "global"` の `LOAD` / `STORE` / `LOAD_INDEX` / `STORE_INDEX` がグローバル frame を参照する。

固定長配列は配列値としてスタックに積まない。`DECLARE_ARRAY` は `slot` から `length` 個の連続した local slot を確保し、各要素を `name[index]` として保存する。
配列宣言時には、要素型のデフォルト値を要素数分スタックへ積んでから `DECLARE_ARRAY` を実行する。

## domain チェック

domain は `max`、`min` の順にコンパイルされ、VM では命令実行時にスタックから `min`、`max` の順に取り出して `DomainSpec` を作る。

- `DECLARE`: 初期値が domain 内にあるか検査してから local slot に保存する。
- `DECLARE_ARRAY`: 各初期要素が domain 内にあるか検査してから連続 local slot に保存する。
- `CHECK_LOCAL`: 主に関数引数の domain チェックに使う。
- `STORE` / `STORE_INDEX`: 宣言時に local slot に保存された domain を使って代入値を検査する。
- `RETURN`: 戻り値型に domain がある場合、戻り値を検査する。

## 境界値テストモード

`boqqi run --max-test` / `boqqi run --min-test` では、各関数を一度ずつ境界値ケースで実行してから、main 相当のトップレベル処理を実行する。`--max-test` と `--min-test` は同時に指定できない。

関数単体の境界値テストでは、いったん引数型ごとのデフォルト値を積んで関数を呼び出す。その関数実体で最初に `CHECK_LOCAL` された domain 付き `int` / `float` 引数だけ、`--max-test` では `domain.max`、`--min-test` では `domain.min` に置き換える。同じ関数名は再帰呼び出しを含めて 1 回だけ引数置換の対象になる。

main 相当のトップレベル処理も通常通り実行する。domain 付きの `int` / `float` 変数または配列要素を宣言するときは、`--max-test` では `domain.max`、`--min-test` では `domain.min` に置き換えて保存する。

宣言時・代入時・関数引数・戻り値の範囲チェックは通常通り行うため、計算済みの値が対象 domain を超える場合は実行時エラーになる。
このモードではプログラムの `WRITE` 出力は抑制され、境界値を代入したタイミングを `[max-test] name <- value` または `[min-test] name <- value` 形式のログとして標準出力に出力する。
関数テストは `test of name():`、トップレベル処理は `test of main:` の見出しで出力する。

このモードは境界方向の代表値テストであり、分岐を含む全経路を網羅するものではない。
