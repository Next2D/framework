const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {
    "mode": "production",
    "entry": "./src/index.js",
    "output": {
        "filename": "next2d-framework.js",
        "path": path.resolve(__dirname, "/")
    },
    "plugins": [
        new ESLintPlugin({
            "fix": true
        })
    ],
    "resolve": {
        "alias": {
            "@": path.resolve(__dirname, "src")
        }
    },
    "devServer": {
        "static": {
            "directory": path.resolve(__dirname, "dist")
        },
        "compress": false,
        "open": true
    }
};
