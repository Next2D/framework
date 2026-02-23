# 路由

Next2D Framework 可以作为单页应用程序通过 URL 控制场景。路由在 `routing.json` 中配置。

## 基本配置

路由的顶级属性可以使用字母数字字符和斜杠。斜杠用作以驼峰命名法访问 View 类的键。

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

在上面的示例中：
- `top` → `TopView` 类
- `home` → `HomeView` 类
- `quest/list` → `QuestListView` 类

## 路由定义

### 基本路由

```json
{
    "top": {
        "requests": []
    }
}
```

访问：`https://example.com/` 或 `https://example.com/top`

### 二级属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `private` | boolean | false | 控制直接 URL 访问。如果为 true，URL 访问将加载 TopView |
| `requests` | array | null | 在 View 绑定之前发送请求 |

### 私有路由

要限制直接 URL 访问：

```json
{
    "quest/detail": {
        "private": true,
        "requests": []
    }
}
```

当 `private: true` 时，直接 URL 访问会重定向到 `TopView`。只能通过 `app.gotoView()` 访问。

## requests 配置

可以在 View 绑定之前获取数据。检索的数据可通过 `app.getResponse()` 获取。

### requests 数组设置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `type` | string | content | 固定值：`json`、`content`、`custom` |
| `path` | string | empty | 请求目标路径 |
| `name` | string | empty | 在 `response` 中设置的键名 |
| `cache` | boolean | false | 是否缓存数据 |
| `callback` | string \| array | null | 请求完成后的回调类 |
| `class` | string | empty | 执行请求的类（仅 custom 类型） |
| `access` | string | public | 函数访问修饰符（`public` 或 `static`） |
| `method` | string | empty | 要执行的函数名（仅 custom 类型） |

### 类型变体

#### json

获取外部 JSON 数据：

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

获取 Animation Tool JSON：

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

使用自定义类执行请求：

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

### 变量展开

用 `{{***}}` 包围以从 `config.json` 获取变量：

```json
{
    "path": "{{api.endPoint}}path/to/api"
}
```

### 使用缓存

设置 `cache: true` 会缓存数据。缓存的数据在画面转换中持久存在。
`app.getCache()` 返回 `Map<string, unknown>`，可通过每个请求的 `name` 键访问。

缓存使用要点：

- 如果同一键已存在，请求处理可优先复用缓存值。
- 缓存不会自动清理，不再需要时请显式使用 `delete` 或 `clear`。

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

获取缓存的数据：

```typescript
import { app } from "@next2d/framework";

const cache = app.getCache();
if (cache.has("MasterData")) {
    const masterData = cache.get("MasterData");
}
```

### 回调

请求完成后执行回调：

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

回调类：

```typescript
export class HomeDataCallback
{
    constructor(data: any)
    {
        // 传递检索到的数据
    }

    execute(): void
    {
        // 回调处理
    }
}
```

## 画面转换

### app.gotoView()

使用 `app.gotoView(name?: string)` 进行画面转换。其返回 `Promise<void>`，可等待请求完成、View/ViewModel 重新绑定以及 `onEnter()` 执行完成。

`gotoView` 要点：

- `name` 参数类型是 `string`（可省略，默认值为 `""`）。
- `name` 使用 `routing.json` 的键，例如 `home`、`quest/list`。
- 支持附带 `?id=123` 这类查询字符串。
- 省略 `name` 时，会从当前 URL 解析目标路由（SPA 的 `popstate` 流程）。
- 开始新转换时会清空上一轮的 `response` 数据。

```typescript
import { app } from "@next2d/framework";

// 基本转换
await app.gotoView("home");

// 按路径转换
await app.gotoView("quest/list");

// 带查询参数
await app.gotoView("quest/detail?id=123");
```

### UseCase 中的画面转换

建议在 UseCase 中处理画面转换：

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

在 ViewModel 中使用：

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

### app.getContext()

使用 `app.getContext()` 获取当前运行中的 `Context`。其中包含 `root`（根 `Sprite`）、`view`、`viewModel` 引用。转换过程中 `view` 与 `viewModel` 可能暂时为 `null`。

```typescript
import { app } from "@next2d/framework";

const context = app.getContext();
const root = context.root;
```

## 获取响应数据

`app.getResponse()` 返回 `Map<string, unknown>`。它保存当前一次转换中 `requests` 里定义了 `name` 的响应数据。

`getResponse` 要点：

- 它是一次 `gotoView` 周期内的临时数据容器。
- 开始下一次 `gotoView` 时会重置。
- 值类型为 `unknown`，使用前请做类型守卫或类型断言。

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

**注意：** `response` 数据在画面转换时会重置。对于需要跨画面持久存在的数据，请使用 `cache: true`。

## SPA 模式

在 `config.json` 的 `all.spa` 中配置：

```json
{
    "all": {
        "spa": true
    }
}
```

- `true`：通过 URL 控制场景（使用 History API）
- `false`：禁用基于 URL 的场景控制

## 默认首页

在 `config.json` 中配置：

```json
{
    "all": {
        "defaultTop": "top"
    }
}
```

如果未设置，将启动 `TopView` 类。

## 自动生成 View/ViewModel

从 `routing.json` 设置自动生成：

```bash
npm run generate
```

此命令解析 `routing.json` 中的顶级属性并生成相应的 View 和 ViewModel 类。

## 配置示例

### 完整 routing.json 示例

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

## 相关

- [View/ViewModel](/cn/reference/framework/view)
- [配置](/cn/reference/framework/config)
