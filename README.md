# AI Agency

A production-grade AI SaaS platform that helps businesses generate marketing content —
Instagram/Facebook/LinkedIn posts, SEO copy, blog articles, email campaigns, ad copy,
festival greetings, and 15+ other content types — from a single saved business profile.

Built with **free-tier technologies** end to end: React + Vite + Tailwind, Node/Express,
PostgreSQL (Neon free tier), Prisma, JWT auth, and Groq for AI inference.

---

## Monorepo layout

```
ai-agency/
├── client/          React + Vite + Tailwind frontend
├── server/          Node + Express + Prisma backend
├── docs/            Architecture, API, deployment docs
└── database/        Schema notes / ER diagrams (rendered docs)
```

See `docs/ARCHITECTURE.md` for the full folder breakdown of `client/` and `server/`.

---

## Build phases

This project is being delivered in six phases. Do not skip ahead — each phase builds on
the last and is documented with what was built, how to run it, and what's next.

| Phase | Contents | Status |
|-------|----------|--------|
| 1 | Project setup, folder structure, dependencies, configuration | ✅ Done |
| 2 | Database migrations, Authentication (JWT, register/login/logout) | ✅ Done |
| 3 | Dashboard UI, Business Profile | ✅ Done |
| 4 | AI Services, Prompt Engineering, Generation APIs | ✅ Done |
| 5 | History, Templates, Admin Panel | ✅ Done (this delivery) |
| 6 | Testing, Optimization, Deployment | ⬜ Next |
| 6 | Testing, Optimization, Deployment | ⬜ |

---

## Quick start (Phase 1)

