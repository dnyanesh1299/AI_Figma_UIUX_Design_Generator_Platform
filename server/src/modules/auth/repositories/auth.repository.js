import { prisma } from "../../../config/prisma.js";

export const authRepository = {
  findRoleByName(name) {
    return prisma.role.findUnique({ where: { name } });
  },

  findUserByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
      include: { role: true }
    });
  },

  findUserById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: { role: true }
    });
  },

  findUserByProvider(provider, providerId) {
    return prisma.user.findFirst({
      where: {
        authProvider: provider,
        providerId
      },
      include: { role: true }
    });
  },

  createUser(data) {
    return prisma.user.create({
      data,
      include: { role: true }
    });
  },

  updateUser(id, data) {
    return prisma.user.update({
      where: { id },
      data,
      include: { role: true }
    });
  },

  createSession(data) {
    return prisma.session.create({ data });
  },

  findSessionByRefreshToken(refreshToken) {
    return prisma.session.findFirst({
      where: { refreshToken, revoked: false }
    });
  },

  revokeSessionById(id) {
    return prisma.session.update({
      where: { id },
      data: { revoked: true }
    });
  },

  revokeSessionByToken(refreshToken) {
    return prisma.session.updateMany({
      where: { refreshToken },
      data: { revoked: true }
    });
  },

  revokeAllSessionsByUserId(userId) {
    return prisma.session.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true }
    });
  },

  createPasswordReset(data) {
    return prisma.passwordReset.create({ data });
  },

  markPreviousResetTokensUsed(userId) {
    return prisma.passwordReset.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() }
    });
  },

  findValidPasswordResetByToken(tokenHash) {
    return prisma.passwordReset.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() }
      },
      include: { user: { include: { role: true } } }
    });
  },

  usePasswordResetToken(id) {
    return prisma.passwordReset.update({
      where: { id },
      data: { usedAt: new Date() }
    });
  }
};
