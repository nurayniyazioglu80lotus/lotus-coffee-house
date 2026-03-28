import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "admin_session";

function getEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} tanımlı değil.`);
  }
  return value;
}

const ADMIN_USER = getEnv("ADMIN_USER");
const ADMIN_PASS = getEnv("ADMIN_PASS");
const ADMIN_SESSION_SECRET = getEnv("ADMIN_SESSION_SECRET");

export const adminCookieName = COOKIE_NAME;

export function verifyAdminCredentials(username: string, password: string) {
  const userOk = timingSafeCompare(username, ADMIN_USER);
  const passOk = timingSafeCompare(password, ADMIN_PASS);
  return userOk && passOk;
}

function timingSafeCompare(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);

  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

function sign(value: string) {
  return createHmac("sha256", ADMIN_SESSION_SECRET).update(value).digest("hex");
}

export function createAdminSessionValue() {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 12; // 12 saat
  const payload = JSON.stringify({
    user: ADMIN_USER,
    exp: expiresAt,
  });

  const encoded = Buffer.from(payload).toString("base64url");
  const signature = sign(encoded);

  return `${encoded}.${signature}`;
}

export function verifyAdminSessionValue(sessionValue?: string | null) {
  if (!sessionValue) return false;

  const parts = sessionValue.split(".");
  if (parts.length !== 2) return false;

  const [encoded, signature] = parts;
  const expectedSignature = sign(encoded);

  const sigOk = timingSafeCompare(signature, expectedSignature);
  if (!sigOk) return false;

  try {
    const json = Buffer.from(encoded, "base64url").toString("utf8");
    const data = JSON.parse(json) as { user: string; exp: number };

    if (data.user !== ADMIN_USER) return false;
    if (Date.now() > data.exp) return false;

    return true;
  } catch {
    return false;
  }
}