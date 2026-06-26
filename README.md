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
- 組み込み関数 `print`
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

`samples/add.txt` を実行します。

```txt
int{max: 100, min: 0} x = 10;
int{max: 100, min: 0} y = 20;

if (x < y) {
  print(x + y);
}
```

サンプルプログラムをインタプリタで実行します。

```sh
boqqi interprete samples/add.txt
```

出力例:

```txt
30
```

ソースコードをバイトコード JSON にコンパイルします。
コンパイル後の bytecode は、json 形式で標準出力に出力されます。

```sh
# out/ は作成されている前提
boqqi compile samples/add.txt > out/add.json
boqqi run out/add.json
```

出力例:

```txt
30
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
