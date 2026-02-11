# 設定ファイル

Next2D Frameworkの設定は3つのJSONファイルで管理します。

## ファイル構成

```
src/config/
├── stage.json     # 表示領域の設定
├── config.json    # 環境設定
└── routing.json   # ルーティング設定
```

## stage.json

表示領域（Stage）の設定を行うJSONファイルです。

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
| `width` | number | 240 | 表示領域の幅 |
| `height` | number | 240 | 表示領域の高さ |
| `fps` | number | 60 | 1秒間に何回描画するか（1〜60） |
| `options` | object | null | オプション設定 |

### options設定

| プロパティ | 型 | デフォルト | 説明 |
|-----------|------|----------|------|
| `fullScreen` | boolean | false | Stageで設定した幅と高さを超えて画面全体に描画 |
| `tagId` | string | null | IDを指定すると、指定したIDのエレメント内で描画を行う |
| `bgColor` | string | "transparent" | 背景色を16進数で指定。デフォルトは無色透明 |

## config.json

環境ごとの設定を管理するファイルです。`local`、`dev`、`stg`、`prd`、`all`と区切られており、`all`以外は任意の環境名です。

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

### all設定

`all`はどの環境でも書き出される共通変数です。

| プロパティ | 型 | デフォルト | 説明 |
|-----------|------|----------|------|
| `spa` | boolean | true | Single Page ApplicationとしてURLでシーンを制御 |
| `defaultTop` | string | "top" | ページトップのView。設定がない場合はTopViewクラスが起動 |
| `loading.callback` | string | Loading | ローディング画面のクラス名。start関数とend関数を呼び出す |
| `gotoView.callback` | string \| array | ["callback.Background"] | gotoView完了後のコールバッククラス |

### platform設定

ビルド時の`--platform`で指定した値がセットされます。

対応値: `macos`, `windows`, `linux`, `ios`, `android`, `web`

```typescript
import { config } from "@/config/Config";

if (config.platform === "ios") {
    // iOS固有の処理
}
```

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

## 設定値の取得

コード内で設定値を取得するには`config`オブジェクトを使用します。

### Config.tsの例

```typescript
import stageJson from "./stage.json";
import configJson from "./config.json";

interface IStageConfig {
    width: number;
    height: number;
    fps: number;
    options: {
        fullScreen: boolean;
        tagId: string | null;
        bgColor: string;
    };
}

interface IConfig {
    stage: IStageConfig;
    api: {
        endPoint: string;
    };
    content: {
        endPoint: string;
    };
    spa: boolean;
    defaultTop: string;
    platform: string;
}

export const config: IConfig = {
    stage: stageJson,
    ...configJson
};
```

### 使用例

```typescript
import { config } from "@/config/Config";

// ステージ設定
const stageWidth = config.stage.width;
const stageHeight = config.stage.height;

// API設定
const apiEndPoint = config.api.endPoint;

// SPA設定
const isSpa = config.spa;
```

## ローディング画面

`loading.callback`で設定したクラスの`start`関数と`end`関数が呼び出されます。

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

## gotoViewコールバック

`gotoView.callback`で設定したクラスの`execute`関数が呼び出されます。複数のクラスを配列で設定でき、async/awaitで順次実行されます。

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
        }
    }
}
```

## 関連項目

- [ルーティング](/ja/reference/framework/routing)
- [View/ViewModel](/ja/reference/framework/view)
