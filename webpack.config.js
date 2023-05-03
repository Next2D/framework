const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {
    "mode": "production",
    "entry": path.resolve(__dirname, "src/index.ts"),
    "output": {
        "filename": "next2d-framework.js",
        "path": path.resolve(__dirname, "dist")
    },
    "plugins": [
        new ESLintPlugin({
            "extensions": [".ts", ".js"],
            "exclude": "node_modules",
            "fix": true
        })
    ],
    "module": {
        "rules": [
            {
                "test": /\.ts$/,
                "use": "ts-loader",
                "exclude": /node_modules/
            }
        ]
    },
    "resolve": {
        "alias": {
            "@": path.resolve(__dirname, "src")
        },
        "extensions": [".ts", ".js"]
    },
    "devServer": {
        "static": {
            "directory": path.resolve(__dirname, "dist")
        },
        "compress": false,
        "open": true
    }
};
