/**
 * Groq provider (free-tier LLM inference, OpenAI-compatible API shape).
 * Implements the AIProvider interface.
 */
const AIProvider = require('../aiProvider.interface');
const env = require('../../../config/env');
const { AppError } = require('../../../middleware/errorHandler');

class GroqProvider extends AIProvider {
  constructor() {
    super();
    this.apiKey = env.ai.groq.apiKey;
    this.model = env.ai.groq.model;
    this.apiUrl = env.ai.groq.apiUrl;
  }

  async complete(messages, options = {}) {
    if (!this.apiKey) {
      throw new AppError(
        'Groq API key is not configured. Set GROQ_API_KEY in server/.env',
        500
      );
    }

    const start = Date.now();

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 1024,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new AppError(`Groq API error (${response.status}): ${errBody}`, 502);
    }

    const data = await response.json();
    const generationTimeMs = Date.now() - start;

    return {
      content: data.choices?.[0]?.message?.content?.trim() || '',
      provider: 'groq',
      model: this.model,
      tokensUsed: data.usage?.total_tokens,
      generationTimeMs,
    };
  }
}

module.exports = GroqProvider;
