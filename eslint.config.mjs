import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js"; // ESLint's default JavaScript configuration

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Use ESLint's default recommended configuration for JavaScript
  js.configs.recommended,

  // Extend Next.js's recommended configuration
  ...compat.extends("next/core-web-vitals"),

  // Add TypeScript support
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Disable the `any` rule
      "@typescript-eslint/no-unused-vars": "error", // Enable unused vars rule for TypeScript
    },
  },

  // Add React-specific rules
  {
    files: ["**/*.tsx", "**/*.jsx"],
    rules: {
      "react/jsx-filename-extension": [
        1,
        { extensions: [".tsx", ".jsx"] }, // Allow JSX in .tsx and .jsx files
      ],
      "react/react-in-jsx-scope": "off", // Disable React global import requirement
    },
  },

  // General rules
  {
    rules: {
      "import/extensions": "off", // Disable enforcing file extensions in imports
      "import/prefer-default-export": "off", // Allow named exports
    },
  },
];

export default eslintConfig;
