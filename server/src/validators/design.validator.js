import { z } from "zod";

// Regex patterns to identify potential spam/gibberish
const SPAM_PATTERNS = [
  /\blorem\s+ipsum\s+dolor\b/i,
  /asd+f/i,
  /qwer+ty/i,
  /([a-zA-Z])\1{7,}/i,         // 8+ repeated letters (e.g., aaaaaaaa)
  /\b(\w+)\b(?:\s+\1\b){3,}/i, // 4+ repeated words (e.g., spam spam spam spam)
  /click\s+here\s+to\s+(?:buy|download|win)/i,
  /free\s+money/i,
  /make\s+money\s+fast/i
];

// Regex patterns for script or HTML injection vectors
const INJECTION_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i,
  /javascript:/i,
  /onload\s*=/i,
  /onerror\s*=/i,
  /onclick\s*=/i
];

export const generateDesignSchema = z.object({
  prompt: z
    .string({
      required_error: "Prompt is required",
      invalid_type_error: "Prompt must be a string",
    })
    .trim()
    .min(1, "Prompt cannot be empty")
    .min(5, "Prompt must be at least 5 characters long")
    .max(10000, "Prompt must not exceed 10000 characters")
    .refine(
      (val) => {
        // Prevent code / script injection
        for (const pattern of INJECTION_PATTERNS) {
          if (pattern.test(val)) {
            console.warn(`[VALIDATOR] Prompt rejected by injection pattern: ${pattern}`);
            return false;
          }
        }
        return true;
      },
      {
        message: "Prompt contains invalid or restricted script/injection sequences",
      }
    )
    .refine(
      (val) => {
        // Run standard spam pattern check
        for (const pattern of SPAM_PATTERNS) {
          if (pattern.test(val)) {
            console.warn(`[VALIDATOR] Prompt rejected by spam pattern: ${pattern}`);
            return false;
          }
        }

        // Gibberish check: Reject words longer than 12 alphabetical chars with no vowels
        const words = val.split(/\s+/);
        for (const word of words) {
          if (word.length > 12 && !/[aeiouyAEIOUY]/i.test(word) && /^[a-zA-Z]+$/.test(word)) {
            console.warn(`[VALIDATOR] Prompt rejected by gibberish check for word: "${word}"`);
            return false;
          }
        }
        return true;
      },
      {
        message: "Prompt flagged as spam or gibberish",
      }
    ),
});

export const modifyDesignSchema = z.object({
  prompt: z
    .string({
      required_error: "Prompt is required",
      invalid_type_error: "Prompt must be a string",
    })
    .trim()
    .min(1, "Prompt cannot be empty")
    .min(5, "Prompt must be at least 5 characters long")
    .max(10000, "Prompt must not exceed 10000 characters")
    .refine(
      (val) => {
        for (const pattern of INJECTION_PATTERNS) {
          if (pattern.test(val)) return false;
        }
        return true;
      },
      {
        message: "Prompt contains invalid or restricted script/injection sequences",
      }
    )
    .refine(
      (val) => {
        for (const pattern of SPAM_PATTERNS) {
          if (pattern.test(val)) return false;
        }
        const words = val.split(/\s+/);
        for (const word of words) {
          if (word.length > 12 && !/[aeiouyAEIOUY]/i.test(word) && /^[a-zA-Z]+$/.test(word)) {
            return false;
          }
        }
        return true;
      },
      {
        message: "Prompt flagged as spam or gibberish",
      }
    ),
  schema: z.record(z.any(), {
    required_error: "Base design schema is required",
    invalid_type_error: "Base design schema must be an object",
  }),
  classification: z.record(z.any()).optional(),
});

