import type { Row, TableName } from "../schema";

export interface Store {
  kind: "google-sheets" | "local-json";
  /** Creates missing tabs / header columns. Returns the tabs that were created. */
  ensureSchema(): Promise<string[]>;
  list(table: TableName): Promise<Row[]>;
  insert(table: TableName, row: Row): Promise<void>;
  update(table: TableName, keyField: string, key: string, patch: Row): Promise<boolean>;
  upsertMany(table: TableName, keyField: string, rows: Row[]): Promise<void>;
  remove(table: TableName, keyField: string, key: string): Promise<boolean>;
}
