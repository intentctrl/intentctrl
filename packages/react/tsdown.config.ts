import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.tsx"],
  format: "esm",
  dts: true,
  clean: true,
  sourcemap: true,
  outExtensions: () => ({ js: ".js" }),
  deps: {
    neverBundle: ["react", "react-dom", "ai", "@ai-sdk/react", "zod", "@intentctrl/core", "@intentctrl/types"],
    skipNodeModulesBundle: true,
  },
});
