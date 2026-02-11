# Configuration Files

Next2D Framework configuration is managed with three JSON files.

## File Structure

```
src/config/
├── stage.json     # Display area settings
├── config.json    # Environment settings
└── routing.json   # Routing settings
```

## stage.json

JSON file for setting the display area (Stage).

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

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `width` | number | 240 | Display area width |
| `height` | number | 240 | Display area height |
| `fps` | number | 60 | Drawings per second (1-60) |
| `options` | object | null | Option settings |

### options Settings

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `fullScreen` | boolean | false | Draw on entire screen beyond Stage width/height |
| `tagId` | string | null | When specified, drawing occurs within the element with that ID |
| `bgColor` | string | "transparent" | Background color in hexadecimal. Default is transparent |

## config.json

File for managing environment-specific settings. Divided into `local`, `dev`, `stg`, `prd`, and `all`, where any environment name except `all` is arbitrary.

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

### all Settings

`all` is a common variable exported in any environment.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `spa` | boolean | true | Control scenes via URL as Single Page Application |
| `defaultTop` | string | "top" | View for page top. TopView class launches if not set |
| `loading.callback` | string | Loading | Loading screen class name. Calls start and end functions |
| `gotoView.callback` | string \| array | ["callback.Background"] | Callback class after gotoView completion |

### platform Settings

The value specified with `--platform` at build time is set.

Supported values: `macos`, `windows`, `linux`, `ios`, `android`, `web`

```typescript
import { config } from "@/config/Config";

if (config.platform === "ios") {
    // iOS-specific processing
}
```

## routing.json

Routing configuration file. See [Routing](/en/reference/framework/routing) for details.

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

## Getting Configuration Values

Use the `config` object to get configuration values in code.

### Config.ts Example

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

### Usage Example

```typescript
import { config } from "@/config/Config";

// Stage settings
const stageWidth = config.stage.width;
const stageHeight = config.stage.height;

// API settings
const apiEndPoint = config.api.endPoint;

// SPA setting
const isSpa = config.spa;
```

## Loading Screen

The `start` and `end` functions of the class set in `loading.callback` are called.

```typescript
export class Loading
{
    private shape: Shape;

    constructor()
    {
        this.shape = new Shape();
        // Initialize loading display
    }

    start(): void
    {
        // Processing when loading starts
        stage.addChild(this.shape);
    }

    end(): void
    {
        // Processing when loading ends
        this.shape.remove();
    }
}
```

## gotoView Callback

The `execute` function of classes set in `gotoView.callback` is called. Multiple classes can be set as an array and executed sequentially with async/await.

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

        // Place background at the back
        view.addChildAt(this.shape, 0);
    }
}
```

## Build Commands

Build with environment specification:

```bash
# Local environment
npm run build -- --env=local

# Development environment
npm run build -- --env=dev

# Production environment
npm run build -- --env=prd
```

Specify platform:

```bash
npm run build -- --platform=web
npm run build -- --platform=ios
npm run build -- --platform=android
```

## Configuration Examples

### Complete Configuration File Examples

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

## Related

- [Routing](/en/reference/framework/routing)
- [View/ViewModel](/en/reference/framework/view)
