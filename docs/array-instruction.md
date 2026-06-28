# 配列仕様

BoQQI の配列は固定長です。宣言時に要素型と配列長を指定し、宣言後は添え字を使って要素ごとに代入・参照します。

## 宣言

```txt
int[3]{max: 100, min: 0} counts;
float[4]{max: 1.0, min: 0.0} rates;
string[2] names;
bool[2] flags;
```

配列長は型名の直後の `[]` に整数で指定します。
配列は宣言時に各要素が要素型のデフォルト値で初期化されます。デフォルト値は `int` / `float` が `0`、`string` が空文字、`bool` が `false` です。

数値配列では、スカラーの `int` / `float` と同じように定義域を書きます。定義域は配列全体ではなく各要素に適用されます。
宣言時のデフォルト値も定義域チェックの対象です。

```txt
int[3]{max: 100, min: 0} counts;

counts[0] = 0;
counts[1] = 50;
counts[2] = 100;
```

たとえば `int[3]{max: 100, min: 1} counts;` は、初期値 `0` が定義域外になるため実行時エラーになります。

## 要素代入

配列には添え字を指定して要素単位で代入します。

```txt
counts[0] = 10;
counts[1] = counts[0] + 5;
```

添え字は `int` 型である必要があります。実行時に添え字が `0` 未満、または配列長以上の場合は範囲外エラーになります。

数値配列の要素代入では、宣言時の定義域もチェックされます。

```txt
int[3]{max: 100, min: 0} counts;

counts[0] = 101; // 実行時エラー
```

## 要素参照

配列要素は式の中で参照できます。

```txt
int[3]{max: 100, min: 0} counts;
int{max: 100, min: 0} total = 0;

counts[0] = 10;
counts[1] = 20;
total = counts[0] + counts[1];
print(total);
```

`array[index]` の結果型は配列の要素型です。

## 禁止している操作

現状では宣言はトップレベルまたは関数本体にのみ書けます。`if` / `while` ブロックの中で配列を宣言することはできません。

配列リテラルは使えません。

```txt
[1, 2, 3] // NG
```

配列の一括初期化はできません。

```txt
int[3]{max: 100, min: 0} counts = [1, 2, 3]; // NG
```

配列変数への一括代入はできません。

```txt
int[3]{max: 100, min: 0} counts;

counts = [1, 2, 3]; // NG
```

配列を関数の戻り値型には指定できません。

```txt
function values(): int[3] { // NG
  return [1, 2, 3];
}
```

配列を関数の引数型には指定できません。

```txt
function sum(int[3] values): int{max: 100, min: 0} { // NG
  return 0;
}
```

配列の要素型に配列型は指定できません。

```txt
int[2][3] matrix; // NG
```

## VM 上の対応

配列関連の主な VM 命令は以下です。

| opcode          | 説明                                                  |
| --------------- | ----------------------------------------------------- |
| `DECLARE_ARRAY` | 固定長配列を連続した local slot として宣言する        |
| `LOAD_INDEX`    | `baseSlot + index` の local slot から配列要素を読む   |
| `STORE_INDEX`   | `baseSlot + index` の local slot へ配列要素を書き込む |

固定長配列は配列値としてスタックに積まれません。たとえば `int[3] counts` は `counts[0]`, `counts[1]`, `counts[2]` に対応する 3 つの local slot として確保されます。
