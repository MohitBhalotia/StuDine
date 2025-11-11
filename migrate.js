// migrate.js
import fs from "fs";
import path from "path";
const __dirname = path.resolve();
const MIGRATIONS_TABLE = "migrations_history";
import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2/promise";
export const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
async function runMigrations() {


  // Create a migrations tracking table if not exists
  await db.query(`
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) UNIQUE,
      run_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const [appliedRows] = await db.query(`SELECT filename FROM ${MIGRATIONS_TABLE}`);
  const appliedFiles = appliedRows.map((r) => r.filename);

  const migrationDir = path.join(__dirname, "migrations");
  const files = fs.readdirSync(migrationDir).sort();

  for (const file of files) {
    if (!appliedFiles.includes(file)) {
      const sql = fs.readFileSync(path.join(migrationDir, file), "utf8");
      console.log(`🚀 Running migration: ${file}`);
      await db.query(sql);
      await db.query(`INSERT INTO ${MIGRATIONS_TABLE} (filename) VALUES (?)`, [file]);
    }
  }

  console.log("✅ All migrations applied.");
  await db.end();
}

runMigrations().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
