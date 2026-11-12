import "server-only";
import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SESSION_TTL, createSessionToken, verifySessionToken } from "./session";

const digest = (s: string) => createHash("sha256").update(s).digest();

export function checkCredentials(username: string, password: string) {
  const u = process.env.ADMIN_USERNAME || "admin";
  const p = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === "production" ? "" : "admin");
  if (!p) return false; // refuse to log in with no password configured in production
  // Compare fixed-length digests so timing doesn't leak length or prefix matches.
  const okUser = timingSafeEqual(digest(username), digest(u));
  const okPass = timingSafeEqual(digest(password), digest(p));
  return okUser && okPass;
}

export async function startSession(username: string) {
  (await cookies()).set(SESSION_COOKIE, await createSessionToken(username), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getSession() {
  return verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
}

/** Call at the top of every admin Server Action / page — actions are public endpoints. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}
