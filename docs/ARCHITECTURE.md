# Architecture

## Overview

AI Agency is a monorepo with two independently deployable apps (`client`, `server`)
sharing a single Git history. The backend follows a layered architecture:

```
Route → Validator → Controller → Service → (Prisma | AI Client) → Response
```

- **Routes** define URL + HTTP method + middleware chain only. No logic.
- **Validators** (express-validator) reject malformed input before it reaches a controller.
- **Controllers** parse the request, call one or more services, and shape the response.
  They never talk to Prisma or the AI provider directly.
- **Services** contain business logic. `services/ai/` is the AI abstraction layer;
  future services (e.g. `services/email/`, `services/billing/`) follow the same pattern.
- **Prompts** are pure functions that take structured input and return chat messages —
  no side effects, easily unit-testable, one file per content type.

## Backend folder reference

```
server/
├── controllers/     Request handlers — parse input, call services, send response
├── routes/          Express routers, one file per feature area
├── middleware/       auth.js, errorHandler.js, rateLimiter.js, validateRequest.js
├── services/
│   ├── authService.js
│   ├── businessProfileService.js
│   ├── generationService.js         Orchestrates prompt → AI → parse → persist
│   ├── historyService.js            Search/filter/delete/reuse for past generations
│   ├── favoriteService.js           Star/unstar generations
│   ├── templateService.js           Read access to seeded business templates
│   ├── adminService.js              Dashboard stats, user management, activity logs
│   └── ai/
│       ├── aiClient.js              Single entry point for all AI calls
│       ├── aiProvider.interface.js  Contract every provider must implement
│       └── providers/               groqProvider.js, openaiProvider.js, ollamaProvider.js
├── prompts/
│   ├── index.js                     Registry: contentType slug → prompt builder
│   ├── _shared.js                   Shared helpers (business context block, etc.)
│   └── *.prompt.js                  One file per content type (23 total)
├── models/           (Reserved — Prisma generates models from schema.prisma;
│                      this folder is for any non-DB domain models added later)
├── utils/            apiResponse.js, tokens.js, and other stateless helpers
├── config/           env.js, prisma.js, logger.js — the only files that read process.env
├── validators/       express-validator chains, one file per route group
├── prisma/           schema.prisma, seed.js, migrations/
└── uploads/          User-uploaded files (logos, avatars) — gitignored contents
```

## Frontend folder reference

```
client/src/
├── components/       Reusable UI primitives — GeneratorCard, GenerationResultCard,
│                      Sidebar, Topbar, ProfileDropdown, FormField, SelectField,
│                      TextareaField, TagInput, SkeletonCard, ComingSoonPanel,
│                      OutputSection, StatCard, ProtectedRoute, AdminRoute
├── pages/            Route-level components, including GeneratorPage.jsx (shared
│                      form + output UI for all 23 generator types), HistoryPage,
│                      FavoritesPage, TemplatesPage, and the Admin* pages
├── layouts/           AuthLayout (login/register shell), DashboardLayout
│                      (sidebar + topbar shell wrapping nested dashboard routes)
├── hooks/             useBusinessProfiles, and other custom hooks
├── services/          apiClient.js + one file per resource (auth.service.js,
│                      businessProfile.service.js, ...)
├── contexts/          ThemeContext, AuthContext (React Context providers)
├── assets/            Images, icons not served from /public
├── styles/            index.css (Tailwind entry + design tokens)
└── utils/             contentTypes.js (registry of all 23 generator types),
                       formatting/validation helpers
```

## Why the AI layer is isolated

The brief requires the AI provider to be swappable without touching business logic.
This is enforced structurally, not just by convention:

1. `aiProvider.interface.js` defines the contract (`complete(messages, options)`).
2. Every provider (`groqProvider.js`, `openaiProvider.js`, `ollamaProvider.js`) implements
   that contract and knows nothing about the rest of the app.
3. `aiClient.js` is a factory that reads `AI_PROVIDER` from env and instantiates the
   matching provider **once** at startup.
4. Controllers and prompt files only ever import `aiClient`, never a specific provider.

To add a new provider (e.g. Gemini): create `services/ai/providers/geminiProvider.js`
implementing the interface, register it in the `providers` map in `aiClient.js`, done.
No controller, route, or prompt file changes.

## Database schema summary

See `server/prisma/schema.prisma` for the authoritative definitions. Summary:

| Table | Purpose |
|---|---|
| `users` | Auth + role (USER/ADMIN) |
| `business_profiles` | Saved business context auto-applied to generations |
| `categories` | Groups of templates (Social Media, SEO, Branding, ...) |
| `templates` | Prebuilt business-type presets (Restaurant, Gym, Temple, ...) |
| `generations` | Every AI generation, full input + output, linked to profile/template |
| `history` | Soft-deletable log of a user's generations |
| `favorites` | User-starred generations |
| `settings` | Per-user preferences (theme, language, default tone) |
| `activity_logs` | Audit trail (logins, generations, profile edits) for the admin panel |

## Security posture (Phase 1 baseline)

- Helmet for secure HTTP headers
- CORS restricted to `CLIENT_URL`
- `express-rate-limit`: general, auth-specific, and AI-specific limiters
- `xss-clean` + `hpp` on all incoming request data
- `bcrypt` for password hashing (Phase 2)
- JWT access + refresh token pattern, short-lived access tokens
- All secrets read only through `config/env.js`, never inline `process.env` calls
- Prisma parameterizes all queries (no raw SQL by default → no SQL injection surface)
