const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const databasePath = process.env.DATABASE_PATH || "server/database/tasknest.sqlite";
const resolvedPath = path.resolve(process.cwd(), databasePath);

// Make sure the database directory exists before opening the file.
// (better-sqlite3 throws if the parent folder is missing.)
fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });

const db = new Database(resolvedPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

module.exports = db;
