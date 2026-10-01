import js from "@eslint/js";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      // Node.js globals used by the server and its tests
      globals: { console: "readonly", fetch: "readonly", process: "readonly", structuredClone: "readonly" },
    },
  },
]);
