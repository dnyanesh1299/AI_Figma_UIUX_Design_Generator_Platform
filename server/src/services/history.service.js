import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/errors.js";

/**
 * Get the generation history for a specific user.
 * 
 * @param {string} userId - User's UUID
 * @param {number} limit - Number of records to return
 * @returns {Promise<Array>} List of history items
 */
export async function getUserHistory(userId, limit = 20) {
  if (!userId) {
    throw new AppError(401, "User ID is required");
  }

  try {
    return await prisma.generationHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  } catch (err) {
    if (err.code === "P2021" || err.message?.includes("does not exist")) {
      console.warn("[HistoryService] GenerationHistory table not found — run migrations.");
      return [];
    }
    throw err;
  }
}

/**
 * Save a newly generated design to the user's history.
 * 
 * @param {string} userId - User's UUID
 * @param {string} prompt - User's input prompt
 * @param {object} classification - AI classification JSON
 * @param {object} schema - Generated UI layout schema JSON
 * @returns {Promise<object|null>} The saved record, or null if schema not applied
 */
export async function saveUserGeneration(userId, prompt, classification, schema) {
  if (!userId) {
    throw new AppError(401, "User ID is required");
  }
  if (!prompt) {
    throw new AppError(400, "Prompt is required");
  }
  if (!schema) {
    throw new AppError(400, "Generated design schema is required");
  }

  try {
    return await prisma.generationHistory.create({
      data: {
        userId,
        prompt,
        classification: classification || null,
        schema,
      },
    });
  } catch (err) {
    if (err.code === "P2021" || err.message?.includes("does not exist")) {
      console.warn("[HistoryService] GenerationHistory table not found — skipping auto-save.");
      return null;
    }
    throw err;
  }
}

/**
 * Delete a specific generation history item.
 * 
 * @param {string} userId - User's UUID
 * @param {string} historyId - Generation history entry UUID
 * @returns {Promise<object>} The deleted history record
 */
export async function deleteHistoryItem(userId, historyId) {
  if (!userId) {
    throw new AppError(401, "User ID is required");
  }
  if (!historyId) {
    throw new AppError(400, "History ID is required");
  }

  try {
    // Ensure the history item belongs to the user
    const item = await prisma.generationHistory.findFirst({
      where: { id: historyId, userId },
    });

    if (!item) {
      throw new AppError(404, "History item not found or unauthorized");
    }

    return await prisma.generationHistory.delete({
      where: { id: historyId },
    });
  } catch (err) {
    if (err.code === "P2021" || err.message?.includes("does not exist")) {
      throw new AppError(400, "History database not configured yet");
    }
    throw err;
  }
}
