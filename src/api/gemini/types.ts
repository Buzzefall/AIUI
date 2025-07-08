import { GenerationConfig, SafetySetting } from '@google/generative-ai';
import { FileData } from '../../state/chatSlice';

/**
 * Defines the configuration for a request to the Gemini API client.
 * This interface is designed to be flexible and reusable, allowing for
 * various types of prompts and configurations.
 */
export interface GeminiRequest {
  /** The main text prompt for the model. */
  prompt: string;

  /** Optional file data (e.g., an image) to provide as context. */
  file?: FileData;

  /** Optional generation configuration for the model. */
  generationConfig?: GenerationConfig;

  /** Optional safety settings for the request. */
  safetySettings?: SafetySetting[];
}