### 1. Prerequisites
- Node.js ≥ 18
- A free [Neon PostgreSQL](https://neon.tech) database (or any Postgres instance)
- A free [Groq API key](https://console.groq.com/keys)

### 2. Install dependencies
```bash
npm install
```
This installs both `client` and `server` workspaces from the root.

### 3. Configure environment variables

**Backend:**
```bash
cp server/.env.example server/.env
```
Fill in at minimum: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `GROQ_API_KEY`.

Generate strong secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Frontend:**
```bash
cp client/.env.example client/.env
```
Default values work for local development against the backend on port 5000.

### 4. Set up the database
```bash
npm run prisma:generate
npm run prisma:migrate
```
When prompted for a migration name, use something like `init`. This creates all tables
(Users, BusinessProfiles, Generations, Templates, Categories, History, Favorites,
Settings, ActivityLogs) as defined in `server/prisma/schema.prisma`.

Seed categories and business templates:
```bash
npm run --workspace=server prisma:seed
```

> The very first user who registers is automatically promoted to `ADMIN` — no manual
> DB editing needed to get an admin account.

### 5. Run the app
```bash
npm run dev
```
This starts both servers concurrently:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

Health check: http://localhost:5000/api/health

---

## What's live in Phase 1

- Full monorepo scaffold with clean separation of concerns
- Complete Prisma schema for all 9 core tables, with relations
- Express app with production security middleware (Helmet, CORS, rate limiting,
  XSS/HPP protection, centralized error handling)
- **Swappable AI provider architecture** — `server/services/ai/aiClient.js` is the only
  place business logic talks to an LLM. Currently wired to Groq; OpenAI and Ollama
  provider implementations already exist and can be activated by changing `AI_PROVIDER`
  in `.env` with zero changes to controllers or prompts
- One sample prompt file (`instagram.prompt.js`) establishing the pattern the other ~20
  content-type prompts will follow in Phase 4
- React frontend with working dark/light theme, Tailwind design system (glassmorphism
  cards, brand palette, animations), routing, and a real landing page

## What's live in Phase 2

- Real Prisma migrations (run `npm run prisma:migrate` against your Neon database)
- `POST /api/auth/register` — bcrypt-hashed password, auto-creates a `Settings` row,
  first user ever created becomes `ADMIN`
- `POST /api/auth/login` — generic error message on bad credentials (doesn't leak
  which emails exist), issues access + refresh tokens
- `POST /api/auth/logout` — protected, clears the stored refresh token
- `GET /api/auth/me` — protected, returns the current user
- Refresh token set as an `httpOnly`, `sameSite=strict` cookie; access token returned in
  the response body for the frontend to hold in memory/localStorage
- Auth-specific rate limiting (20 attempts / 15 min) on register + login
- Every auth event (register/login/logout) written to `ActivityLog` for the future
  admin panel
- Frontend: fully working `AuthContext` (register/login/logout, session restore on
  page load), Login page, Register page, `ProtectedRoute` wrapper, and a placeholder
  Dashboard page proving the full flow end-to-end
- Landing page CTAs now link to real `/register` and `/login` routes

**Not included in Phase 2** (by design, per your direction): forgot/reset password and
email sending. The `passwordResetToken`/`passwordResetExpires` fields already exist on
the `User` model in the schema so this can be added later without a migration.

## What's live in Phase 3

**Backend**
- `GET/PUT /api/profile` — view/edit the logged-in user's name and avatar
- Full Business Profile CRUD: `GET/POST /api/business-profile`,
  `GET/PUT/DELETE /api/business-profile/:id`, `PATCH /api/business-profile/:id/set-default`
- First profile a user creates is automatically flagged `isDefault`; deleting the
  default profile auto-promotes the next-oldest one so there's always a default
  once at least one profile exists
- All business-profile routes are ownership-scoped — a user can only read/edit/delete
  their own profiles (enforced in `businessProfileService`, not just the route)

**Frontend**
- `DashboardLayout` — responsive shell with a fixed sidebar (desktop) / slide-over
  drawer (mobile), sticky top bar, dark/light toggle, and profile dropdown
- Dashboard home page: grid of all 23 generator cards (from the master spec), with
  live search and category filtering (Social Media, SEO, Content Writing, Email & SMS,
  Video & Audio, Branding), loading skeletons, and an empty-state for no matches
- Business Profile page: full form (name, type, website, phone, location, audience,
  brand tone, description, products/services as tag inputs, social links) wired to the
  real API, with create/edit/delete
- Settings page: edit display name (calls `PUT /api/profile`) and switch light/dark
  theme, persisted to `localStorage`
- History and Favorites pages are present in navigation with a clear "coming in Phase 5"
  placeholder rather than a broken link
- A banner nudges users without a business profile to set one up before generating
  content (the profile is what personalizes AI output starting Phase 4)

**Verified for this delivery:** `npm run build` (Vite production build) and `eslint`
both pass clean with zero errors on the client; server passes `eslint` with only two
expected warnings from an intentional destructuring pattern.

## What's live in Phase 4

**Backend**
- All 23 content types from the master spec now have a real prompt file under
  `server/prompts/` (24 files including the shared helper), each producing
  structured, labeled output (e.g. `CAPTION:`, `HASHTAGS:`, `SHORT_VERSION:`)
  tailored to that content type's real-world constraints (character limits for
  SMS/meta titles/tweets, Markdown headings for blog posts, etc.)
- `server/prompts/index.js` — a single registry mapping each content-type slug to
  its prompt builder; adding a new content type is one file + one registry line
- `server/services/generationService.js` — orchestrates the full flow: resolve the
  user's business profile (explicit or default) → build the prompt → call
  `aiClient` (Groq by default, swappable) → parse the structured output → persist
  to `Generation` and auto-log to `History`. Failed AI calls are still recorded
  (with `status: FAILED` and the error message) rather than silently lost
- `server/utils/outputParser.js` — parses the `LABEL:` convention into a clean
  object per generation, so the frontend renders each field (caption, hashtags,
  short version, etc.) separately instead of one undifferentiated blob
- `POST /api/generate` — generates content for any of the 23 content types
- `POST /api/generate/:id/regenerate` — re-runs a previous generation with the
  same inputs (useful when the first result isn't quite right)
- `GET /api/generate/content-types` — lists supported content type slugs
- AI-specific rate limiting applied to all generation endpoints

**Frontend**
- Dashboard generator cards now navigate to a real generator page
  (`/dashboard/generate/:slug`) instead of a placeholder
- Generator page: full input form (topic, goal, audience, tone, length, language,
  offer, keywords as tag chips, call to action), live generation timer, loading
  states, and a structured output panel
- Output panel renders each parsed field (caption, hashtags, short version, etc.)
  in its own card with a **Copy** button and live character counter
- **Regenerate**, **Download** (as a `.txt` file), and **Save** actions on every
  result — regenerate calls the real API using the persisted input; save confirms
  the generation (already auto-saved server-side) is in history
- A banner nudges users without a business profile to set one up before
  generating, same pattern as the dashboard home page

**Verified for this delivery:**
- `npm run build` (Vite) and `eslint` pass clean with zero errors on the client
- `eslint` passes on the server with only the same two pre-existing warnings
- Smoke-tested the entire backend (all routes, controllers, services, and all 24
  prompt modules) by mocking the Prisma client, since this sandbox can't reach
  Prisma's binary CDN or a live database — confirmed `app.js` loads with every
  route wired correctly
- Ran an actual prompt builder end-to-end with realistic input (a Diwali sweets
  shop) and confirmed the generated chat messages are well-formed
- Ran the output parser against a realistic sample AI response and confirmed it
  correctly splits `CAPTION:` / `HASHTAGS:` / `SHORT_VERSION:` into structured
  fields and extracts a clean hashtags array

**Honest gap:** I have not run a generation against the live Groq API from this
environment (network here is restricted to package registries). The prompt
construction, output parsing, and full request/response wiring are verified
end-to-end with realistic fixtures — but please run one real generation yourself
after pulling this down, just in case Groq's actual output format surprises the
parser in some edge case (e.g. a model that doesn't follow the label convention
perfectly). If that happens, the `raw` field is always included in the parsed
output as a fallback so nothing is silently lost.

## What's live in Phase 5

**Backend**
- `GET /api/history` — search + filter by content type + paginated, includes an
  `isFavorited` flag per item (one extra query, not N+1)
- `DELETE /api/history/:id` — soft-delete (the underlying `Generation` and audit
  trail survive; only the user's visible history entry is removed)
- `GET /api/history/reuse/:generationId` — returns a past generation's original
  saved input so the generator form can be prefilled for a one-click "reuse"
- `GET/POST/DELETE /api/favorites` — star/unstar a generation, backed by the
  schema's `@@unique([userId, generationId])` constraint (no duplicate favorites)
- `GET /api/templates` and `GET /api/templates/categories` — read access to the
  19 seeded business templates (Restaurant, Gym, Temple, Astrologer, etc.)
- Full **Admin API** gated by `restrictTo('ADMIN')`: `GET /api/admin/dashboard`
  (user/generation counts, top content types, recent activity), `GET/PATCH
  /api/admin/users` (search, activate/deactivate, promote/demote — with
  self-demotion and self-deactivation protection so an admin can't accidentally
  lock themselves out), `GET /api/admin/logs` (the `ActivityLog` audit trail
  that's been recording since Phase 2), and template CRUD for admins

**Frontend**
- Real **History** page: search, content-type filter, delete, favorite-toggle,
  and one-click **Reuse** that navigates to the right generator with the form
  pre-filled from the original input — replaces the Phase 4 placeholder
- Real **Favorites** page — same card UI, starred items only
- New **Templates** page: browse all 19 seeded business templates by category,
  pick one to prefill a generator's tone/audience defaults instantly
- The generator page itself now supports both prefill paths: arriving via
  "Reuse" from History/Favorites, or via a template picker built into the
  generator form directly
- New **Admin section** (sidebar only visible to `role: 'ADMIN'` users):
  dashboard with stat cards and a top-content-types bar chart, a user
  management table (search, promote/demote, activate/deactivate), and an
  activity log viewer with action-type filtering

**Verified for this delivery:**
- `npm run build` (Vite) and `eslint` pass clean with zero errors on the client
- `eslint` passes on the server with only the same two pre-existing warnings
- Smoke-tested the entire backend (every route including the new history,
  favorites, templates, and admin endpoints) by mocking the Prisma client —
  confirmed `app.js` loads with everything wired correctly
- Manually cross-checked every new frontend service call against its backend
  route and response shape field-by-field (e.g. confirmed `historyService.list()`
  reads `data.data.items` / `data.meta` correctly against what
  `utils/apiResponse.js`'s `success()` helper actually produces) rather than
  assuming they matched
- Found and fixed a stale-closure bug in the generator page's template
  auto-apply logic (calling a function via a ref before its render had
  flushed the templates it needed) before shipping — worth mentioning since
  it's the kind of bug that only shows up once you actually trace the
  render/effect timing rather than eyeball the code

**Honest gap:** as with every phase, I haven't run this against your live Neon
database or a real browser session — the sandbox here can't reach either. The
backend logic and frontend/backend contract are verified as thoroughly as I
can without live infrastructure; please click through History → Reuse →
Generate, Favorites, Templates → apply to generator, and the Admin panel
(promote your own account to ADMIN via the database or Prisma Studio if
you're testing solo, since the very first registered user is auto-admin)
once you have it running.

## What's next (Phase 6 preview)

Phase 6 will implement:
- Automated tests (unit tests for services/prompts/parsers, integration tests
  for the auth + generation flows via supertest)
- Performance/optimization pass: query review, response caching where sensible,
  frontend bundle analysis
- Deployment: Vercel config for the frontend, Render config for the backend,
  Neon production database setup, and a step-by-step deployment guide

See `docs/` for architecture and API documentation as it's built out phase by phase.
