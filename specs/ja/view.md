# View と ViewModel

Next2D FrameworkはMVVM（Model-View-ViewModel）パターンを採用しています。

## View

Viewは画面の表示を担当するクラスです。Open Animation Toolで作成したMovieClipをコンテンツとして持ちます。

### 基本構造

```typescript
import { View } from "@next2d/framework";

export class SampleView extends View
{
    constructor()
    {
        super();
    }

    // 非同期の初期設定
    async $setup(): Promise<void>
    {
        // APIからデータを取得など
    }

    // 表示準備完了時
    $ready(): void
    {
        // イベントリスナーの設定など
    }

    // 画面遷移前の破棄処理
    $dispose(): void
    {
        // リソースの解放など
    }
}
```

### ライフサイクル

1. `constructor`: インスタンス生成
2. `$setup()`: 非同期の初期化処理（await可能）
3. `$ready()`: 表示準備完了、イベント設定
4. `$dispose()`: 画面遷移時の破棄処理

### コンテンツへのアクセス

```typescript
$ready(): void
{
    // contentはOpen Animation Toolで作成したMovieClip
    const button = this.content.getChildByName("submitButton");
    button.addEventListener("click", () => {
        this.onSubmit();
    });

    const textField = this.content.getChildByName("nameInput");
    textField.text = "初期値";
}
```

### 画面遷移

```typescript
import { router } from "@next2d/framework";

// 指定パスに遷移
router.push("/about");

// パラメータ付きで遷移
router.push("/detail/123");

// 履歴を置き換え
router.replace("/home");

// 戻る
router.back();
```

## ViewModel

ViewModelはViewのビジネスロジックとデータバインディングを担当します。

### 基本構造

```typescript
import { ViewModel } from "@next2d/framework";

export class SampleViewModel extends ViewModel
{
    private _name: string = "";

    async $setup(): Promise<void>
    {
        // データの初期化
        const response = await fetch("/api/user");
        const data = await response.json();
        this._name = data.name;
    }

    $bind(): void
    {
        // Viewへのデータバインド
        const textField = this.view.content.getChildByName("nameText");
        textField.text = this._name;
    }

    get name(): string
    {
        return this._name;
    }

    set name(value: string)
    {
        this._name = value;
        // UIの更新
        const textField = this.view.content.getChildByName("nameText");
        textField.text = value;
    }
}
```

### ViewとViewModelの連携

config.jsonでの設定：

```json
{
  "routing": {
    "sample": {
      "path": "/sample",
      "view": "SampleView",
      "viewModel": "SampleViewModel"
    }
  }
}
```

View側からViewModelへのアクセス：

```typescript
export class SampleView extends View
{
    $ready(): void
    {
        // ViewModelへの参照
        const vm = this.viewModel as SampleViewModel;

        const button = this.content.getChildByName("updateButton");
        button.addEventListener("click", () => {
            vm.name = "新しい名前";
        });
    }
}
```

## コンポーネントの再利用

### アトミックデザイン

コンポーネントを以下のように分類することを推奨します：

- **Atoms**: 最小単位（ボタン、テキストフィールドなど）
- **Molecules**: Atomsの組み合わせ
- **Organisms**: 複雑なUIコンポーネント
- **Templates**: ページのレイアウト
- **Pages**: 実際のページ（View）

### 共通コンポーネントの例

```typescript
// BaseButton.ts
export class BaseButton
{
    private _mc: MovieClip;

    constructor(mc: MovieClip)
    {
        this._mc = mc;
        this.setup();
    }

    private setup(): void
    {
        this._mc.addEventListener("rollOver", () => {
            this._mc.gotoAndStop("over");
        });

        this._mc.addEventListener("rollOut", () => {
            this._mc.gotoAndStop("up");
        });

        this._mc.addEventListener("mouseDown", () => {
            this._mc.gotoAndStop("down");
        });
    }

    onClick(handler: Function): void
    {
        this._mc.addEventListener("click", handler);
    }
}
```

使用例：

```typescript
$ready(): void
{
    const buttonMc = this.content.getChildByName("myButton");
    const button = new BaseButton(buttonMc);
    button.onClick(() => {
        console.log("ボタンがクリックされました");
    });
}
```

## 関連項目

- [ルーティング](./routing.md)
- [設定ファイル](./config.md)
