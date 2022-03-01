#### Quick Start

${{ framework-api.detail }}$

```sh
npx create-next2d-app app-name
cd app-name
npm start
```

#### ${{ framework-api.dir-detail }}$

```sh
project
├── src
│   ├── index.js
│   ├── App.js
│   ├── Packages.js // It will be generated automatically.
│   │
│   ├── component
│   │   └── default empty
│   │
│   ├── config
│   │   ├── config.json  // Configuration files for each environment.
│   │   ├── routing.json // Request settings before loading the view.
│   │   ├── stage.json   // Display(Stage) area setting. 
│   │   └── Config.js    // It will be generated automatically.
│   │
│   ├── content // Symbolic access to JSON created with NoCode Tool
│   │   ├── TopContent.js
│   │   └── HomeContent.js
│   │
│   ├── image
│   │   └── default empty
│   │
│   ├── model // business logic
│   │   ├── api
│   │   │   └── HomeText.js
│   │   └── callback
│   │       └── Background.js
│   │
│   └── view // Per-page View, ViewModel files.
│       ├── top
│       │   ├── TopView.js
│       │   └── TopViewModel.js
│       └── home
│           ├── HomeView.js
│           └── HomeViewModel.js
│
└── __tests__ // Unit Test directory
    └── model
        └── default empty
```

#### ${{ framework-api.chart-detail }}$
<img src="https://raw.githubusercontent.com/Next2D/Framework/main/Framework_Chart_Flow.svg" width="90%">

#### ${{ framework-api.command.title }}$

* ${{ framework-api.command.text1 }}$
```sh
npm start
```

* ${{ framework-api.command.text2 }}$
```sh
npm run generate
```

* ${{ framework-api.command.text3 }}$
```sh
npm run build -- --env="prd"
```

* ${{ framework-api.command.text4 }}$
```sh
npm test
```

### ${{ framework-api.conf-detail }}$

#### stage.json

| ${{ player-api.options.th1 }}$ | ${{ player-api.options.th2 }}$ | ${{ player-api.options.th3 }}$ | ${{ player-api.options.th4 }}$ |
| --- | --- | --- | --- |
| `width` | number | 240 | ${{ framework-api.stage.text1 }}$ |
| `height` | number | 240 | ${{ framework-api.stage.text2 }}$ |
| `fps` | number | 12 |${{ framework-api.stage.text3 }}$ |

##### Option settings

| ${{ player-api.options.th1 }}$ | ${{ player-api.options.th2 }}$ | ${{ player-api.options.th3 }}$ | ${{ player-api.options.th4 }}$ |
| --- | --- | --- | --- |
| `base` | string | empty | ${{ player-api.options.text1 }}$ |
| `fullScreen` | boolean | false | ${{ player-api.options.text2 }}$ |
| `tagId` | string | null | ${{ player-api.options.text3 }}$ |
| `bgColor` | array | null | ${{ player-api.options.text4 }}$ |

#### config.json

| ${{ framework-api.config.detail }}$

| ${{ player-api.options.th1 }}$ | ${{ player-api.options.th2 }}$ | ${{ player-api.options.th3 }}$ | ${{ player-api.options.th4 }}$ |
| --- | --- | --- | --- |
| `spa` | boolean | true | ${{ framework-api.config.text1 }}$ |
| `loading`.`callback` | string | Loading | ${{ framework-api.config.text2 }}$ |
| `gotoView`.`callback` | string or array | ["callback.Background"] | ${{ framework-api.config.text3 }}$ |

#### routing.json

${{ framework-api.routing.detail }}$

##### Example

${{ framework-api.routing.example }}$

```json
{
  "quest/list": {
    "requests": []
  }
}
````

#### ${{ framework-api.routing.detail2 }}$

| ${{ player-api.options.th1 }}$ | ${{ player-api.options.th2 }}$ | ${{ player-api.options.th3 }}$ | ${{ player-api.options.th4 }}$ |
| --- | --- | --- | --- |
| `private` | boolean | false | ${{ framework-api.routing.text1 }}$ |
| `redirect` | string | empty | ${{ framework-api.routing.text2 }}$ |
| `requests` | array | null | ${{ framework-api.routing.text3 }}$ |

#### ${{ framework-api.routing.detail3 }}$

| ${{ player-api.options.th1 }}$ | ${{ player-api.options.th2 }}$ | ${{ player-api.options.th3 }}$ | ${{ player-api.options.th4 }}$ |
| --- | --- | --- | --- |
| `type` | string | `content` | ${{ framework-api.routing.text4 }}$ |
| `path` | string | empty | ${{ framework-api.routing.text5 }}$ |
| `name` | string | empty | ${{ framework-api.routing.text6 }}$ |
| `cache` | boolean | false | ${{ framework-api.routing.text7 }}$ |
| `callback` | string or array | null | ${{ framework-api.routing.text8 }}$ |
| `class` | string | empty | ${{ framework-api.routing.text9 }}$ |
| `access` | string | `public` | ${{ framework-api.routing.text10 }}$ |
| `method` | string | empty | ${{ framework-api.routing.text11 }}$ |
