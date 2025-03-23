#!/usr/bin/env node

"use strict";

import { spawnSync } from "child_process";

/**
 * @return {void}
 * @method
 * @private
 */
const execute = () =>
{
    // package.json file
    spawnSync(
        `cp -r ${process.cwd()}/package.json ${process.cwd()}/dist/package.json`,
        { "shell": true }
    );

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