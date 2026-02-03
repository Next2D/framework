# 設定ファイル（config.json）

Next2D Frameworkの設定はconfig.jsonで管理します。

## 基本構造

```json
{
  "stage": {
    "width": 1920,
    "height": 1080,
    "fps": 60,
    "options": {}
  },
  "router": {
    "mode": "history"
  },
  "routing": {
    "top": {
      "path": "/",
      "view": "TopView"
    }
  },
  "content": {
    "base": "/asset/"
  },
  "loading": {
    "callback": "loadingCallback"
  }
}
```

## stage設定

ステージ（Canvas）の設定：

| プロパティ | 型 | デフォルト | 説明 |
|-----------|------|----------|------|
| width | Number | 240 | ステージ幅 |
| height | Number | 240 | ステージ高さ |
| fps | Number | 60 | フレームレート |
| options | Object | {} | 追加オプション |

### optionsの詳細

```json
{
  "stage": {
    "width": 1920,
    "height": 1080,
    "fps": 60,
    "options": {
      "bgColor": "#000000",
      "fullScreen": true,
      "tagId": "canvas-container",
      "base": "http://example.com/"
    }
  }
}
```

| プロパティ | 説明 |
|-----------|------|
| bgColor | 背景色 |
| fullScreen | フルスクリーンモード |
| tagId | Canvasを配置するDOM要素のID |
| base | ベースURL |

## router設定

ルーティングの動作設定：

```json
{
  "router": {
    "mode": "history"
  }
}
```

| プロパティ | 値 | 説明 |
|-----------|------|------|
| mode | "history" | HTML5 History API使用（推奨） |
| mode | "hash" | ハッシュベースのルーティング |

## routing設定

各ルートの定義：

```json
{
  "routing": {
    "routeName": {
      "path": "/path/{param}",
      "view": "ViewClassName",
      "viewModel": "ViewModelClassName",
      "transition": {
        "type": "fade",
        "duration": 0.3
      },
      "content": "content.json",
      "private": false
    }
  }
}
```

| プロパティ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| path | String | ○ | URLパス |
| view | String | ○ | Viewクラス名 |
| viewModel | String |  | ViewModelクラス名 |
| transition | Object |  | 遷移アニメーション |
| content | String |  | コンテンツJSONファイル |
| private | Boolean |  | 認証必要フラグ |

## content設定

コンテンツの読み込み設定：

```json
{
  "content": {
    "base": "/asset/",
    "cache": true
  }
}
```

| プロパティ | 説明 |
|-----------|------|
| base | コンテンツのベースパス |
| cache | キャッシュを使用するか |

## loading設定

ローディング中の処理：

```json
{
  "loading": {
    "callback": "loadingCallback",
    "defaultPercent": 10
  }
}
```

グローバル関数を定義：

```typescript
window.loadingCallback = (percent: number): void => {
    console.log(`ロード中: ${percent}%`);
    // ローディングバーの更新など
};
```

## 環境変数

環境ごとに設定を切り替える：

```json
// config.json
{
  "development": {
    "stage": { "width": 800, "height": 600 },
    "api": { "base": "http://localhost:3000" }
  },
  "production": {
    "stage": { "width": 1920, "height": 1080 },
    "api": { "base": "https://api.example.com" }
  }
}
```

ビルド時に環境を指定：

```bash
npm run build -- --env=production
```

## 複数設定ファイル

機能ごとに分割することも可能：

```
config/
├── config.json       # メイン設定
├── routing.json      # ルーティング設定
└── stage.json        # ステージ設定
```

メイン設定でインポート：

```json
{
  "$import": {
    "routing": "./routing.json",
    "stage": "./stage.json"
  }
}
```

## 設定値の取得

コード内で設定値を取得：

```typescript
import { config } from "@next2d/framework";

// ステージ設定
const stageWidth = config.stage.width;

// カスタム設定
const apiBase = config.api.base;
```

## 関連項目

- [ルーティング](./routing.md)
- [View/ViewModel](./view.md)
