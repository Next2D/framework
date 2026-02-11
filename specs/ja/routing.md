# ルーティング

Next2D FrameworkはシングルページアプリケーションとしてURLでシーンを制御できます。ルーティングは`routing.json`で設定します。

## 基本設定

ルーティングのトッププロパティは英数字とスラッシュが使用できます。スラッシュをキーにCamelCaseでViewクラスにアクセスします。

```json
{
    "top": {
        "requests": []
    },
    "home": {
        "requests": []
    },
    "quest/list": {
        "requests": []
    }
}
```

上記の場合:
- `top` → `TopView`クラス
- `home` → `HomeView`クラス
- `quest/list` → `QuestListView`クラス

## ルート定義

### 基本的なルート

```json
{
    "top": {
        "requests": []
    }
}
```

アクセス: `https://example.com/` または `https://example.com/top`

### セカンドレベルプロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|------|----------|------|
| `private` | boolean | false | URLでの直接アクセスを制御。trueの場合、URLでアクセスするとTopViewが読み込まれる |
| `requests` | array | null | Viewがbindされる前にリクエストを送信 |

### プライベートルート

URLでの直接アクセスを禁止したい場合:

```json
{
    "quest/detail": {
        "private": true,
        "requests": []
    }
}
```

`private: true`の場合、URLで直接アクセスすると`TopView`にリダイレクトされます。プログラムからの`app.gotoView()`でのみアクセス可能です。

## requestsの設定

Viewがbindされる前にデータを取得できます。取得したデータは`app.getResponse()`で取得できます。

### requests配列の設定項目

| プロパティ | 型 | デフォルト | 説明 |
|-----------|------|----------|------|
| `type` | string | content | `json`、`content`、`custom`の固定値 |
| `path` | string | empty | リクエスト先のパス |
| `name` | string | empty | `response`にセットするキー名 |
| `cache` | boolean | false | データをキャッシュするか |
| `callback` | string \| array | null | リクエスト完了後のコールバッククラス |
| `class` | string | empty | リクエストを実行するクラス（typeがcustomの場合のみ） |
| `access` | string | public | 関数へのアクセス修飾子（`public`または`static`） |
| `method` | string | empty | 実行する関数名（typeがcustomの場合のみ） |

### typeの種類

#### json

外部JSONデータを取得:

```json
{
    "home": {
        "requests": [
            {
                "type": "json",
                "path": "{{api.endPoint}}api/home.json",
                "name": "HomeData"
            }
        ]
    }
}
```

#### content

Animation ToolのJSONを取得:

```json
{
    "top": {
        "requests": [
            {
                "type": "content",
                "path": "{{content.endPoint}}top.json",
                "name": "TopContent"
            }
        ]
    }
}
```

#### custom

カスタムクラスでリクエストを実行:

```json
{
    "user/profile": {
        "requests": [
            {
                "type": "custom",
                "class": "repository.UserRepository",
                "access": "static",
                "method": "getProfile",
                "name": "UserProfile"
            }
        ]
    }
}
```

### 変数の展開

`{{***}}`で囲むと`config.json`の変数を取得できます:

```json
{
    "path": "{{api.endPoint}}path/to/api"
}
```

### キャッシュの利用

`cache: true`を設定すると、データがキャッシュされます。キャッシュしたデータは画面遷移しても初期化されません。

```json
{
    "top": {
        "requests": [
            {
                "type": "json",
                "path": "{{api.endPoint}}api/master.json",
                "name": "MasterData",
                "cache": true
            }
        ]
    }
}
```

キャッシュデータの取得:

```typescript
import { app } from "@next2d/framework";

const cache = app.getCache();
if (cache.has("MasterData")) {
    const masterData = cache.get("MasterData");
}
```

### コールバック

リクエスト完了後にコールバックを実行:

```json
{
    "home": {
        "requests": [
            {
                "type": "json",
                "path": "{{api.endPoint}}api/home.json",
                "name": "HomeData",
                "callback": "callback.HomeDataCallback"
            }
        ]
    }
}
```

コールバッククラス:

```typescript
export class HomeDataCallback
{
    constructor(data: any)
    {
        // 取得したデータが渡される
    }

    execute(): void
    {
        // コールバック処理
    }
}
```

## 画面遷移

### app.gotoView()

`app.gotoView()`で画面遷移を行います:

```typescript
import { app } from "@next2d/framework";

// 基本的な遷移
await app.gotoView("home");

// パスで遷移
await app.gotoView("quest/list");

// クエリパラメータ付き
await app.gotoView("quest/detail?id=123");
```

### UseCaseでの画面遷移

画面遷移はUseCaseで行うことを推奨します:

```typescript
import { app } from "@next2d/framework";

export class NavigateToViewUseCase
{
    async execute(viewName: string): Promise<void>
    {
        await app.gotoView(viewName);
    }
}
```

ViewModelでの使用:

```typescript
export class TopViewModel extends ViewModel
{
    private readonly navigateToViewUseCase: NavigateToViewUseCase;

    constructor()
    {
        super();
        this.navigateToViewUseCase = new NavigateToViewUseCase();
    }

    async onClickStartButton(): Promise<void>
    {
        await this.navigateToViewUseCase.execute("home");
    }
}
```

## レスポンスデータの取得

`requests`で取得したデータは`app.getResponse()`で取得できます:

```typescript
import { app } from "@next2d/framework";

async initialize(): Promise<void>
{
    const response = app.getResponse();

    if (response.has("TopText")) {
        const topText = response.get("TopText") as { word: string };
        this.text = topText.word;
    }
}
```

**注意:** `response`データは画面遷移すると初期化されます。画面を跨いで保持したいデータは`cache: true`を設定してください。

## SPAモード

`config.json`の`all.spa`で設定します:

```json
{
    "all": {
        "spa": true
    }
}
```

- `true`: URLでシーンを制御（History API使用）
- `false`: URLによるシーン制御を無効化

## デフォルトのトップページ

`config.json`で設定:

```json
{
    "all": {
        "defaultTop": "top"
    }
}
```

設定がない場合は`TopView`クラスが起動します。

## View/ViewModelの自動生成

`routing.json`の設定から自動生成できます:

```bash
npm run generate
```

このコマンドは`routing.json`のトッププロパティを解析し、対応するViewとViewModelクラスを生成します。

## 設定例

### 完全な routing.json の例

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
        "requests": [
            {
                "type": "json",
                "path": "{{api.endPoint}}api/home.json",
                "name": "HomeData"
            },
            {
                "type": "content",
                "path": "{{content.endPoint}}home.json",
                "name": "HomeContent",
                "cache": true
            }
        ]
    },
    "quest/list": {
        "requests": [
            {
                "type": "custom",
                "class": "repository.QuestRepository",
                "access": "static",
                "method": "getList",
                "name": "QuestList"
            }
        ]
    },
    "quest/detail": {
        "private": true,
        "requests": [
            {
                "type": "custom",
                "class": "repository.QuestRepository",
                "access": "static",
                "method": "getDetail",
                "name": "QuestDetail"
            }
        ]
    }
}
```

## 関連項目

- [View/ViewModel](/ja/reference/framework/view)
- [設定ファイル](/ja/reference/framework/config)
