/**
 * Ollama provider stub — for running fully local, free, open-weight
 * models (e.g. llama3, mistral) with zero API cost.
 * Swap in via AI_PROVIDER=ollama once Ollama is installed and running.
 */
const AIProvider = require('../aiProvider.interface');
const env = require('../../../config/env');
const { AppError } = require('../../../middleware/errorHandler');

class OllamaProvider extends AIProvider {
  constructor() {
    super();
    this.baseUrl = env.ai.ollama.baseUrl;
    this.model = 'llama3';
  }

  async complete(messages, options = {}) {
    const start = Date.now();

    let response;
    try {
      response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          messages,
          stream: false,
          options: { temperature: options.temperature ?? 0.7 },
        }),
      });
    } catch (err) {
      throw new AppError(
        `Could not reach Ollama at ${this.baseUrl}. Is it running? (${err.message})`,
        502
      );
    }

    if (!response.ok) {
      const errBody = await response.text();
      throw new AppError(`Ollama error (${response.status}): ${errBody}`, 502);
    }

    const data = await response.json();
    return {
      content: data.message?.content?.trim() || '',
      provider: 'ollama',
      model: this.model,
      tokensUsed: undefined,
      generationTimeMs: Date.now() - start,
    };
  }
}

module.exports = OllamaProvider;
