# AnimationTool Integration

Next2D Framework seamlessly integrates with assets created in AnimationTool.

## Overview

AnimationTool is a tool for creating animations and UI components for Next2D Player. The output JSON files can be loaded in the framework and used as MovieClips.

## Directory Structure

```
src/
├── ui/
│   ├── content/              # Animation Tool generated content
│   │   ├── TopContent.ts
│   │   └── HomeContent.ts
│   │
│   ├── component/            # Atomic Design components
│   │   ├── atom/             # Smallest unit components
│   │   │   ├── ButtonAtom.ts
│   │   │   └── TextAtom.ts
│   │   ├── molecule/         # Combined Atom components
│   │   │   ├── TopBtnMolecule.ts
│   │   │   └── HomeBtnMolecule.ts
│   │   ├── organism/         # Multiple Molecule combinations
│   │   ├── template/         # Page templates
│   │   └── page/             # Page components
│   │       ├── top/
│   │       │   └── TopPage.ts
│   │       └── home/
│   │           └── HomePage.ts
│   │
│   └── animation/            # Code animation definitions
│       └── top/
│           └── TopBtnShowAnimation.ts
│
└── file/                     # Animation Tool output files
    └── sample.n2d
```

## MovieClipContent

A class that wraps content created with Animation Tool.

### Basic Structure

```typescript
import { MovieClipContent } from "@next2d/framework";

/**
 * @see file/sample.n2d
 */
export class TopContent extends MovieClipContent
{
    /**
     * Returns the symbol name set in Animation Tool
     */
    get namespace(): string
    {
        return "TopContent";
    }
}
```

### Role of namespace

The `namespace` property should match the symbol name created in Animation Tool. This name is used to generate the corresponding MovieClip from the loaded JSON data.

## Loading Content

### Configuration in routing.json

Animation Tool JSON files are loaded via `requests` in `routing.json`.

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

#### Request Configuration

| Property | Type | Description |
|----------|------|-------------|
| `type` | string | Specify `"content"` |
| `path` | string | Path to the JSON file |
| `name` | string | Key name registered in response |
| `cache` | boolean | Whether to cache |

#### Cluster Feature

Keys starting with `@` are defined as clusters and can be shared across multiple routes. Reference them with `type: "cluster"`.

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

## Related

- [View/ViewModel](/en/reference/framework/view)
- [Routing](/en/reference/framework/routing)
- [Configuration](/en/reference/framework/config)
