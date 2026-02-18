import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";
import unusedImports from "eslint-plugin-unused-imports";

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      "**/dist/**",
      "**/.astro/**",
      "**/.next/**",
      "**/.open-next/**",
      "**/node_modules/**",
      "**/.turbo/**",
      "**/*.json",
      "**/worker-configuration.d.ts",
      "**/migrations/**",
      "**/env.d.ts",
    ],
  },

  // Base JS recommended
  eslint.configs.recommended,

  // TypeScript recommended
  ...tseslint.configs.recommended,

  // Astro recommended
  ...eslintPluginAstro.configs.recommended,

  // Unused imports plugin
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      // Disable built-in rules that conflict with unused-imports
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // Auto-remove unused imports
      "unused-imports/no-unused-imports": "error",

      // Warn on unused variables (ignore _ prefix)
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },

  // Relax some rules for config files
  {
    files: ["**/*.config.{js,mjs,ts}", "**/wrangler.*"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  }
);
