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
`app.getCache()` returns `Map<string, unknown>`, and values are accessed by each request `name`.

Key points for cache usage:

- If the same key already exists, request processing can reuse cached values.
- Cache is not auto-cleared, so remove unused entries explicitly with `delete` or `clear`.

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

Use `app.gotoView(name?: string)` for screen transitions. It returns `Promise<void>` so you can await request completion, View/ViewModel rebind, and `onEnter()`.

Key points for `gotoView`:

- The `name` parameter type is `string` (optional, default is `""`).
- `name` is a `routing.json` key such as `home` or `quest/list`.
- You can include query strings such as `?id=123`.
- If `name` is omitted, the destination is resolved from the current URL (SPA `popstate` flow).
- Previous transition `response` data is cleared when a new transition starts.

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

### app.getContext()

Use `app.getContext()` to get the active `Context`. It provides references to `root` (root `Sprite`), `view`, and `viewModel`. During transitions, `view` and `viewModel` can temporarily be `null`.

```typescript
import { app } from "@next2d/framework";

const context = app.getContext();
const root = context.root;
```

## Getting Response Data

`app.getResponse()` returns `Map<string, unknown>`. It stores response values whose `name` is defined in `requests` for the current transition.

Key points for `getResponse`:

- It is a temporary store for one `gotoView` cycle.
- The map is reset when the next `gotoView` starts.
- Values are `unknown`; use type guards or type assertions before use.

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
