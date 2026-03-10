/**
 * ESLint config that mirrors the exact checks run by
 * `npx @n8n/scan-community-package` — the n8n Creator Portal scanner.
 *
 * Usage: eslint --config eslint.n8n-scan.config.mjs dist/
 */
import { n8nCommunityNodesPlugin } from "@n8n/eslint-plugin-community-nodes";

export default [
	n8nCommunityNodesPlugin.configs.recommended,
	{
		rules: { "no-console": "error" },
	},
];
