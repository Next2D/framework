#!/usr/bin/env node

"use strict";

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const execute = () =>
{
    const packageJson = JSON.parse(
        readFileSync(join(process.cwd(), "package.json"), { "encoding": "utf8" })
    );

    delete packageJson.peerDependencies;
    packageJson.dependencies = { "@next2d/player": "*" };

    // write package.json
    writeFileSync(
        join(process.cwd(), "package.json"),
        JSON.stringify(packageJson, null, 2)
    );
};

execute();