/**
 * Centralized environment configuration.
 * All env vars are read once here and validated, so the rest of the
 * app never touches process.env directly. This makes it easy to see
 * every required variable in one place and fail fast if one is missing.
 */
require('dotenv').config();

const required = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

function assertRequiredEnvVars() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.error(
      `\n[FATAL] Missing required environment variables: ${missing.join(', ')}\n` +
        `Copy server/.env.example to server/.env and fill in real values.\n`
    );
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  assertRequiredEnvVars();
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  database: {
    url: process.env.DATABASE_URL,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,
  },

  ai: {
    provider: process.env.AI_PROVIDER || 'groq',
    groq: {
      apiKey: process.env.GROQ_API_KEY || '',
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      apiUrl:
        process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions',
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
    },
    gemini: {
      apiKey: process.env.GEMINI_API_KEY || '',
    },
    openrouter: {
      apiKey: process.env.OPENROUTER_API_KEY || '',
    },
    ollama: {
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    },
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
    aiWindowMs: parseInt(process.env.AI_RATE_LIMIT_WINDOW_MS, 10) || 60 * 60 * 1000,
    aiMaxRequests: parseInt(process.env.AI_RATE_LIMIT_MAX_REQUESTS, 10) || 30,
  },

  email: {
    from: process.env.EMAIL_FROM || 'noreply@aiagency.com',
    smtpHost: process.env.SMTP_HOST,
    smtpPort: parseInt(process.env.SMTP_PORT, 10) || 587,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
  },

  uploads: {
    maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 5,
    dir: process.env.UPLOAD_DIR || 'uploads',
  },

  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@aiagency.com',
  },

  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV !== 'production',
};

module.exports = env;
