import axios from "axios";
import { env } from "../config/env.js";

// Initialize an Axios instance pre-configured for OpenRouter
const openrouterClient = axios.create({
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    "Authorization": `Bearer ${env.openrouterApiKey}`,
    "HTTP-Referer": env.frontendUrl || "http://localhost:4000",
    "X-Title": "AI Figma UI/UX Design Generator Platform",
    "Content-Type": "application/json",
  },
  timeout: 90000, // 90 second timeout (reasoning models like deepseek-r1 can take longer to think)
});

/**
 * Interface to request completions from the OpenRouter models.
 * 
 * @param {Array<{role: string, content: string}>} messages - Array of chat messages
 * @param {object} options - Optional overrides (e.g. model, temperature, responseFormat)
 * @returns {Promise<string>} The generated string response from the AI model
 */
export async function generateCompletion(messages, options = {}) {
  try {
    const model = options.model || env.openrouterModel || "openai/gpt-4o-mini";
    const temperature = options.temperature ?? 0.2; // Keep temperature low to enforce strict JSON structure

    const requestBody = {
      model,
      messages,
      temperature,
    };

    // If using compatible models, pass response_format as JSON
    if (options.responseFormat) {
      requestBody.response_format = options.responseFormat;
    }

    const response = await openrouterClient.post("/chat/completions", requestBody);

    const choice = response.data?.choices?.[0];
    if (!choice || !choice.message?.content) {
      throw new Error("No choices or empty text content returned by OpenRouter API");
    }

    return choice.message.content;
  } catch (error) {
    const errorDetails = error.response?.data?.error?.message || error.message;
    throw new Error(`OpenRouter Service Error: ${errorDetails}`);
  }
}
