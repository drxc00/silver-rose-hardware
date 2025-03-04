import { GoogleGenerativeAI } from "@google/generative-ai";

export const gemini = new GoogleGenerativeAI(
  process.env.GEMINI_FLASH_API_KEY! // Required
);
