/**
 * Simple JWT sign/verify using Node.js built-in crypto.
 * No external dependencies needed.
 */
import crypto from "crypto";

const SECRET = process.env.MOCK_JWT_SECRET || "impactos-dev-secret-change-in-prod";

interface JWTPayload {
  userId: string;
  email: string;
  fullName: string;
  organisationName: string;
  plan: string;
  projectsUsed: number;
  iat?: number;
  exp?: number;
}

function base64url(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function decodeBase64url(str: string): string {
  const padded = str + "=".repeat((4 - (str.length % 4)) % 4);
  return Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString();
}

export function signToken(payload: JWTPayload, expiresInHours = 24 * 7): string {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const body = base64url(
    JSON.stringify({ ...payload, iat: now, exp: now + expiresInHours * 3600 }),
  );
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${sig}`;
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const [header, body, sig] = token.split(".");
    const expected = crypto
      .createHmac("sha256", SECRET)
      .update(`${header}.${body}`)
      .digest("base64url");
    if (sig !== expected) return null;
    const payload = JSON.parse(decodeBase64url(body)) as JWTPayload & { exp?: number };
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function extractToken(authHeader: string | null): string | null {
  if (!authHeader) return null;
  return authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
}
