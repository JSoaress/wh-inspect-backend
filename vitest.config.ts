/* eslint-disable import/no-extraneous-dependencies */
import dotenv from "dotenv";
import path from "node:path";
import { defineConfig } from "vitest/config";

dotenv.config({ path: "./.env.test.local" });

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    test: {
        testTimeout: 10000,
    },
});
