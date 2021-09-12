[![CodeQL](https://github.com/Next2D/Framework/actions/workflows/codeql-analysis.yml/badge.svg?branch=main)](https://github.com/Next2D/Framework/actions/workflows/codeql-analysis.yml)
[![license](https://img.shields.io/github/license/Next2D/Framework)](https://github.com/Next2D/Framework/blob/main/LICENSE)

# Next2D Framework

Next2D Framework for the Model-View-ViewModel(MVVM) pattern.

## Directory Configuration

```sh
├── dist // Destination of built sources. 
│   ├── index.html
│   └── app.js
├── test // Unit Test directory
│   └── model
└── src
    ├── App.js
    ├── Header.file
    ├── Footer.file
    ├── config
    │   ├── config.json // Configuration files for each environment.
    │   ├── routing.json // Request settings before loading the view.
    │   └── stage.json // Display(Stage) area setting. 
    ├── content
    │   └── top
    │       └── TopContent.js
    ├── model // business logic
    └── view // Per-page View, ViewModel files.
        ├── top
        │   ├── TopView.js
        │   └── TopViewModel.js
        └── home
            ├── HomeView.js
            └── HomeViewModel.js
```

## Chat Flow
![Chat Flow](./Framework_Chart_Flow.svg)

## Quick Start

Create Next2D apps with no build configuration.
```sh
npx create-next2d-app app-test
cd app-test
npm start
```

## Commands

* Starts the development server.
```sh
npm start
```

* Bundles the app into static files for develop.
```sh
npm run build
```

* Bundles the app into static files for production.
```sh
npm run build -- --env="prd"
```

* Starts the test runner.
```sh
npm test
```

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the [LICENSE](LICENSE) file for details.