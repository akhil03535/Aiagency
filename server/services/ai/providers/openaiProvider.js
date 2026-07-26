/**
 * OpenAI provider stub. Implements the same AIProvider interface as Groq
 * so it can be swapped in via AI_PROVIDER=openai with zero business-logic changes.
 * Fill in when you have an OpenAI API key.
 */
const AIProvider = require('../aiProvider.interface');
const env = require('../../../config/env');
const { AppError } = require('../../../middleware/errorHandler');

class OpenAIProvider extends AIProvider {
  constructor() {
    super();
    this.apiKey = env.ai.openai.apiKey;
    this.model = 'gpt-4o-mini';
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
  }

  async complete(messages, options = {}) {
    if (!this.apiKey) {
      throw new AppError('OpenAI API key is not configured. Set OPENAI_API_KEY.', 500);
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
      throw new AppError(`OpenAI API error (${response.status}): ${errBody}`, 502);
    }

    const data = await response.json();
    return {
      content: data.choices?.[0]?.message?.content?.trim() || '',
      provider: 'openai',
      model: this.model,
      tokensUsed: data.usage?.total_tokens,
      generationTimeMs: Date.now() - start,
    };
  }
}

module.exports = OpenAIProvider;
