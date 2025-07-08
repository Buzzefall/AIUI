import {
  GoogleGenerativeAI,
  GenerateContentResult,
  Part,
} from '@google/generative-ai';
import { GeminiRequest } from './types';

/**
 * A client for interacting with the Google Gemini API.
 * This class encapsulates the logic for making API requests,
 * making it reusable and decoupled from the UI.
 */
export class GeminiApiClient {
  private readonly googleAi: GoogleGenerativeAI;

  /**
   * @param apiKey The API key for authenticating with the Gemini API.
   */
  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('API key is required to initialize GeminiApiClient.');
    }
    this.googleAi = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Generates content based on the provided prompt configuration.
   * It supports both text-only and multimodal (text and image) prompts.
   *
   * @param config The configuration for the prompt.
   * @returns A promise that resolves with the generation result.
   */
  public async generateContent(config: GeminiRequest): Promise<GenerateContentResult> {
    const modelName = 'gemini-2.5-pro';
    const model = this.googleAi.getGenerativeModel({
      model: modelName,
      generationConfig: config.generationConfig,
      safetySettings: config.safetySettings,
    });

    const parts: Part[] = [{ text: config.prompt }];

    if (config.file) {
      parts.push({ inlineData: { mimeType: config.file.mimeType, data: config.file.base64 } });
    }

    return model.generateContent({ contents: [{ role: 'user', parts }] });
  }
}