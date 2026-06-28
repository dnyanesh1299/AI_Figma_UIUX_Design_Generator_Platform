import { authRepository } from "../modules/auth/repositories/auth.repository.js";
import { verifyAccessToken } from "../modules/auth/auth.utils.js";
import { AppError } from "../utils/errors.js";

export async function requireAuth(req, _res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : req.cookies.access_token;

  if (!token) {
    return next(new AppError(401, "Authentication required"));
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await authRepository.findUserById(payload.sub);
    if (!user) {
      return next(new AppError(401, "Invalid authentication token"));
    }
    req.user = {
      id: user.id,
      role: user.role.name,
      permissions: user.role.permissions ?? {}
    };
    return next();
  } catch (_error) {
    return next(new AppError(401, "Invalid or expired access token"));
  }
}

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError(401, "Authentication required"));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, "Forbidden: insufficient role"));
    }
    return next();
  };
}

export function requirePermission(permission) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError(401, "Authentication required"));
    }
    if (!req.user.permissions?.[permission]) {
      return next(new AppError(403, "Forbidden: missing permission"));
    }
    return next();
  };
}
