import {
  GoogleGenAI,
  GenerateContentResponse,
  GenerateContentConfig,
  CountTokensResponse,
  Content,
} from '@google/genai';
import { GeminiRequest } from './types';
import { Conversation } from '../../state/chatSlice';

/**
 * A client for interacting with the Google Gemini API.
 */
export class GeminiApiClient {
  private readonly googleAi: GoogleGenAI;
  private readonly modelName = 'gemini-2.5-pro'; // Using user-specified model name.

  /**
   * @param apiKey The API key for authenticating with the Gemini API.
   */
  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('API key is required to initialize GeminiApiClient.');
    }
    // As per the migration guide, the constructor takes an object with the apiKey.
    this.googleAi = new GoogleGenAI({ apiKey });
  }

  /** Generates content as part of a conversation.
   * It uses the provided history to inform the model's response.
   *
   * @param config The configuration for the prompt.
   * @returns A promise that resolves with the generation result.
   */
  public async generateContent(config: GeminiRequest): Promise<GenerateContentResponse> {
    const contents: Content[] = [
      ...config.history,
      { role: 'user', parts: config.latestUserMessage },
    ];

    const requestConfig: GenerateContentConfig = {
        ...config.generationConfig,
        thinkingConfig: config.thinkingConfig,
    };

    return this.googleAi.models.generateContent({
      model: this.modelName,
      contents: contents,
      config: requestConfig,
    });
  }

  /**
   * Counts the number of tokens in the conversation history.
   *
   * @param conversation The conversation history to count tokens for.
   * @returns A promise that resolves with the token count result.
   */
  public async countTokens(conversation: Conversation['messages']): Promise<CountTokensResponse> {
    // Filter out parts with empty inlineData.data, which the API rejects.
    const sanitizedHistory = conversation.map(message => ({
      ...message.content,
      parts: (message.content.parts || []).filter(part => !part.inlineData || (part.inlineData && part.inlineData.data))
    }));

    return this.googleAi.models.countTokens({
      model: this.modelName,
      contents: sanitizedHistory,
    });
  }
}
