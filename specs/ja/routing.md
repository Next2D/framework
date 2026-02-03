# ルーティング

Next2D Frameworkは、シングルページアプリケーション（SPA）のためのURLベースのルーティングを提供します。

## 基本設定

config.jsonでルートを定義します：

```json
{
  "routing": {
    "top": {
      "path": "/",
      "view": "TopView"
    },
    "about": {
      "path": "/about",
      "view": "AboutView",
      "viewModel": "AboutViewModel"
    }
  }
}
```

## ルート定義

### 基本的なルート

```json
{
  "routing": {
    "home": {
      "path": "/",
      "view": "HomeView"
    }
  }
}
```

### パラメータ付きルート

URLパラメータを使用できます：

```json
{
  "routing": {
    "userDetail": {
      "path": "/user/{id}",
      "view": "UserDetailView"
    },
    "articleDetail": {
      "path": "/article/{category}/{id}",
      "view": "ArticleDetailView"
    }
  }
}
```

Viewでパラメータを取得：

```typescript
import { router } from "@next2d/framework";

export class UserDetailView extends View
{
    $ready(): void
    {
        // URLパラメータを取得
        const userId = router.params.id;
        console.log("ユーザーID:", userId);
    }
}
```

### クエリパラメータ

```typescript
// /search?q=next2d&page=1 の場合
const query = router.query;
console.log(query.q);    // "next2d"
console.log(query.page); // "1"
```

## 画面遷移

### router.push()

新しい履歴を追加して遷移：

```typescript
import { router } from "@next2d/framework";

// パスで遷移
router.push("/about");

// パラメータ付き
router.push("/user/123");

// クエリパラメータ付き
router.push("/search?q=next2d");
```

### router.replace()

現在の履歴を置き換えて遷移：

```typescript
// ログイン後にホームに遷移（戻るボタンでログイン画面に戻れなくする）
router.replace("/home");
```

### router.back()

前の画面に戻る：

```typescript
router.back();
```

### router.forward()

次の画面に進む：

```typescript
router.forward();
```

## ナビゲーションガード

### beforeEach

画面遷移前にチェックを行います：

```typescript
import { app } from "@next2d/framework";

app.beforeEach((to, from, next) => {
    // 認証チェック
    if (to.path !== "/login" && !isAuthenticated()) {
        next("/login");
        return;
    }
    next();
});
```

### afterEach

画面遷移後の処理：

```typescript
app.afterEach((to, from) => {
    // アナリティクスに送信
    analytics.page(to.path);
});
```

## 遷移アニメーション

config.jsonでトランジションを設定：

```json
{
  "routing": {
    "top": {
      "path": "/",
      "view": "TopView",
      "transition": {
        "type": "fade",
        "duration": 0.3
      }
    }
  }
}
```

View内でカスタムトランジション：

```typescript
export class SampleView extends View
{
    // 表示アニメーション
    async $inTransition(): Promise<void>
    {
        this.content.alpha = 0;
        await this.tween(this.content, { alpha: 1 }, 0.3);
    }

    // 非表示アニメーション
    async $outTransition(): Promise<void>
    {
        await this.tween(this.content, { alpha: 0 }, 0.3);
    }
}
```

## 404エラー処理

```json
{
  "routing": {
    "notFound": {
      "path": "*",
      "view": "NotFoundView"
    }
  }
}
```

## プログラムによるルート取得

```typescript
import { router } from "@next2d/framework";

// 現在のパス
console.log(router.currentPath); // "/user/123"

// 現在のルート名
console.log(router.currentRoute); // "userDetail"

// 全ルートの取得
const routes = router.routes;
```

## ディープリンク対応

Next2D Frameworkは、ハッシュモードとヒストリーモードの両方をサポートします：

```json
{
  "router": {
    "mode": "history"  // または "hash"
  }
}
```

- **historyモード**: `/about`, `/user/123`
- **hashモード**: `/#/about`, `/#/user/123`

## 関連項目

- [View/ViewModel](./view.md)
- [設定ファイル](./config.md)
