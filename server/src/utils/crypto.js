import crypto from "node:crypto";

export function createRandomToken(bytes = 48) {
  return crypto.randomBytes(bytes).toString("hex");
}

export function hashToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}
