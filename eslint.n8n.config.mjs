import tsParser from "@typescript-eslint/parser";
import n8nPlugin from "eslint-plugin-n8n-nodes-base";

export default [
	{
		files: ["nodes/**/*.ts", "credentials/**/*.ts"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: "./tsconfig.json",
			},
		},
		plugins: {
			"n8n-nodes-base": n8nPlugin,
		},
		rules: {
			...n8nPlugin.configs["community"].rules,
		},
	},
];
