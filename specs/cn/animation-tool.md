# Animation Tool 集成

Next2D Framework 与使用 Animation Tool 创建的资源无缝集成。

## 概述

Animation Tool 是用于为 Next2D Player 创建动画和 UI 组件的工具。输出的 JSON 文件可以在框架中加载并用作 MovieClip。

## 目录结构

```
src/
├── ui/
│   ├── content/              # Animation Tool 生成的内容
│   │   ├── TopContent.ts
│   │   └── HomeContent.ts
│   │
│   ├── component/            # 原子设计组件
│   │   ├── atom/             # 最小单元组件
│   │   │   ├── ButtonAtom.ts
│   │   │   └── TextAtom.ts
│   │   ├── molecule/         # 组合的 Atom 组件
│   │   │   ├── TopBtnMolecule.ts
│   │   │   └── HomeBtnMolecule.ts
│   │   ├── organism/         # 多个 Molecule 组合
│   │   ├── template/         # 页面模板
│   │   └── page/             # 页面组件
│   │       ├── top/
│   │       │   └── TopPage.ts
│   │       └── home/
│   │           └── HomePage.ts
│   │
│   └── animation/            # 代码动画定义
│       └── top/
│           └── TopBtnShowAnimation.ts
│
└── file/                     # Animation Tool 输出文件
    └── sample.n2d
```

## MovieClipContent

包装使用 Animation Tool 创建的内容的类。

### 基本结构

```typescript
import { MovieClipContent } from "@next2d/framework";

/**
 * @see file/sample.n2d
 */
export class TopContent extends MovieClipContent
{
    /**
     * 返回在 Animation Tool 中设置的符号名称
     */
    get namespace(): string
    {
        return "TopContent";
    }
}
```

### namespace 的作用

`namespace` 属性应与在 Animation Tool 中创建的符号名称匹配。此名称用于从加载的 JSON 数据生成相应的 MovieClip。

## 加载内容

### routing.json 中的配置

Animation Tool JSON 文件通过 `routing.json` 中的 `requests` 加载。

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

#### 请求配置

| 属性 | 类型 | 说明 |
|------|------|------|
| `type` | string | 指定 `"content"` |
| `path` | string | JSON 文件的路径 |
| `name` | string | 在响应中注册的键名 |
| `cache` | boolean | 是否缓存 |

#### 集群功能

以 `@` 开头的键被定义为集群，可以在多个路由之间共享。使用 `type: "cluster"` 引用它们。

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

## 相关

- [View/ViewModel](/cn/reference/framework/view)
- [路由](/cn/reference/framework/routing)
- [配置](/cn/reference/framework/config)
