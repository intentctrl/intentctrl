import { globalIgnores } from "eslint/config";
import { nextJsConfig } from "@intentctrl/eslint-config/next";
import { config as baseConfig } from "@intentctrl/eslint-config/base";
import { config as reactInternalConfig } from "@intentctrl/eslint-config/react-internal";

function scope(configs, files) {
  return configs.map((cfg) => ({ ...cfg, files }));
}

export default [
  globalIgnores(["**/node_modules/**", "**/.turbo/**"]),

  ...scope(nextJsConfig, ["apps/web/**", "apps/docs/**"]),
  {
    files: ["apps/docs/**"],
    ignores: [".source/**"],
  },

  ...scope(baseConfig, ["packages/core/**", "packages/types/**"]),
  ...scope(reactInternalConfig, ["packages/react/**"]),
];
