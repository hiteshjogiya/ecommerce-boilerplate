import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const seedFile = resolve("supabase/seed/001_seed_catalog.sql");
const databaseUrl = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;

if (!existsSync(seedFile)) {
  console.error(`Seed file not found: ${seedFile}`);
  process.exit(1);
}

if (!databaseUrl) {
  console.error("Missing SUPABASE_DB_URL (or DATABASE_URL).\nSet it before running: npm run seed");
  process.exit(1);
}

const result = spawnSync("psql", [databaseUrl, "-f", seedFile], {
  stdio: "inherit",
  shell: true,
});

if (result.status !== 0) {
  console.error("Seeding failed. Ensure psql is installed and the database URL is correct.");
  process.exit(result.status ?? 1);
}

console.log("Seed completed successfully.");
