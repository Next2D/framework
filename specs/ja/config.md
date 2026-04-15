# 設定ファイル

Next2D Frameworkの設定は3つのJSONファイルで管理します。

## ファイル構成

```
src/config/
├── stage.json     # 表示領域の設定
├── config.json    # 環境設定
└── routing.json   # ルーティング設定
```

---

## stage.json

表示領域（Stage）の設定を行うJSONファイルです。アプリ起動時に一度だけ読み込まれ、Stageの初期パラメータとして使用されます。

```json
{
    "width": 1920,
    "height": 1080,
    "fps": 60,
    "options": {
        "fullScreen": true,
        "tagId": null,
        "bgColor": "transparent"
    }
}
```

### プロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|------|----------|------|
| `width` | number | 240 | 表示領域の幅（ピクセル単位）。実際の描画キャンバスの基準幅として使用される |
| `height` | number | 240 | 表示領域の高さ（ピクセル単位）。実際の描画キャンバスの基準高さとして使用される |
| `fps` | number | 60 | 1秒間の描画回数。指定可能な範囲は 1〜60 |
| `options` | object | null | 追加オプション設定。省略可能 |

### options 設定

| プロパティ | 型 | デフォルト | 説明 |
|-----------|------|----------|------|
| `fullScreen` | boolean | false | `true` にするとウィンドウ全体にStageを拡張して描画する。`false` の場合は `width`・`height` で指定したサイズで固定描画 |
| `tagId` | string \| null | null | 描画先とするHTML要素のID。指定したIDのエレメント内部にキャンバスが生成される。`null` の場合は `<body>` 直下に生成される |
| `bgColor` | string | "transparent" | 背景色を16進数カラーコードで指定（例: `"#1461A0"`）。`"transparent"` を指定すると透明になる |

> [!WARNING]
> `stage.json` で有効なプロパティは上記の `width`・`height`・`fps`・`options` のみです。
> `align`・`scaleMode` などステージ表示に関わる設定であっても、`stage.json` には存在しないプロパティです。
> これらの設定が必要な場合は `config.json` に記述してください。
> 上記以外のプロパティを記述しても、フレームワークは一切処理しません。

---

## config.json

環境ごとの設定を管理するファイルです。ビルド時に `--env` オプションで指定した環境名のオブジェクトと `all` オブジェクトがマージされ、アプリケーション全体で参照可能な設定として展開されます。

```json
{
    "local": {
        "api": {
            "endPoint": "http://localhost:3000/"
        },
        "content": {
            "endPoint": "http://localhost:5500/"
        }
    },
    "dev": {
        "api": {
            "endPoint": "https://dev-api.example.com/"
        }
    },
    "prd": {
        "api": {
            "endPoint": "https://api.example.com/"
        }
    },
    "all": {
        "spa": true,
        "defaultTop": "top",
        "loading": {
            "callback": "Loading"
        },
        "gotoView": {
            "callback": ["callback.Background"]
        }
    }
}
```

### 環境キーの仕様

`local`・`dev`・`stg`・`prd` などのキー名は任意です（`all` を除く）。ビルド時に `--env=<環境名>` で一致したキーのオブジェクトが読み込まれます。

| キー | 説明 |
|------|------|
| `all` | すべての環境で共通して読み込まれる設定 |
| それ以外 | `--env` で指定した環境名と一致したときのみ読み込まれる設定 |

### all 設定（フレームワーク予約済みプロパティ）

以下のプロパティはフレームワークが自動的に処理します。

| プロパティ | 型 | デフォルト | 説明 |
|-----------|------|----------|------|
| `spa` | boolean | true | `true` にするとSingle Page Applicationとして動作し、ブラウザのURLと連動してView遷移を管理する |
| `defaultTop` | string | "top" | アプリ起動時に最初に表示するViewの名前。指定しない場合は `TopView` クラスが起動する |
| `loading.callback` | string | "Loading" | ローディング画面として使用するクラス名。そのクラスの `start()` と `end()` が自動的に呼び出される |
| `gotoView.callback` | string \| string[] | — | View遷移完了後に呼び出すコールバッククラス名。配列で複数指定でき、async/awaitで順次実行される |

### ユーザー定義プロパティ

フレームワークの予約済みプロパティ以外に、任意のプロパティをどの環境キーにも追加できます。追加したプロパティはビルド後に `config` オブジェクトから参照できます。

エンドポイントURLや機能フラグ、表示設定など、環境ごとに変える必要がある値をここで管理します。

