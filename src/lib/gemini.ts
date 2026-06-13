/**
 * Server-side NVIDIA NIM API client initialization (OpenAI-compatible).
 * This module should ONLY be imported in API routes (server-side).
 * @module lib/nvidia
 */

import OpenAI from 'openai';

/**
 * Singleton instance of the OpenAI client configured for NVIDIA NIM API.
 */
let clientInstance: OpenAI | null = null;

/**
 * Initializes and returns the NVIDIA NIM API client.
 * Throws if the API key is not configured.
 *
 * @returns OpenAI client instance configured for NVIDIA base URL
 * @throws Error if NVIDIA_API_KEY is not set
 */
function getClient(): OpenAI {
  if (!clientInstance) {
    const apiKey = process.env.NVIDIA_API_KEY;

    if (!apiKey) {
      throw new Error(
        'NVIDIA_API_KEY is not configured. Add it to your .env.local file.'
      );
    }

    clientInstance = new OpenAI({
      apiKey,
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });
  }

  return clientInstance;
}

/**
 * Gets the configured NVIDIA client instance and model name.
 *
 * @returns Object containing the configured OpenAI client and model name
 */
export function getModel() {
  const client = getClient();
  const modelName = 'nvidia/nemotron-3-ultra-550b-a55b';

  return {
    client,
    modelName,
  };
}
