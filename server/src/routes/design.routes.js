import { Router } from "express";
import { generateDesignController, modifyDesignController, pollinationsProxyController } from "../controllers/design.controller.js";
import { generateDesignSchema, modifyDesignSchema } from "../validators/design.validator.js";
import { validateBody } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/**
 * Route: POST /api/generate-design
 * Description: Generates a dynamic UI JSON design schema from a text prompt.
 * Access: Private (Auth required)
 */
router.post(
  "/generate-design",
  requireAuth,
  validateBody(generateDesignSchema),
  generateDesignController
);

/**
 * Route: POST /api/modify-design
 * Description: Modifies an existing UI JSON design schema based on a text prompt.
 * Access: Private (Auth required)
 */
router.post(
  "/modify-design",
  requireAuth,
  validateBody(modifyDesignSchema),
  modifyDesignController
);

/**
 * Route: GET /api/images/pollinations
 * Description: Proxies image generation requests to Pollinations AI to bypass Turnstile block.
 * Access: Public (no auth required for standard img tags)
 */
router.get("/images/pollinations", pollinationsProxyController);

export default router;
