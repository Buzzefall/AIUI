import { Content, GenerationConfig, Part, SafetySetting } from '@google/generative-ai';

/**
 * Defines the configuration for a request to the Gemini API client.
 * This interface is designed to be flexible and reusable, allowing for
 * multi-turn conversations.
 */
export interface GeminiRequest {
  /** The history of the conversation, excluding the latest user message. */
  history: Content[];

  /** The latest message from the user to be sent to the model. */
  latestUserMessage: Part[];

  /** Optional generation configuration for the model. */
  generationConfig?: GenerationConfig;

  /** Optional safety settings for the request. */
  safetySettings?: SafetySetting[];
}