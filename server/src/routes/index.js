import { Router } from "express";
import authRoutes from "../modules/auth/routes/auth.routes.js";
import designRoutes from "./design.routes.js";
import figmaRoutes from "./figma.routes.js";
import exportRoutes from "./export.routes.js";
import historyRoutes from "./history.routes.js";
import { requireAuth, requirePermission, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use("/", designRoutes);
router.use("/figma", figmaRoutes);
router.use("/export", exportRoutes);
router.use("/history", requireAuth, historyRoutes);

router.get("/admin/dashboard", requireAuth, requireRole("admin"), (_req, res) => {
  res.json({ message: "Admin dashboard data" });
});

router.get("/dashboard/overview", requireAuth, requirePermission("generateDesigns"), (_req, res) => {
  res.json({ message: "User dashboard overview" });
});

export default router;
