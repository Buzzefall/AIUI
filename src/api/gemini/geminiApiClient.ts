import {
  GoogleGenerativeAI,
  GenerateContentResult
} from '@google/generative-ai';
import { Content } from '@google/generative-ai';
import { GeminiRequest } from './types';

/**
 * A client for interacting with the Google Gemini API.
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

  /** Generates content as part of a conversation.
   * It uses the provided history to inform the model's response.
   *
   * @param config The configuration for the prompt.
   * @returns A promise that resolves with the generation result.
   */
  public async generateContent(config: GeminiRequest): Promise<GenerateContentResult> {
    const modelName = 'gemini-2.5-pro';
    // const hasImageData = config.latestUserMessage.some(part => 'inlineData' in part);
    const model = this.googleAi.getGenerativeModel({
      model: modelName,
      generationConfig: config.generationConfig,
      safetySettings: config.safetySettings,
    });

    const contents: Content[] = [
      ...config.history, // The existing messages from previous turns
      { role: 'user', parts: config.latestUserMessage }, // The new user message
    ];

    return model.generateContent({ contents });
  }
}