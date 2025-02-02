#!/usr/bin/env node

"use strict";

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

    delete packageJson.peerDependencies;
    packageJson.dependencies = { "@next2d/player": "*" };

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