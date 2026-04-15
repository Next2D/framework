# 配置文件

Next2D Framework 配置使用三个 JSON 文件管理。

## 文件结构

```
src/config/
├── stage.json     # 显示区域设置
├── config.json    # 环境设置
└── routing.json   # 路由设置
```

---

## stage.json

用于配置显示区域（Stage）的 JSON 文件。应用启动时读取一次，作为 Stage 的初始参数使用。

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

### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `width` | number | 240 | 显示区域宽度（像素）。作为渲染画布的基准宽度使用 |
| `height` | number | 240 | 显示区域高度（像素）。作为渲染画布的基准高度使用 |
| `fps` | number | 60 | 每秒渲染次数。有效范围为 1〜60 |
| `options` | object | null | 附加选项设置。可省略 |

### options 设置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `fullScreen` | boolean | false | 设为 `true` 时，Stage 扩展为填充整个窗口。设为 `false` 时，以 `width`・`height` 指定的尺寸固定渲染 |
| `tagId` | string \| null | null | 用作渲染目标的 HTML 元素 ID。画布在指定 ID 的元素内部创建。为 `null` 时直接在 `<body>` 下创建 |
| `bgColor` | string | "transparent" | 以十六进制颜色代码指定背景色（例：`"#1461A0"`）。指定 `"transparent"` 则为透明 |

> [!WARNING]
> `stage.json` 中有效的属性仅有 `width`・`height`・`fps`・`options`。
> `align`・`scaleMode` 等与 Stage 显示相关的设置，在 `stage.json` 中并不存在。
> 如需这些设置，请在 `config.json` 中定义。
> 上述以外的属性将被框架完全忽略，不做任何处理。

---

## config.json

用于管理各环境设置的文件。构建时，与 `--env` 选项指定的环境名匹配的对象和 `all` 对象合并后，作为整个应用可引用的设置展开。

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

### 环境键规格

`local`・`dev`・`stg`・`prd` 等键名可任意指定（`all` 除外）。构建时，与 `--env=<环境名>` 匹配的键的对象将被读取。

| 键 | 说明 |
|----|------|
| `all` | 在所有环境下均会读取的公共设置 |
| 其他 | 仅在键名与构建时 `--env` 指定值匹配时读取的设置 |

### all 设置（框架保留属性）

以下属性由框架自动处理。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `spa` | boolean | true | 设为 `true` 时，作为单页应用程序运行，与浏览器 URL 联动管理 View 切换 |
| `defaultTop` | string | "top" | 应用启动时最先显示的 View 名称。未指定时启动 `TopView` 类 |
| `loading.callback` | string | "Loading" | 用作加载画面的类名。该类的 `start()` 和 `end()` 会被自动调用 |
| `gotoView.callback` | string \| string[] | — | View 切换完成后调用的回调类名。可以数组形式指定多个，按 async/await 顺序执行 |

### 用户自定义属性

除框架保留属性外，可在任意环境键中添加任意属性。添加的属性在构建后可通过 `config` 对象引用。

端点 URL、功能开关、显示设置等需要按环境区分的值，可在此处统一管理。

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

// 访问用户自定义属性
const align     = config.align;     // "TL"
const scaleMode = config.scaleMode; // "noScale"
```

> [!WARNING]
> `config.json` 中框架自动处理的属性仅有 `spa`・`defaultTop`・`loading`・`gotoView`。
> 其他属性不会被框架直接处理，但可通过 `config` 对象在应用代码中自由引用。

### platform 设置

构建时通过 `--platform` 指定的值会被自动设置。无需在配置文件中填写，为只读项。

支持的值：`macos`、`windows`、`linux`、`ios`、`android`、`web`

```typescript
import { config } from "@/config/Config";

if (config.platform === "ios") {
    // iOS 专用处理
}
```

---

## routing.json

路由配置文件。详情请参阅[路由](/cn/reference/framework/routing)。

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

## 获取配置值

`Config.ts` 是执行 `npm start` 时自动生成的文件，无需手动创建或编辑。

在代码中通过导入自动生成的 `config` 对象来获取配置值。

### 使用示例

```typescript
import { config } from "@/config/Config";

// Stage 设置
const stageWidth  = config.stage.width;
const stageHeight = config.stage.height;

// API 设置
const apiEndPoint = config.api.endPoint;

// SPA 设置
const isSpa = config.spa;
```

---

## 加载画面

`loading.callback` 中设置的类的 `start()` 和 `end()` 方法会被自动调用。

```typescript
export class Loading
{
    private shape: Shape;

    constructor()
    {
        this.shape = new Shape();
        // 初始化加载显示
    }

    start(): void
    {
        // 加载开始时的处理
        stage.addChild(this.shape);
    }

    end(): void
    {
        // 加载结束时的处理
        this.shape.remove();
    }
}
```

---

## gotoView 回调

`gotoView.callback` 中设置的类的 `execute()` 方法会被调用。可以数组形式指定多个类，按 async/await 顺序执行。

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

        // 将背景放置在最底层
        view.addChildAt(this.shape, 0);
    }
}
```

---

## 构建命令

带环境指定的构建：

```bash
# 本地环境
npm run build -- --env=local

# 开发环境
npm run build -- --env=dev

# 生产环境
npm run build -- --env=prd
```

指定平台：

```bash
npm run build -- --platform=web
npm run build -- --platform=ios
npm run build -- --platform=android
```

---

## 配置示例

### 完整配置文件示例

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

## 相关

- [路由](/cn/reference/framework/routing)
- [View/ViewModel](/cn/reference/framework/view)
