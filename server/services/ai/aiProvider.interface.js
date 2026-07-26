/**
 * AI Provider Interface.
 *
 * Every concrete provider (Groq, OpenAI, Gemini, Ollama, OpenRouter...)
 * must implement `complete(messages, options)` and return the shape below.
 * Business logic (controllers/services) NEVER talks to a provider directly —
 * it always goes through aiClient.js, which picks a provider based on config.
 * This means swapping providers never touches controllers or prompts.
 *
 * @typedef {Object} AICompletionResult
 * @property {string} content        - The generated text.
 * @property {string} provider       - Provider name, e.g. "groq".
 * @property {string} model          - Model name used.
 * @property {number} [tokensUsed]   - Total tokens used, if available.
 * @property {number} generationTimeMs - Wall-clock time for the call.
 */

class AIProvider {
  /**
   * @param {Array<{role: 'system'|'user'|'assistant', content: string}>} messages
   * @param {{ temperature?: number, maxTokens?: number }} [options]
   * @returns {Promise<AICompletionResult>}
   */
  // eslint-disable-next-line no-unused-vars
  async complete(messages, options = {}) {
    throw new Error('complete() must be implemented by the provider subclass');
  }
}

module.exports = AIProvider;
