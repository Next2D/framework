/// <reference types="vitest" />
/// <reference types="vite/client" />
/// <reference types="vitest/config" />

import { defineConfig } from "vitest/config";

export default defineConfig({
    "test": {
        "globals": true,
        "environment": "jsdom",
        "include": ["src/**/*.test.ts"]
    }
});