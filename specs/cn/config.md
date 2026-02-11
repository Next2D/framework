# 配置文件

Next2D Framework 配置使用三个 JSON 文件管理。

## 文件结构

```
src/config/
├── stage.json     # 显示区域设置
├── config.json    # 环境设置
└── routing.json   # 路由设置
```

## stage.json

用于设置显示区域（Stage）的 JSON 文件。

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
| `width` | number | 240 | 显示区域宽度 |
| `height` | number | 240 | 显示区域高度 |
| `fps` | number | 60 | 每秒绘制次数（1-60） |
| `options` | object | null | 选项设置 |

### options 设置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `fullScreen` | boolean | false | 超出舞台宽高在整个屏幕上绘制 |
| `tagId` | string | null | 指定后，绘制发生在具有该 ID 的元素内 |
| `bgColor` | string | "transparent" | 十六进制背景颜色。默认为透明 |

## config.json

用于管理特定环境设置的文件。分为 `local`、`dev`、`stg`、`prd` 和 `all`，其中除 `all` 以外的任何环境名称都是任意的。

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

### all 设置

`all` 是在任何环境中导出的公共变量。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `spa` | boolean | true | 作为单页应用程序通过 URL 控制场景 |
| `defaultTop` | string | "top" | 页面顶部的 View。如果未设置，将启动 TopView 类 |
| `loading.callback` | string | Loading | 加载画面类名。调用 start 和 end 函数 |
| `gotoView.callback` | string \| array | ["callback.Background"] | gotoView 完成后的回调类 |

### platform 设置

构建时使用 `--platform` 指定的值会被设置。

支持的值：`macos`、`windows`、`linux`、`ios`、`android`、`web`

```typescript
import { config } from "@/config/Config";

if (config.platform === "ios") {
    // iOS 特定处理
}
```

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

## 获取配置值

在代码中使用 `config` 对象获取配置值。

### Config.ts 示例

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

### 使用示例

```typescript
import { config } from "@/config/Config";

// 舞台设置
const stageWidth = config.stage.width;
const stageHeight = config.stage.height;

// API 设置
const apiEndPoint = config.api.endPoint;

// SPA 设置
const isSpa = config.spa;
```

## 加载画面

调用 `loading.callback` 中设置的类的 `start` 和 `end` 函数。

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

## gotoView 回调

调用 `gotoView.callback` 中设置的类的 `execute` 函数。可以设置多个类作为数组，并使用 async/await 顺序执行。

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

        // 将背景放在后面
        view.addChildAt(this.shape, 0);
    }
}
```

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
        }
    }
}
```

## 相关

- [路由](/cn/reference/framework/routing)
- [View/ViewModel](/cn/reference/framework/view)
