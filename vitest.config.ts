import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		root: ".",
		include: ["tests/**/*.test.ts"],
		coverage: {
			provider: "v8",
			include: ["nodes/**/*.ts", "credentials/**/*.ts"],
			exclude: ["**/*.d.ts"],
		},
	},
});
