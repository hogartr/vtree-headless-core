import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginPrettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";


export default defineConfig([
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  { 
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { "@typescript-eslint": tseslint.plugin }, 
    extends: ["js/recommended",      
      "plugin:@typescript-eslint/recommended",
      "plugin:import/typescript"
    ],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/no-inferrable-types": "off"
    }
  },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], languageOptions: { globals: globals.browser } },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
    plugins: ["react-hooks"],
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn"
    }},
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    plugins: { import: eslintPluginImport },
    extends: ["plugin:import/recommended"],
    rules: {
      "import/order": [
        "warn",
        {
          "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always"
        }
      ],
      "import/no-unresolved": "error",
      "import/no-extraneous-dependencies": "warn"
    }
  },
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    plugins: { prettier: eslintPluginPrettier },
    extends: ["plugin:prettier/recommended"],
    rules: {
      "prettier/prettier": "error"
    }
  }
]);
