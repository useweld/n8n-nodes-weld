const { readdirSync, statSync, copyFileSync, mkdirSync, existsSync } =
	require("fs");
const { join } = require("path");

function copyAssets(srcDir, destDir) {
	if (!existsSync(srcDir)) return;
	for (const entry of readdirSync(srcDir)) {
		const src = join(srcDir, entry);
		const dest = join(destDir, entry);
		if (statSync(src).isDirectory()) {
			copyAssets(src, dest);
		} else if (/\.(svg|json)$/.test(entry) && !entry.startsWith("tsconfig")) {
			mkdirSync(destDir, { recursive: true });
			copyFileSync(src, dest);
		}
	}
}

copyAssets("nodes", "dist/nodes");
