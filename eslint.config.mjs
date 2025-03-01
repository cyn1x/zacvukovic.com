import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        languageOptions: {
            globals: globals.browser,
            ecmaVersion: "latest",
            sourceType: "module",
        },
        rules: {
            "consistent-return": "error",
            "indent": ["error", 4],
            "no-else-return": "warn",
            "semi": ["warn", "always"],
            "space-unary-ops": "error"
        },
    },
    pluginJs.configs.recommended
];
