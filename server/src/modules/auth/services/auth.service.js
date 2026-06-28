import { prisma } from "../../../config/prisma.js";
import { env } from "../../../config/env.js";
import { AppError } from "../../../utils/errors.js";
import { createRandomToken, hashToken } from "../../../utils/crypto.js";
import { sendMail } from "../../../utils/mailer.js";
import { authRepository } from "../repositories/auth.repository.js";
import {
  comparePassword,
  createAccessToken,
  createRefreshToken,
  getRefreshExpiryDate,
  hashPassword,
  sanitizeUser,
  verifyRefreshToken
} from "../auth.utils.js";

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

async function issueTokensAndSession(user, meta) {
  const accessToken = createAccessToken({
    sub: user.id,
    role: user.role.name,
    permissions: user.role.permissions ?? {}
  });
  const refreshToken = createRefreshToken({ sub: user.id, type: "refresh" });
  const expiresAt = getRefreshExpiryDate();

  await authRepository.createSession({
    userId: user.id,
    refreshToken,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    expiresAt,
    revoked: false
  });

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken
  };
}

export const authService = {
  async signup(input, meta) {
    const email = normalizeEmail(input.email);
    const existingUser = await authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new AppError(409, "Email already in use");
    }

    const defaultRole = await authRepository.findRoleByName("user");
    if (!defaultRole) {
      throw new AppError(500, "Default role not configured");
    }

    const passwordHash = await hashPassword(input.password);
    const user = await authRepository.createUser({
      name: input.name.trim(),
      email,
      passwordHash,
      roleId: defaultRole.id,
      authProvider: "local",
      emailVerified: false
    });

    return issueTokensAndSession(user, meta);
  },

  async login(input, meta) {
    const email = normalizeEmail(input.email);
    const user = await authRepository.findUserByEmail(email);
    if (!user || !user.passwordHash) {
      throw new AppError(401, "Invalid email or password");
    }

    const isValid = await comparePassword(input.password, user.passwordHash);
    if (!isValid) {
      throw new AppError(401, "Invalid email or password");
    }

    await authRepository.updateUser(user.id, { lastLoginAt: new Date() });
    return issueTokensAndSession(user, meta);
  },

  async refresh(refreshToken, meta) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (_error) {
      throw new AppError(401, "Invalid refresh token");
    }

    const existingSession = await authRepository.findSessionByRefreshToken(refreshToken);
    if (!existingSession || existingSession.expiresAt < new Date()) {
      throw new AppError(401, "Refresh token expired or revoked");
    }

    await authRepository.revokeSessionById(existingSession.id);

    const user = await authRepository.findUserById(payload.sub);
    if (!user) {
      throw new AppError(401, "User not found");
    }

    return issueTokensAndSession(user, meta);
  },

  async logout(refreshToken) {
    if (!refreshToken) {
      return;
    }
    await authRepository.revokeSessionByToken(refreshToken);
  },

  async logoutAll(userId) {
    await authRepository.revokeAllSessionsByUserId(userId);
  },

  async me(userId) {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }
    return sanitizeUser(user);
  },

  async handleOAuthUser(profile) {
    if (!profile.email) {
      throw new AppError(400, "OAuth account does not provide email");
    }

    const email = normalizeEmail(profile.email);
    const defaultRole = await authRepository.findRoleByName("user");
    if (!defaultRole) {
      throw new AppError(500, "Default role not configured");
    }

    const userByProvider = await authRepository.findUserByProvider(profile.provider, profile.providerId);
    if (userByProvider) {
      return authRepository.updateUser(userByProvider.id, {
        name: profile.name,
        avatarUrl: profile.avatarUrl ?? userByProvider.avatarUrl,
        lastLoginAt: new Date()
      });
    }

    const userByEmail = await authRepository.findUserByEmail(email);
    if (userByEmail) {
      return authRepository.updateUser(userByEmail.id, {
        authProvider: profile.provider,
        providerId: profile.providerId,
        avatarUrl: profile.avatarUrl ?? userByEmail.avatarUrl,
        emailVerified: true,
        lastLoginAt: new Date()
      });
    }

    return authRepository.createUser({
      name: profile.name,
      email,
      avatarUrl: profile.avatarUrl,
      authProvider: profile.provider,
      providerId: profile.providerId,
      emailVerified: true,
      roleId: defaultRole.id,
      lastLoginAt: new Date()
    });
  },

  async finishOAuthLogin(user, meta) {
    return issueTokensAndSession(user, meta);
  },

  async forgotPassword(email) {
    const normalized = normalizeEmail(email);
    const user = await authRepository.findUserByEmail(normalized);
    if (!user) {
      return;
    }

    const rawToken = createRandomToken(32);
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.$transaction(async (tx) => {
      await tx.passwordReset.updateMany({
        where: { userId: user.id, usedAt: null },
        data: { usedAt: new Date() }
      });
      await tx.passwordReset.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt
        }
      });
    });

    const resetLink = `${env.frontendUrl}/reset-password?token=${rawToken}`;
    await sendMail({
      to: user.email,
      subject: "Reset your password",
      html: `<p>Use the link below to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p><p>This link expires in 1 hour.</p>`
    });
  },

  async resetPassword(token, newPassword) {
    const tokenHash = hashToken(token);
    const record = await authRepository.findValidPasswordResetByToken(tokenHash);
    if (!record) {
      throw new AppError(400, "Invalid or expired reset token");
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: record.userId },
        data: { passwordHash, authProvider: "local" }
      });
      await tx.passwordReset.update({
        where: { id: record.id },
        data: { usedAt: new Date() }
      });
      await tx.passwordReset.updateMany({
        where: { userId: record.userId, usedAt: null },
        data: { usedAt: new Date() }
      });
      await tx.session.updateMany({
        where: { userId: record.userId, revoked: false },
        data: { revoked: true }
      });
    });
  }
};
