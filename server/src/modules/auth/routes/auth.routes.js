import { Router } from "express";
import passport from "passport";
import {
  forgotPassword,
  login,
  logout,
  logoutAll,
  me,
  oauthSuccess,
  refresh,
  resetPassword,
  signup
} from "../controllers/auth.controller.js";
import {
  forgotPasswordSchema,
  loginSchema,
  refreshSchema,
  resetPasswordSchema,
  signupSchema
} from "../validators/auth.validators.js";
import { validateBody } from "../../../middleware/validate.js";
import { requireAuth } from "../../../middleware/auth.js";
import { authRateLimit, forgotPasswordRateLimit, loginRateLimit } from "../../../middleware/rateLimit.js";

const router = Router();

router.post("/signup", authRateLimit, validateBody(signupSchema), signup);
router.post("/login", loginRateLimit, validateBody(loginSchema), login);
router.post("/refresh", authRateLimit, validateBody(refreshSchema), refresh);
router.post("/logout", authRateLimit, logout);
router.post("/logout-all", authRateLimit, requireAuth, logoutAll);
router.get("/me", requireAuth, me);
router.post("/forgot-password", forgotPasswordRateLimit, validateBody(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", authRateLimit, validateBody(resetPasswordSchema), resetPassword);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/api/auth/oauth/failure" }),
  oauthSuccess
);

router.get("/github", passport.authenticate("github", { session: false }));
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/api/auth/oauth/failure" }),
  oauthSuccess
);

router.get("/oauth/failure", (_req, res) => {
  res.status(401).json({ message: "OAuth authentication failed" });
});

export default router;
