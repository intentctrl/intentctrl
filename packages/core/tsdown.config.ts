import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  dts: true,
  clean: true,
  sourcemap: true,
  outExtensions: () => ({ js: ".js" }),
  deps: {
    neverBundle: ["turndown", "zustand", "zod", "@intentctrl/types"],
    skipNodeModulesBundle: true,
  },
});