```json
{
    "local": {
        "api": {
            "endPoint": "http://localhost:3000/"
        }
    },
    "prd": {
        "api": {
            "endPoint": "https://api.example.com/"
        }
    },
    "all": {
        "spa": true,
        "defaultTop": "top",
        "align": "TL",
        "scaleMode": "noScale"
    }
}
```

```typescript
import { config } from "@/config/Config";

// ユーザー定義プロパティへのアクセス
const align     = config.align;     // "TL"
const scaleMode = config.scaleMode; // "noScale"
```

> [!WARNING]
> `config.json` でフレームワークが自動処理するプロパティは `spa`・`defaultTop`・`loading`・`gotoView` のみです。
> それ以外のプロパティはフレームワークが直接処理することはありませんが、`config` オブジェクト経由でアプリケーションコードから自由に参照できます。

### platform 設定

ビルド時の `--platform` で指定した値が自動的にセットされます。設定ファイルに記述する必要はなく、読み取り専用です。

対応値: `macos`, `windows`, `linux`, `ios`, `android`, `web`

```typescript
import { config } from "@/config/Config";

if (config.platform === "ios") {
    // iOS固有の処理
}
```

---

## routing.json

ルーティングの設定ファイルです。詳細は[ルーティング](/ja/reference/framework/routing)を参照してください。

```json
{
    "top": {
        "requests": [
            {
                "type": "json",
                "path": "{{api.endPoint}}api/top.json",
                "name": "TopText"
            }
        ]
    },
    "home": {
        "requests": []
    }
}
```

---

## 設定値の取得

`Config.ts` は `npm start` 実行時に自動生成されるファイルです。手動で作成・編集する必要はありません。

コード内で設定値を取得するには、自動生成された `config` オブジェクトをインポートして使用します。

### 使用例

```typescript
import { config } from "@/config/Config";

// ステージ設定
const stageWidth  = config.stage.width;
const stageHeight = config.stage.height;

// API設定
const apiEndPoint = config.api.endPoint;

// SPA設定
const isSpa = config.spa;
```

---

## ローディング画面

`loading.callback` で設定したクラスの `start()` と `end()` が自動的に呼び出されます。

```typescript
export class Loading
{
    private shape: Shape;

    constructor()
    {
        this.shape = new Shape();
        // ローディング表示の初期化
    }

    start(): void
    {
        // ローディング開始時の処理
        stage.addChild(this.shape);
    }

    end(): void
    {
        // ローディング終了時の処理
        this.shape.remove();
    }
}
```

---

## gotoView コールバック

`gotoView.callback` で設定したクラスの `execute()` が呼び出されます。配列で複数のクラスを指定でき、async/await で順次実行されます。

```typescript
import { app } from "@next2d/framework";
import { Shape, stage } from "@next2d/display";

export class Background
{
    public readonly shape: Shape;

    constructor()
    {
        this.shape = new Shape();
    }

    execute(): void
    {
        const context = app.getContext();
        const view = context.view;
        if (!view) return;

        // 背景を最背面に配置
        view.addChildAt(this.shape, 0);
    }
}
```

---

## ビルドコマンド

環境を指定してビルド:

```bash
# ローカル環境
npm run build -- --env=local

# 開発環境
npm run build -- --env=dev

# 本番環境
npm run build -- --env=prd
```

プラットフォームを指定:

```bash
npm run build -- --platform=web
npm run build -- --platform=ios
npm run build -- --platform=android
```

---

## 設定例

### 完全な設定ファイルの例

#### stage.json

```json
{
    "width": 1920,
    "height": 1080,
    "fps": 60,
    "options": {
        "fullScreen": true,
        "tagId": null,
        "bgColor": "#1461A0"
    }
}
```

#### config.json

```json
{
    "local": {
        "api": {
            "endPoint": "http://localhost:3000/"
        },
        "content": {
            "endPoint": "http://localhost:5500/mock/content/"
        }
    },
    "dev": {
        "api": {
            "endPoint": "https://dev-api.example.com/"
        },
        "content": {
            "endPoint": "https://dev-cdn.example.com/content/"
        }
    },
    "prd": {
        "api": {
            "endPoint": "https://api.example.com/"
        },
        "content": {
            "endPoint": "https://cdn.example.com/content/"
        }
    },
    "all": {
        "spa": true,
        "defaultTop": "top",
        "loading": {
            "callback": "Loading"
        },
        "gotoView": {
            "callback": ["callback.Background"]
        },
        "align": "TL",
        "scaleMode": "noScale"
    }
}
```

---

## 関連項目

- [ルーティング](/ja/reference/framework/routing)
- [View/ViewModel](/ja/reference/framework/view)
