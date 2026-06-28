import axios from "axios";
import { generateUiDesign, modifyUiDesign } from "../services/ai.service.js";
import { saveUserGeneration } from "../services/history.service.js";
import { AppError } from "../utils/errors.js";

/**
 * Controller to handle POST /api/generate-design requests.
 * Triggers the AI prompt classification and schema generation pipeline.
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
export async function generateDesignController(req, res, next) {
  try {
    // Read the validated prompt from req.validatedBody (set by validateBody middleware)
    const { prompt } = req.validatedBody || req.body;

    if (!prompt) {
      throw new AppError(400, "Prompt is required and must be validated");
    }

    // Call the orchestrator service
    const result = await generateUiDesign(prompt);

    // Auto-save to history if user is authenticated
    if (req.user?.id) {
      try {
        await saveUserGeneration(req.user.id, prompt, result.classification, result.schema);
      } catch (saveErr) {
        console.error("[DesignController] Failed to auto-save to history:", saveErr);
      }
    }

    // If the generation failed but a fallback schema was loaded, we still return 200, 
    // but include details that it was a fallback. This guarantees visual continuity.
    if (!result.success) {
      return res.status(200).json({
        status: "partial_success",
        message: "AI generation encountered issues, loaded optimized fallback layout.",
        error: result.error,
        classification: result.classification,
        data: result.schema,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "UI design schema generated successfully",
      classification: result.classification,
      data: result.schema,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller to handle POST /api/modify-design requests.
 * Refines/updates an existing UI schema using a new refinement prompt.
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
export async function modifyDesignController(req, res, next) {
  try {
    const { prompt, schema, classification } = req.validatedBody || req.body;

    if (!prompt) {
      throw new AppError(400, "Prompt is required and must be validated");
    }
    if (!schema) {
      throw new AppError(400, "Base design schema is required to perform modifications");
    }

    // Call the modification service
    const result = await modifyUiDesign(prompt, schema, classification);

    // Auto-save the updated design to history if user is authenticated
    if (req.user?.id) {
      try {
        await saveUserGeneration(req.user.id, prompt, result.classification, result.schema);
      } catch (saveErr) {
        console.error("[DesignController] Failed to auto-save modified design to history:", saveErr);
      }
    }

    if (!result.success) {
      return res.status(200).json({
        status: "partial_success",
        message: "AI modification encountered issues, returned original design.",
        error: result.error,
        classification: result.classification,
        data: result.schema,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "UI design schema modified successfully",
      classification: result.classification,
      data: result.schema,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller to proxy image generation requests to Pollinations AI.
 * Bypasses Cloudflare Turnstile blocks on localhost browser requests.
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
export async function pollinationsProxyController(req, res, next) {
  try {
    const { prompt, width, height, seed } = req.query;

    if (!prompt) {
      throw new AppError(400, "Prompt query parameter is required");
    }

    const cleanPrompt = encodeURIComponent(String(prompt).trim());
    let url = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=${width || 600}&height=${height || 400}&nologo=true&private=true`;

    if (seed) {
      url += `&seed=${seed}`;
    }

    // Append optional backend API key if present
    const apiKey = process.env.POLLINATIONS_API_KEY;
    if (apiKey) {
      url += `&key=${apiKey}`;
    }

    const response = await axios.get(url, {
      responseType: "stream",
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    res.setHeader("Content-Type", response.headers["content-type"] || "image/jpeg");
    response.data.pipe(res);
  } catch (error) {
    console.error("[ImageProxy] Failed to fetch image from Pollinations:", error.message);
    next(new AppError(500, `Failed to generate image: ${error.message}`));
  }
}

