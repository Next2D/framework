#!/usr/bin/env node

"use strict";

import * as fs from "fs";

/**
 * @return {void}
 * @method
 * @private
 */
const execute = () =>
{
    const packageJson = JSON.parse(
        readFileSync(`${process.cwd()}/package.json`, { "encoding": "utf8" })
    );

    // write package.json
    writeFileSync(
        join(process.cwd(), "dist/src/package.json"),
        JSON.stringify(packageJson, null, 2)
    );

    if (packageJson.peerDependencies) {
        packageJson.dependencies = {};
        const keys = Object.keys(packageJson.peerDependencies);
        for (let idx = 0; idx < keys.length; ++idx) {
            packageJson.dependencies[keys[idx]] = "*";
        }

        delete packageJson.peerDependencies;
    }

    // LICENSE
    spawnSync(
        `cp -r ${process.cwd()}/LICENSE ${process.cwd()}/dist/LICENSE`,
        { "shell": true }
    );

    // README
    spawnSync(
        `cp -r ${process.cwd()}/README.md ${process.cwd()}/dist/README.md`,
        { "shell": true }
    );
};

execute();