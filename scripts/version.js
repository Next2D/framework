#!/usr/bin/env node

"use strict";

import { existsSync, readFileSync, writeFileSync } from "fs";

/**
 * @return {void}
 * @method
 * @private
 */
const execute = () =>
{
    const indexPath = `${process.cwd()}/src/index.ts`;
    if (existsSync(indexPath)) {

        const src = readFileSync(indexPath, "utf8");
        const packageJson = JSON.parse(
            readFileSync(`${process.cwd()}/package.json`, { "encoding": "utf8" })
        );

        const texts = src.split("\n");
        for (let idx = 0; idx < texts.length; ++idx) {

            const text = texts[idx];
            if (text.indexOf("Next2D Framework") === -1) {
                continue;
            }

            const top   = texts.slice(0, idx).join("\n");
            const lower = texts.slice(idx + 1).join("\n");

            writeFileSync(
                indexPath,
                `${top}
console.log("%c Next2D Framework %c ${packageJson.version} %c https://next2d.app",
${lower}`
            );

            break;
        }
    }
};

execute();