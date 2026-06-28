import { getUserHistory, deleteHistoryItem } from "../services/history.service.js";

/**
 * GET /api/history
 * Fetches the generation history for the logged-in user.
 */
export async function getHistoryController(req, res, next) {
  try {
    const userId = req.user?.id;
    const limit = Math.min(parseInt(req.query.limit || "20", 10), 100);

    const history = await getUserHistory(userId, limit);

    return res.status(200).json({
      status: "success",
      data: history,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/history/:id
 * Deletes a specific history record for the logged-in user.
 */
export async function deleteHistoryController(req, res, next) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    await deleteHistoryItem(userId, id);

    return res.status(200).json({
      status: "success",
      message: "History item deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}
