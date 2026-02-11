# Routing

Next2D Framework can control scenes via URL as a Single Page Application. Routing is configured in `routing.json`.

## Basic Configuration

The top properties for routing can use alphanumeric characters and slashes. The slash is used as a key to access View classes in CamelCase.

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

In the above example:
- `top` → `TopView` class
- `home` → `HomeView` class
- `quest/list` → `QuestListView` class

## Route Definition

### Basic Route

```json
{
    "top": {
        "requests": []
    }
}
```

Access: `https://example.com/` or `https://example.com/top`

### Second Level Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `private` | boolean | false | Controls direct URL access. If true, URL access loads TopView |
| `requests` | array | null | Send requests before View is bound |

### Private Routes

To restrict direct URL access:

```json
{
    "quest/detail": {
        "private": true,
        "requests": []
    }
}
```

When `private: true`, direct URL access redirects to `TopView`. Only accessible via `app.gotoView()`.

## requests Configuration

Data can be fetched before View is bound. Retrieved data is available via `app.getResponse()`.

### requests Array Settings

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | string | content | Fixed values: `json`, `content`, `custom` |
| `path` | string | empty | Request destination path |
| `name` | string | empty | Key name to set in `response` |
| `cache` | boolean | false | Whether to cache data |
| `callback` | string \| array | null | Callback class after request completion |
| `class` | string | empty | Class to execute request (custom type only) |
| `access` | string | public | Function access modifier (`public` or `static`) |
| `method` | string | empty | Function name to execute (custom type only) |

### Type Variants

#### json

Get external JSON data:

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

Get Animation Tool JSON:

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

Execute request with custom class:

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

### Variable Expansion

Enclose with `{{***}}` to get variables from `config.json`:

```json
{
    "path": "{{api.endPoint}}path/to/api"
}
```

### Using Cache

Setting `cache: true` caches the data. Cached data persists through screen transitions.

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

Getting cached data:

```typescript
import { app } from "@next2d/framework";

const cache = app.getCache();
if (cache.has("MasterData")) {
    const masterData = cache.get("MasterData");
}
```

### Callbacks

Execute callback after request completion:

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

Callback class:

```typescript
export class HomeDataCallback
{
    constructor(data: any)
    {
        // Retrieved data is passed
    }

    execute(): void
    {
        // Callback processing
    }
}
```

## Screen Transition

### app.gotoView()

Use `app.gotoView()` for screen transitions:

```typescript
import { app } from "@next2d/framework";

// Basic transition
await app.gotoView("home");

// Transition by path
await app.gotoView("quest/list");

// With query parameters
await app.gotoView("quest/detail?id=123");
```

### Screen Transition in UseCase

Recommended to handle screen transitions in UseCase:

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

Usage in ViewModel:

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

## Getting Response Data

Data from `requests` can be retrieved with `app.getResponse()`:

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

**Note:** `response` data is reset on screen transition. Use `cache: true` for data that should persist across screens.

## SPA Mode

Configure in `config.json`'s `all.spa`:

```json
{
    "all": {
        "spa": true
    }
}
```

- `true`: Control scenes via URL (uses History API)
- `false`: Disable URL-based scene control

## Default Top Page

Configure in `config.json`:

```json
{
    "all": {
        "defaultTop": "top"
    }
}
```

If not set, `TopView` class is launched.

## Auto-generating View/ViewModel

Auto-generate from `routing.json` settings:

```bash
npm run generate
```

This command parses top properties in `routing.json` and generates corresponding View and ViewModel classes.

## Configuration Example

### Complete routing.json Example

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

## Related

- [View/ViewModel](/en/reference/framework/view)
- [Configuration](/en/reference/framework/config)
