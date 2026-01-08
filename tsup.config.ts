/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/**/*.ts", "!src/**/*.spec.ts"],
    target: "node22",
    clean: true,
    shims: false,
    dts: false,
    bundle: false,
    onSuccess: "cpx 'src/**/*.hbs' dist",
});
