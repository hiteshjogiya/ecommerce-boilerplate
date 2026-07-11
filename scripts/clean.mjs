import { rmSync } from "node:fs";

const paths = [".next", "coverage", "test-results", "dist", "tsconfig.tsbuildinfo"];

for (const path of paths) {
  rmSync(path, { recursive: true, force: true });
}

console.log(`Cleaned: ${paths.join(", ")}`);
