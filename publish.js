"use strict";

const fs          = require("fs");
const packageJson = require("./package.json");

fs.writeFileSync("./dist/package.json", `{
  "name": "@next2d/framework",
  "version": "${packageJson.version}",
  "description": "${packageJson.description}",
  "author": "${packageJson.author}",
  "license": "MIT",
  "homepage": "https://next2d.app",
  "bugs": "https://github.com/Next2D/Framework/issues/new",
  "main": "next2d-framework.js",
  "keywords": [
    "Next2D",
    "Next2D Framework"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Next2D/Framework.git"
  }
}`);
