import { ZodError } from "zod";
import { AppError } from "../utils/errors.js";

export function validateBody(schema) {
  return (req, _res, next) => {
    try {
      req.validatedBody = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new AppError(400, error.issues.map((issue) => issue.message).join(", ")));
        return;
      }
      next(error);
    }
  };
}
