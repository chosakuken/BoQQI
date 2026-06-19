# VM 命令一覧

| opcode | operand | 説明 |
| --- | --- | --- |
| `PUSH_INT` | `value: number` | `int` 値をスタックに積む |
| `PUSH_FLOAT` | `value: number` | `float` 値をスタックに積む |
| `PUSH_STRING` | `value: string` | `string` 値をスタックに積む |
| `PUSH_BOOL` | `value: boolean` | `bool` 値をスタックに積む |
| `PUSH_VOID` | なし | `void` 値をスタックに積む |
| `LOAD` | `slot: number`, `name: string`, `scope: "local" \| "global"` | 指定したスコープのローカル変数を読み出してスタックに積む |
| `STORE` | `slot: number`, `name: string`, `scope: "local" \| "global"` | スタックから値を取り出し、指定したスコープのローカル変数へ代入する |
| `DECLARE` | `slot: number`, `name: string` | ローカル変数を宣言し、スタック上の初期値を保存する |
| `ASSERT_DOMAIN` | `name: string`, `kind: "variable" \| "parameter" \| "return"` | スタック上の `value`, `max`, `min` を取り出して定義域チェックを行い、成功時は `value` を積み直す |
| `ADD` | なし | スタックから 2 値を取り出して加算し、結果を積む |
| `SUB` | なし | スタックから 2 値を取り出して減算し、結果を積む |
| `MUL` | なし | スタックから 2 値を取り出して乗算し、結果を積む |
| `DIV` | なし | スタックから 2 値を取り出して除算し、結果を積む |
| `MOD` | なし | スタックから 2 値を取り出して剰余を計算し、結果を積む |
| `EQ` | なし | スタックから 2 値を取り出し、`==` の結果を `bool` で積む |
| `NE` | なし | スタックから 2 値を取り出し、`!=` の結果を `bool` で積む |
| `GT` | なし | スタックから 2 値を取り出し、`>` の結果を `bool` で積む |
| `LT` | なし | スタックから 2 値を取り出し、`<` の結果を `bool` で積む |
| `GE` | なし | スタックから 2 値を取り出し、`>=` の結果を `bool` で積む |
| `LE` | なし | スタックから 2 値を取り出し、`<=` の結果を `bool` で積む |
| `JUMP` | `target: number` | `pc` を `target` に移動する |
| `JUMP_IF_FALSE` | `target: number` | スタックから条件値を取り出し、`true` でなければ `pc` を `target` に移動する |
| `CALL` | `name: string`, `argc: number` | 関数を呼び出す。スタック上の `argc` 個の値を引数として使い、戻り値を積む |
| `RETURN` | なし | 現在の関数から戻る。スタック上の戻り値を呼び出し元へ返す |
| `POP` | なし | スタックの先頭値を捨てる |

`ValueType` は `"int" | "float" | "string" | "bool" | "void"`。
