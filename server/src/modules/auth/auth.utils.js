import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env, isProduction } from "../../config/env.js";

const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

function parseDurationToMs(duration) {
  const match = /^(\d+)([smhd])$/.exec(duration);
  if (!match) {
    return 15 * 60 * 1000;
  }
  const amount = Number(match[1]);
  const unit = match[2];
  const multiplier = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  }[unit];
  return amount * multiplier;
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function createAccessToken(payload) {
  return jwt.sign(payload, env.jwtAccessSecret, { expiresIn: env.jwtAccessExpires });
}

export function createRefreshToken(payload) {
  return jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpires });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtAccessSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwtRefreshSecret);
}

export function getRefreshExpiryDate() {
  return new Date(Date.now() + parseDurationToMs(env.jwtRefreshExpires));
}

export function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    authProvider: user.authProvider,
    emailVerified: user.emailVerified,
    role: user.role?.name ?? null,
    permissions: user.role?.permissions ?? null,
    createdAt: user.createdAt
  };
}

export function setAuthCookies(res, refreshToken, accessToken) {
  const common = {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction
  };
  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...common,
    maxAge: parseDurationToMs(env.jwtRefreshExpires)
  });
  res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
    ...common,
    maxAge: parseDurationToMs(env.jwtAccessExpires)
  });
}

export function clearAuthCookies(res) {
  res.clearCookie(REFRESH_TOKEN_COOKIE);
  res.clearCookie(ACCESS_TOKEN_COOKIE);
}
