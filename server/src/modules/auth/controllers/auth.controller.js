import { env } from "../../../config/env.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { authService } from "../services/auth.service.js";
import { clearAuthCookies, REFRESH_TOKEN_COOKIE, setAuthCookies } from "../auth.utils.js";

function requestMeta(req) {
  return {
    ipAddress: req.ip,
    userAgent: req.get("user-agent") ?? "unknown"
  };
}

export const signup = asyncHandler(async (req, res) => {
  const result = await authService.signup(req.validatedBody, requestMeta(req));
  setAuthCookies(res, result.refreshToken, result.accessToken);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.validatedBody, requestMeta(req));
  setAuthCookies(res, result.refreshToken, result.accessToken);
  res.status(200).json(result);
});

export const refresh = asyncHandler(async (req, res) => {
  const tokenFromCookie = req.cookies[REFRESH_TOKEN_COOKIE];
  const token = req.validatedBody?.refreshToken ?? tokenFromCookie;
  const result = await authService.refresh(token, requestMeta(req));
  setAuthCookies(res, result.refreshToken, result.accessToken);
  res.status(200).json(result);
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies[REFRESH_TOKEN_COOKIE] ?? req.body?.refreshToken;
  await authService.logout(token);
  clearAuthCookies(res);
  res.status(200).json({ message: "Logged out successfully" });
});

export const logoutAll = asyncHandler(async (req, res) => {
  await authService.logoutAll(req.user.id);
  clearAuthCookies(res);
  res.status(200).json({ message: "Logged out from all devices" });
});

export const me = asyncHandler(async (req, res) => {
  const user = await authService.me(req.user.id);
  res.status(200).json({ user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.validatedBody.email);
  res.status(200).json({
    message: "If the account exists, a reset link has been sent."
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.validatedBody.token, req.validatedBody.newPassword);
  res.status(200).json({ message: "Password reset successful" });
});

export const oauthSuccess = asyncHandler(async (req, res) => {
  const result = await authService.finishOAuthLogin(req.user, requestMeta(req));
  setAuthCookies(res, result.refreshToken, result.accessToken);
  const redirectUrl = `${env.frontendUrl}/login?oauth=success`;
  res.redirect(redirectUrl);
});
