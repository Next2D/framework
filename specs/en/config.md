# Configuration Files

Next2D Framework configuration is managed with three JSON files.

## File Structure

```
src/config/
├── stage.json     # Display area settings
├── config.json    # Environment settings
└── routing.json   # Routing settings
```

---

## stage.json

JSON file for configuring the display area (Stage). It is read once at application startup and used as the initial parameters for the Stage.

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
| `width` | number | 240 | Display area width in pixels. Used as the base width of the rendering canvas |
| `height` | number | 240 | Display area height in pixels. Used as the base height of the rendering canvas |
| `fps` | number | 60 | Number of renders per second. Valid range is 1–60 |
| `options` | object | null | Additional option settings. Can be omitted |

### options Settings

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `fullScreen` | boolean | false | When `true`, the Stage expands to fill the entire window. When `false`, rendering is fixed to the size specified by `width` and `height` |
| `tagId` | string \| null | null | ID of the HTML element to use as the rendering target. The canvas is created inside the element with the specified ID. When `null`, the canvas is created directly under `<body>` |
| `bgColor` | string | "transparent" | Background color as a hexadecimal color code (e.g. `"#1461A0"`). Use `"transparent"` for a transparent background |

> [!WARNING]
> The only valid properties in `stage.json` are `width`, `height`, `fps`, and `options`.
> Properties such as `align` and `scaleMode` — even though they relate to Stage display — do not exist in `stage.json`.
> If you need these settings, define them in `config.json`.
> Any properties not listed above are completely ignored by the framework.

---

## config.json

File for managing environment-specific settings. At build time, the object matching the environment name specified with `--env` is merged with the `all` object and made available throughout the application.

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

### Environment Key Specification

Key names such as `local`, `dev`, `stg`, and `prd` are arbitrary (except `all`). The object whose key matches `--env=<environment>` at build time is loaded.

| Key | Description |
|-----|-------------|
| `all` | Settings loaded in all environments |
| Others | Settings loaded only when the key matches the `--env` value at build time |

### all Settings (Framework Reserved Properties)

The following properties are automatically processed by the framework.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `spa` | boolean | true | When `true`, the application behaves as a Single Page Application and manages View transitions in sync with the browser URL |
| `defaultTop` | string | "top" | Name of the View to display first when the application starts. If not specified, the `TopView` class is launched |
| `loading.callback` | string | "Loading" | Class name to use as the loading screen. The class's `start()` and `end()` methods are called automatically |
| `gotoView.callback` | string \| string[] | — | Callback class name(s) to call after a View transition completes. Multiple classes can be specified as an array and are executed sequentially with async/await |

### User-Defined Properties

In addition to the framework reserved properties, you can add any properties to any environment key. Added properties are accessible from the `config` object after the build.

Use this to manage values that need to differ per environment, such as endpoint URLs, feature flags, and display settings.

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

// Accessing user-defined properties
const align     = config.align;     // "TL"
const scaleMode = config.scaleMode; // "noScale"
```

> [!WARNING]
> The only properties automatically processed by the framework in `config.json` are `spa`, `defaultTop`, `loading`, and `gotoView`.
> All other properties are not processed directly by the framework, but can be freely accessed from application code via the `config` object.

### platform Settings

The value specified with `--platform` at build time is automatically set. It does not need to be written in the configuration file and is read-only.

Supported values: `macos`, `windows`, `linux`, `ios`, `android`, `web`

```typescript
import { config } from "@/config/Config";

if (config.platform === "ios") {
    // iOS-specific processing
}
```

---

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

---

## Getting Configuration Values

`Config.ts` is auto-generated when running `npm start`. You do not need to create or edit it manually.

To get configuration values in code, import and use the auto-generated `config` object.

### Usage Example

```typescript
import { config } from "@/config/Config";

// Stage settings
const stageWidth  = config.stage.width;
const stageHeight = config.stage.height;

// API settings
const apiEndPoint = config.api.endPoint;

// SPA setting
const isSpa = config.spa;
```

---

## Loading Screen

The `start()` and `end()` methods of the class set in `loading.callback` are called automatically.

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

---

## gotoView Callback

The `execute()` method of classes set in `gotoView.callback` is called. Multiple classes can be specified as an array and are executed sequentially with async/await.

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

---

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

---

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
        },
        "align": "TL",
        "scaleMode": "noScale"
    }
}
```

---

## Related

- [Routing](/en/reference/framework/routing)
- [View/ViewModel](/en/reference/framework/view)
