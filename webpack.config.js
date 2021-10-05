const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {
    "mode": "production",
    "entry": "./src/index.js",
    "output": {
        "filename": "next2d-framework.js",
        "path": path.join(__dirname, "/")
    },
    "plugins": [
        new ESLintPlugin({
            "fix": true
        })
    ],
    "devServer": {
        "static": {
            "directory": path.join(__dirname, "dist")
        },
        "compress": false,
        "open": true
    }
};