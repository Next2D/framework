# AnimationTool連携

Next2D FrameworkはAnimationToolで作成したアセットとシームレスに連携できます。

## 概要

AnimationToolは、Next2D Player用のアニメーションやUIコンポーネントを作成するためのツールです。出力されたJSONファイルをフレームワークで読み込み、MovieClipとして利用できます。

## ディレクトリ構成

```
src/
├── ui/
│   ├── content/              # Animation Tool生成コンテンツ
│   │   ├── TopContent.ts
│   │   └── HomeContent.ts
│   │
│   ├── component/            # Atomic Designコンポーネント
│   │   ├── atom/             # 最小単位のコンポーネント
│   │   │   ├── ButtonAtom.ts
│   │   │   └── TextAtom.ts
│   │   ├── molecule/         # Atomを組み合わせたコンポーネント
│   │   │   ├── TopBtnMolecule.ts
│   │   │   └── HomeBtnMolecule.ts
│   │   ├── organism/         # 複数Moleculeの組み合わせ
│   │   ├── template/         # ページテンプレート
│   │   └── page/             # ページコンポーネント
│   │       ├── top/
│   │       │   └── TopPage.ts
│   │       └── home/
│   │           └── HomePage.ts
│   │
│   └── animation/            # コードアニメーション定義
│       └── top/
│           └── TopBtnShowAnimation.ts
│
└── file/                     # Animation Tool出力ファイル
    └── sample.n2d
```

## MovieClipContent

Animation Toolで作成したコンテンツをラップするクラスです。

### 基本構造

```typescript
import { MovieClipContent } from "@next2d/framework";

/**
 * @see file/sample.n2d
 */
export class TopContent extends MovieClipContent
{
    /**
     * Animation Tool上で設定したシンボル名を返す
     */
    get namespace(): string
    {
        return "TopContent";
    }
}
```

### namespaceの役割

`namespace`プロパティは、Animation Toolで作成したシンボルの名前と一致させます。この名前を使って、読み込まれたJSONデータから対応するMovieClipが生成されます。

## コンテンツの読み込み

### routing.jsonでの設定

Animation ToolのJSONファイルは`routing.json`の`requests`で読み込みます。

```json
{
    "@sample": {
        "requests": [
            {
                "type": "content",
                "path": "{{ content.endPoint }}content/sample.json",
                "name": "MainContent",
                "cache": true
            }
        ]
    },
    "top": {
        "requests": [
            {
                "type": "cluster",
                "path": "@sample"
            }
        ]
    }
}
```

#### request設定

| プロパティ | 型 | 説明 |
|-----------|------|------|
| `type` | string | `"content"` を指定 |
| `path` | string | JSONファイルへのパス |
| `name` | string | レスポンスに登録されるキー名 |
| `cache` | boolean | キャッシュするかどうか |

#### cluster機能

`@`で始まるキーはクラスターとして定義され、複数のルートで共有できます。`type: "cluster"`で参照します。

```json
{
    "@common": {
        "requests": [
            {
                "type": "content",
                "path": "{{ content.endPoint }}common.json",
                "name": "CommonContent",
                "cache": true
            }
        ]
    },
    "top": {
        "requests": [
            { "type": "cluster", "path": "@common" }
        ]
    },
    "home": {
        "requests": [
            { "type": "cluster", "path": "@common" }
        ]
    }
}
```

## 関連項目

- [View/ViewModel](/ja/reference/framework/view)
- [ルーティング](/ja/reference/framework/routing)
- [設定ファイル](/ja/reference/framework/config)
