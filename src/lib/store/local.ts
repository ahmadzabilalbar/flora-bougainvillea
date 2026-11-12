import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { TABLES, type Row, type TableName } from "../schema";
import type { Store } from "./types";

// Development fallback used when Google Sheets credentials are not configured.
// Not suitable for Vercel (read-only, ephemeral filesystem).
const FILE = path.join(process.cwd(), ".data", "db.json");

type DB = Partial<Record<TableName, Row[]>>;

async function load(): Promise<DB> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    return {};
  }
}

async function save(db: DB) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(db, null, 2));
}

export const localStore: Store = {
  kind: "local-json",

  async ensureSchema() {
    const db = await load();
    const missing = (Object.keys(TABLES) as TableName[]).filter((t) => !db[t]);
    missing.forEach((t) => (db[t] = []));
    await save(db);
    return missing;
  },

  async list(table) {
    return (await load())[table] ?? [];
  },

  async insert(table, row) {
    const db = await load();
    (db[table] ??= []).push(row);
    await save(db);
  },

  async update(table, keyField, key, patch) {
    const db = await load();
    const rows = db[table] ?? [];
    const i = rows.findIndex((r) => r[keyField] === key);
    if (i === -1) return false;
    rows[i] = { ...rows[i], ...patch };
    await save(db);
    return true;
  },

  async upsertMany(table, keyField, incoming) {
    const db = await load();
    const rows = (db[table] ??= []);
    for (const row of incoming) {
      const i = rows.findIndex((r) => r[keyField] === row[keyField]);
      if (i === -1) rows.push(row);
      else rows[i] = { ...rows[i], ...row };
    }
    await save(db);
  },

  async remove(table, keyField, key) {
    const db = await load();
    const rows = db[table] ?? [];
    const i = rows.findIndex((r) => r[keyField] === key);
    if (i === -1) return false;
    rows.splice(i, 1);
    await save(db);
    return true;
  },
};
