import "server-only";
import { localStore } from "./local";
import { sheetsStore } from "./sheets";
import type { Store } from "./types";

export const sheetsConfigured = Boolean(
  process.env.GOOGLE_SHEET_ID &&
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY,
);

export const store: Store = sheetsConfigured ? sheetsStore : localStore;
