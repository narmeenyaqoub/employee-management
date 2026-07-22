const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "data.sqlite");

let db = null;

// Loads the database from disk if it exists, otherwise creates a fresh one
// with the required tables. Must be awaited once before the server starts
// handling requests.
async function initDatabase() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      department TEXT NOT NULL,
      role TEXT NOT NULL
    );
  `);

  saveToDisk();
  return db;
}

// Writes the current in-memory database out to data.sqlite so changes
// survive a server restart. sql.js keeps everything in memory, so this
// must be called after every insert/update/delete.
function saveToDisk() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

let cachedLastInsertId = null;

// Runs an INSERT/UPDATE/DELETE statement and persists the result to disk.
// Note: db.export() (used by saveToDisk) resets SQLite's last_insert_rowid()
// tracking, so the id must be read immediately after the statement runs,
// before saving to disk.
function run(sql, params = []) {
  db.run(sql, params);
  const result = db.exec("SELECT last_insert_rowid() AS id;");
  cachedLastInsertId = result[0].values[0][0];
  saveToDisk();
}

// Returns the id of the most recently inserted row (from the last run() call).
function lastInsertId() {
  return cachedLastInsertId;
}

// Returns a single row (or null) for a SELECT statement.
function getOne(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const row = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return row;
}

// Returns all matching rows for a SELECT statement.
function getAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

module.exports = { initDatabase, run, lastInsertId, getOne, getAll };
