import { generateCompletion } from "./openrouter.service.js";
import {
  getClassificationPrompt,
  getCombinedSystemPrompt,
  getModifySystemPrompt
} from "../prompts/design.prompts.js";
import { sanitizeAndParseJson, getFallbackDesign } from "../utils/jsonSanitizer.js";

/**
 * Runs the AI prompt engineering pipeline:
 * 1. Calls AI to classify the user's prompt (extracting platform, industry, style, and complexity).
 * 2. Compiles a custom, combined system prompt incorporating the classification parameters, tokens guidelines, component maps and layout constraints.
 * 3. Calls AI to generate the complete UI design schema in a single combined call.
 * 4. Sanitizes, parses, and returns the schema.
 * 5. Falls back to a clean design structure if parsing fails.
 * 
 * @param {string} prompt - The raw user prompt
 * @returns {Promise<object>} Object containing success status, classification metadata, and the UI schema
 */
export async function generateUiDesign(prompt) {
  // Default fallback classification parameters
  let classification = {
    platform: "web",
    industry: "generic",
    style: "modern",
    complexity: "medium",
    colorMood: "vibrant",
    brandPersonality: "friendly",
    motionLevel: "subtle",
    iconStyle: "outline",
    borderRadius: "soft",
    shadowDepth: "flat"
  };

  // Step 1: Prompt Classification Engine
  try {
    const classificationMessages = [
      { role: "user", content: getClassificationPrompt(prompt) }
    ];

    const rawClassification = await generateCompletion(classificationMessages, {
      temperature: 0.1,
    });

    const parsedClassification = sanitizeAndParseJson(rawClassification);

    if (parsedClassification) {
      classification = {
        platform: parsedClassification.platform || classification.platform,
        industry: parsedClassification.industry || classification.industry,
        style: parsedClassification.style || classification.style,
        complexity: parsedClassification.complexity || classification.complexity,
        colorMood: parsedClassification.colorMood || classification.colorMood,
        brandPersonality: parsedClassification.brandPersonality || classification.brandPersonality,
        motionLevel: parsedClassification.motionLevel || classification.motionLevel,
        iconStyle: parsedClassification.iconStyle || classification.iconStyle,
        borderRadius: parsedClassification.borderRadius || classification.borderRadius,
        shadowDepth: parsedClassification.shadowDepth || classification.shadowDepth
      };
    }
  } catch (classifyErr) {
    console.warn("AI Prompt Classification failed, using defaults:", classifyErr.message);
  }

  // Step 2 & 3: Combined System Prompt & Layout Generation
  const combinedSystemPrompt = getCombinedSystemPrompt(classification, prompt);
  const generationMessages = [
    { role: "user", content: combinedSystemPrompt }
  ];

  try {
    const rawUiSchema = await generateCompletion(generationMessages, {
      temperature: 0.3,
    });

    const parsedUiSchema = sanitizeAndParseJson(rawUiSchema);

    if (parsedUiSchema) {
      // Apply baseline key normalizations to ensure schema compliance
      parsedUiSchema.platform = parsedUiSchema.platform || classification.platform;
      parsedUiSchema.theme = parsedUiSchema.theme || classification.style;
      parsedUiSchema.projectType = parsedUiSchema.projectType || `${classification.industry} ${classification.platform}`;

      return {
        success: true,
        classification,
        schema: parsedUiSchema,
      };
    } else {
      throw new Error("Parsed UI layout schema is empty");
    }
  } catch (generationError) {
    console.error("AI UI Schema generation or parsing failed, invoking fallback schema:", generationError.message);

    // Return fallback design schema
    const fallbackSchema = getFallbackDesign(prompt, classification);

    return {
      success: false,
      error: generationError.message,
      classification,
      schema: fallbackSchema,
    };
  }
}

/**
 * Runs the AI prompt engineering pipeline to refine/modify an existing design schema:
 * 1. Formulates the modification prompt containing the base schema.
 * 2. Calls OpenRouter to update the design schema based on the refinement guidelines.
 * 3. Sanitizes, parses, and returns the modified schema.
 * 
 * @param {string} prompt - Refinement / modification instruction
 * @param {object} baseSchema - Original UI layout schema JSON to be modified
 * @param {object} originalClassification - The original classification to maintain context
 * @returns {Promise<object>} Object containing success status, classification metadata, and the updated UI schema
 */
export async function modifyUiDesign(prompt, baseSchema, originalClassification = null) {
  const modifySystemPrompt = getModifySystemPrompt(baseSchema, prompt);
  const generationMessages = [
    { role: "user", content: modifySystemPrompt }
  ];

  try {
    const rawUiSchema = await generateCompletion(generationMessages, {
      temperature: 0.3,
    });

    const parsedUiSchema = sanitizeAndParseJson(rawUiSchema);

    if (parsedUiSchema) {
      // Apply baseline key normalizations to ensure schema compliance
      parsedUiSchema.meta = parsedUiSchema.meta || baseSchema.meta || {};
      parsedUiSchema.meta.updatedAt = new Date().toISOString();

      return {
        success: true,
        classification: originalClassification || baseSchema.classification || { style: parsedUiSchema.theme || "modern" },
        schema: parsedUiSchema,
      };
    } else {
      throw new Error("Parsed modified UI layout schema is empty");
    }
  } catch (error) {
    console.error("AI UI Schema modification failed, falling back to original schema:", error.message);
    return {
      success: false,
      error: error.message,
      classification: originalClassification || baseSchema.classification || {},
      schema: baseSchema,
    };
  }
}

