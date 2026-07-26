# Environment Variables

## Server (`server/.env`)

Copy `server/.env.example` to `server/.env` and fill in real values.

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | No | `development` or `production` |
| `PORT` | No | Backend port (default 5000) |
| `CLIENT_URL` | No | Frontend origin, used for CORS |
| `DATABASE_URL` | **Yes** | Postgres connection string (Neon free tier works) |
| `JWT_SECRET` | **Yes** | Signs access tokens — generate with the command below |
| `JWT_EXPIRES_IN` | No | Access token lifetime (default `15m`) |
| `JWT_REFRESH_SECRET` | **Yes** | Signs refresh tokens — must differ from `JWT_SECRET` |
| `JWT_REFRESH_EXPIRES_IN` | No | Refresh token lifetime (default `7d`) |
| `BCRYPT_SALT_ROUNDS` | No | Password hash cost factor (default 12) |
| `AI_PROVIDER` | No | `groq` \| `openai` \| `ollama` (default `groq`) |
| `GROQ_API_KEY` | Yes, if using Groq | Free key from console.groq.com |
| `GROQ_MODEL` | No | Default `llama-3.3-70b-versatile` |
| `OPENAI_API_KEY` | Only if `AI_PROVIDER=openai` | |
| `OLLAMA_BASE_URL` | Only if `AI_PROVIDER=ollama` | Default `http://localhost:11434` |
| `RATE_LIMIT_*` | No | General API rate limiting knobs |
| `AI_RATE_LIMIT_*` | No | Stricter limits for `/api/generate` |
| `SMTP_*` | For password reset emails | Gmail SMTP or any free SMTP provider |
| `MAX_FILE_SIZE_MB` | No | Upload size cap (default 5MB) |
| `ADMIN_EMAIL` | No | Used to seed/identify the admin account |

Generate secure secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Client (`client/.env`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base, e.g. `http://localhost:5000/api` |
| `VITE_APP_NAME` | Display name used in UI |

Vite only exposes variables prefixed with `VITE_` to the browser bundle — never put
secrets here.

## Production notes

- **Vercel (frontend):** set `VITE_API_BASE_URL` to your deployed Render backend URL.
- **Render (backend):** set all `server/.env` variables in the Render dashboard's
  Environment tab. Never commit `.env` files.
- **Neon (database):** use the pooled connection string for `DATABASE_URL` in production
  to handle serverless-style connection bursts.
