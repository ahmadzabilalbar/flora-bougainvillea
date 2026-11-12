import "server-only";
import { JWT } from "google-auth-library";
import { TABLES, type Row, type TableName } from "../schema";
import type { Store } from "./types";

const API = "https://sheets.googleapis.com/v4/spreadsheets";

let client: JWT | null = null;

function getClient() {
  if (!client) {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
    // Vercel env vars store the key with literal "\n" sequences.
    const key = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n");
    client = new JWT({
      email,
      key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  }
  return client;
}

async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const { token } = await getClient().getAccessToken();
  const res = await fetch(`${API}/${process.env.GOOGLE_SHEET_ID}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google Sheets API ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json() as Promise<T>;
}

type SheetMeta = { sheets: { properties: { sheetId: number; title: string } }[] };

async function sheetIds(): Promise<Map<string, number>> {
  const meta = await api<SheetMeta>("?fields=sheets.properties(sheetId,title)");
  return new Map(meta.sheets.map((s) => [s.properties.title, s.properties.sheetId]));
}

const range = (table: TableName, a1 = "") => encodeURIComponent(`'${table}'${a1 ? "!" + a1 : ""}`);

/** Reads a tab and returns [headers, rows-as-arrays]. Missing tab → empty. */
async function readRaw(table: TableName): Promise<{ headers: string[]; values: string[][] }> {
  try {
    const data = await api<{ values?: string[][] }>(`/values/${range(table)}`);
    const [headers = [], ...values] = data.values ?? [];
    return { headers, values };
  } catch (e) {
    if (e instanceof Error && e.message.includes("Unable to parse range")) {
      return { headers: [], values: [] };
    }
    throw e;
  }
}

function toArray(headers: string[], row: Row) {
  return headers.map((h) => row[h] ?? "");
}

function colLetter(n: number) {
  let s = "";
  for (n++; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
}

export const sheetsStore: Store = {
  kind: "google-sheets",

  async ensureSchema() {
    const ids = await sheetIds();
    const missing = (Object.keys(TABLES) as TableName[]).filter((t) => !ids.has(t));
    if (missing.length) {
      await api(":batchUpdate", {
        method: "POST",
        body: JSON.stringify({
          requests: missing.map((title) => ({ addSheet: { properties: { title } } })),
        }),
      });
    }
    // Make sure every expected header exists (append any new columns at the end).
    for (const table of Object.keys(TABLES) as TableName[]) {
      const { headers } = await readRaw(table);
      const wanted = [...headers, ...TABLES[table].filter((h) => !headers.includes(h))];
      if (wanted.length !== headers.length) {
        await api(`/values/${range(table, "A1")}?valueInputOption=RAW`, {
          method: "PUT",
          body: JSON.stringify({ values: [wanted] }),
        });
      }
    }
    return missing;
  },

  async list(table) {
    const { headers, values } = await readRaw(table);
    return values
      .filter((r) => r.some((c) => c !== ""))
      .map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""])));
  },

  async insert(table, row) {
    let { headers } = await readRaw(table);
    if (!headers.length) {
      await this.ensureSchema();
      headers = [...TABLES[table]];
    }
    await api(`/values/${range(table, "A1")}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
      method: "POST",
      body: JSON.stringify({ values: [toArray(headers, row)] }),
    });
  },

  async update(table, keyField, key, patch) {
    const { headers, values } = await readRaw(table);
    const k = headers.indexOf(keyField);
    const idx = values.findIndex((r) => r[k] === key);
    if (idx === -1) return false;
    const current = Object.fromEntries(headers.map((h, i) => [h, values[idx][i] ?? ""]));
    const rowNum = idx + 2; // 1-based + header row
    const a1 = `A${rowNum}:${colLetter(headers.length - 1)}${rowNum}`;
    await api(`/values/${range(table, a1)}?valueInputOption=RAW`, {
      method: "PUT",
      body: JSON.stringify({ values: [toArray(headers, { ...current, ...patch })] }),
    });
    return true;
  },

  async upsertMany(table, keyField, rows) {
    const { headers, values } = await readRaw(table);
    if (!headers.length) {
      await this.ensureSchema();
      return this.upsertMany(table, keyField, rows);
    }
    const k = headers.indexOf(keyField);
    const data: { range: string; values: string[][] }[] = [];
    const toAppend: string[][] = [];
    for (const row of rows) {
      const idx = values.findIndex((r) => r[k] === row[keyField]);
      if (idx === -1) toAppend.push(toArray(headers, row));
      else {
        const current = Object.fromEntries(headers.map((h, i) => [h, values[idx][i] ?? ""]));
        const n = idx + 2;
        data.push({
          range: `'${table}'!A${n}:${colLetter(headers.length - 1)}${n}`,
          values: [toArray(headers, { ...current, ...row })],
        });
      }
    }
    if (data.length) {
      await api("/values:batchUpdate", {
        method: "POST",
        body: JSON.stringify({ valueInputOption: "RAW", data }),
      });
    }
    if (toAppend.length) {
      await api(`/values/${range(table, "A1")}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
        method: "POST",
        body: JSON.stringify({ values: toAppend }),
      });
    }
  },

  async remove(table, keyField, key) {
    const { headers, values } = await readRaw(table);
    const k = headers.indexOf(keyField);
    const idx = values.findIndex((r) => r[k] === key);
    if (idx === -1) return false;
    const sheetId = (await sheetIds()).get(table);
    await api(":batchUpdate", {
      method: "POST",
      body: JSON.stringify({
        requests: [
          {
            deleteDimension: {
              range: { sheetId, dimension: "ROWS", startIndex: idx + 1, endIndex: idx + 2 },
            },
          },
        ],
      }),
    });
    return true;
  },
};
