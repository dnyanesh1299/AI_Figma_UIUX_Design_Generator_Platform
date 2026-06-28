import { Router } from "express";
import { getHistoryController, deleteHistoryController } from "../controllers/history.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/**
 * Route: GET /api/history
 * Description: Get current user's design history list
 * Access: Private (Auth required)
 */
router.get("/", requireAuth, getHistoryController);

/**
 * Route: DELETE /api/history/:id
 * Description: Delete a design history record
 * Access: Private (Auth required)
 */
router.delete("/:id", requireAuth, deleteHistoryController);

export default router;
