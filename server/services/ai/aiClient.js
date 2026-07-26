/**
 * AI Client — the ONLY entry point business logic should use to talk to an LLM.
 *
 * Usage:
 *   const aiClient = require('./services/ai/aiClient');
 *   const result = await aiClient.complete(messages, { temperature: 0.8 });
 *
 * The active provider is chosen from env.ai.provider (AI_PROVIDER env var).
 * To add a new provider: create services/ai/providers/xProvider.js implementing
 * AIProvider, then register it in the `providers` map below. No other file
 * in the codebase needs to change.
 */
const env = require('../../config/env');
const { AppError } = require('../../middleware/errorHandler');

const GroqProvider = require('./providers/groqProvider');
const OpenAIProvider = require('./providers/openaiProvider');
const OllamaProvider = require('./providers/ollamaProvider');

const providers = {
  groq: GroqProvider,
  openai: OpenAIProvider,
  ollama: OllamaProvider,
  // gemini: GeminiProvider,       // add when implemented
  // openrouter: OpenRouterProvider, // add when implemented
};

class AIClient {
  constructor() {
    const ProviderClass = providers[env.ai.provider];
    if (!ProviderClass) {
      throw new AppError(
        `Unknown AI_PROVIDER "${env.ai.provider}". Valid options: ${Object.keys(providers).join(', ')}`,
        500
      );
    }
    this.provider = new ProviderClass();
  }

  /**
   * Sends a chat-style completion request to the active provider.
   * @param {Array<{role: string, content: string}>} messages
   * @param {{temperature?: number, maxTokens?: number}} [options]
   */
  async complete(messages, options = {}) {
    return this.provider.complete(messages, options);
  }
}

// Singleton — provider is resolved once at startup based on env config.
module.exports = new AIClient();
