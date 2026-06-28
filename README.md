# BoQQI

BoQQI (Bounded Qualified Query Interpreter) は、CS 特別講義 A の課題として作成している小さなプログラミング言語処理系です。  
ANTLR による字句解析・構文解析、AST 生成、意味解析、インタプリタ実行、バイトコード生成と VM 実行までを TypeScript で実装しています。

## Features

- `int` / `float` / `string` / `bool` / `void` の型をサポート
- `int[3]` などの固定長配列と `array[index]` による添え字アクセス
- 数値型に対する範囲指定 `{max: ..., min: ...}` の記述
- 変数宣言、代入、四則演算、比較演算
- `if` / `else`、`while`
- 関数定義、関数呼び出し、`return`
- 組み込み関数 `print` / `println`
- 標準入力から値を読む `scanInt` / `scanFloat` / `scanString` / `scanBool`
- ソースコードのトークン列、構文木、AST の JSON 出力
- AST からバイトコード JSON へのコンパイル
- バイトコード JSON を実行する VM

## Requirements

- Node.js 20 以上
- npm

## Setup

※ このリポジトリをクローンした後

```sh
npm i
npm run build
npm link
```

## Usage

`samples/sum.txt` を実行します。

```txt
function sum(int{max: 1000, min: 0} n): int{max: 1000000, min: 0} {
  if (n == 0) {
    return 0;
  }
  return n + sum(n - 1);
}

int{max: 100000000000, min: 10} a = 30;

println(sum(a));
```

サンプルプログラムをインタプリタで実行します。

```sh
boqqi interprete samples/sum.txt
```

出力例:

```txt
465
```

ソースコードをバイトコード JSON にコンパイルします。
コンパイル後の bytecode は、json 形式で標準出力に出力されます。

```sh
# out/ は作成されている前提
boqqi compile samples/sum.txt > out/sum.json
boqqi run out/sum.json
```

出力例:

```txt
465
```

## Commands

```txt
boqqi lex <file>         トークン列を JSON で出力
boqqi parse <file>       構文解析結果を JSON で出力
boqqi ast-dump <file>    AST を JSON で出力
boqqi interprete <file>  ソースコードを直接実行
boqqi compile <file>     ソースコードをバイトコード JSON に変換
boqqi run <file>         バイトコード JSON を VM で実行
```

`boqqi run` には、定義域付きの数値を境界値ケースで実行する `--max-test` / `--min-test` オプションがあります。

```sh
boqqi compile samples/comp.txt > out/comp.json
boqqi run out/comp.json --max-test
boqqi run out/comp.json --min-test
```

`--max-test` と `--min-test` は同時に指定できません。各関数を一度ずつ境界値ケースで実行してから、main 相当のトップレベル処理を実行します。domain 付きの `int` / `float` 変数または配列要素を宣言するときと、関数実体を最初に実行するときの domain 付き引数に、`--max-test` では `domain.max`、`--min-test` では `domain.min` を採用し、その値を以降の VM 実行へ流します。このモードではプログラムの標準出力は抑制され、境界値を代入したタイミングが `[max-test] name <- value` または `[min-test] name <- value` 形式のテストログとして出力されます。関数テストは `test of name():`、トップレベル処理は `test of main:` の見出しで出力されます。境界方向の代表値テストであり、全経路の完全な値安全証明ではありません。

## Development

```sh
npm run gen:parser   # grammar/*.g4 から parser を生成
npm run typecheck    # TypeScript の型チェック
npm run lint         # ESLint / Prettier / typecheck
npm run build        # dist/ にビルド
```

## Project Structure

```console
BoQQI/
├── grammar/                   # ANTLR grammar
└── src/
    ├── index.ts               # CLI entry point
    ├── commands/              # CLI subcommands
    └── lib/
        ├── lexer/             # tokenizer
        ├── parser/            # parser and generated parser files
        ├── ast/               # AST nodes and AST builder
        ├── vm/                # bytecode VM
        └── visitor/
            ├── compiler/
            ├── interpreter/
            └── semantics/     # semantic analyzer
```

## Notes

このリポジトリは授業課題用の実装です。言語仕様や VM 命令セットは開発途中のため、今後変更される可能性があります。
