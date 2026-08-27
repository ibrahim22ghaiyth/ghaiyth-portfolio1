const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const DATA_DIR = path.join(__dirname, "data");
const DB_PATH = path.join(DATA_DIR, "qassitha.sqlite");
const SEED_SQL = path.join(DATA_DIR, "seed.sql");
if (!fs.existsSync(SEED_SQL)) { console.error("seed.sql not found"); process.exit(1); }
for (const f of [DB_PATH, DB_PATH + "-wal", DB_PATH + "-shm"]) if (fs.existsSync(f)) fs.unlinkSync(f);
const db = new Database(DB_PATH);
db.exec(fs.readFileSync(SEED_SQL, "utf8"));
db.close();
console.log("Qassitha database rebuilt from seed.sql successfully.");
