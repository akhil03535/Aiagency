# API Documentation

Base URL (local dev): `http://localhost:5000/api`

All responses follow the shape:
```json
{ "success": true, "message": "...", "data": { ... } }
```
or on error:
```json
{ "success": false, "message": "...", "errors": [ { "field": "email", "message": "..." } ] }
```

---

## Auth

### `POST /auth/register`
Creates a new account. Rate limited (20 requests / 15 min).

**Body**
```json
{
  "name": "Priya Sharma",
  "email": "priya@business.com",
  "password": "at-least-8-chars-1-number"
}
```

**201 Response**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": { "id": "...", "name": "...", "email": "...", "role": "USER", "isActive": true, "createdAt": "..." },
    "accessToken": "eyJ..."
  }
}
```
Also sets an `httpOnly` `refreshToken` cookie (7-day expiry).

Notes:
- The very first user ever registered is automatically given `role: "ADMIN"`.
- Password requires min 8 characters and at least one digit.
- Returns `409` if the email is already registered.

---

### `POST /auth/login`
**Body**
```json
{ "email": "priya@business.com", "password": "..." }
```

**200 Response** — same shape as register.

Returns `401` with a generic "Invalid email or password" message for both wrong
password and non-existent email (prevents email enumeration).

---

### `POST /auth/logout`
Requires `Authorization: Bearer <accessToken>` header. Clears the stored refresh token
and the `refreshToken` cookie.

**200 Response**
```json
{ "success": true, "message": "Logged out successfully" }
```

---

### `GET /auth/me`
Requires `Authorization: Bearer <accessToken>` header. Returns the current user.

**200 Response**
```json
{ "success": true, "message": "Current user fetched", "data": { "user": { ... } } }
```

---

## Auth flow for the frontend

1. Register or log in → store `accessToken` (currently `localStorage`) and keep `user`
   in `AuthContext` state.
2. `apiClient` (Axios instance) attaches `Authorization: Bearer <token>` to every
   request automatically via a request interceptor.
3. On app load, if a token exists, call `GET /auth/me` to restore the session; on `401`,
   clear the token and treat the user as logged out.
4. `ProtectedRoute` redirects unauthenticated users to `/login`, preserving the
   originally requested path so login can redirect back to it.

> Silent refresh-token rotation (using the `httpOnly` cookie to mint a new access token
> without a full re-login) is not yet implemented — a good Phase 3+ enhancement.

---

## Profile

All routes below require `Authorization: Bearer <accessToken>`.

### `GET /profile`
Returns the current user's account fields (name, email, role, avatarUrl, etc.).

### `PUT /profile`
**Body** (all fields optional)
```json
{ "name": "New Name", "avatarUrl": "https://..." }
```
Updates only the fields provided. Email is not editable here (Phase 2 auth owns email).

---

## Business Profile

All routes below require `Authorization: Bearer <accessToken>` and are scoped to the
authenticated user — you can only read/edit/delete your own profiles.

### `GET /business-profile`
Returns all of the user's business profiles, default profile first.

### `POST /business-profile`
**Body**
```json
{
  "businessName": "Sharma Sweets & Bakery",
  "businessType": "Bakery",
  "website": "https://sharmasweets.example",
  "phone": "+91 98765 43210",
  "location": "Hyderabad, Telangana",
  "audience": "Young professionals aged 25-40",
  "brandTone": "FRIENDLY",
  "products": ["Gulab Jamun", "Kaju Katli"],
  "services": ["Custom orders", "Bulk catering"],
  "socialLinks": { "instagram": "https://instagram.com/sharmasweets" },
  "description": "Family-run sweet shop serving Hyderabad since 1998."
}
```
The first profile a user ever creates is automatically set as their default
(`isDefault: true`). Valid `brandTone` values: `PROFESSIONAL`, `CASUAL`, `FRIENDLY`,
`FORMAL`, `PLAYFUL`, `LUXURY`, `URGENT`, `EMOTIONAL`.

### `GET /business-profile/:id`
Returns a single profile. `404` if it doesn't exist or isn't owned by the caller.

### `PUT /business-profile/:id`
Same body shape as create; only provided fields are updated.

### `DELETE /business-profile/:id`
Deletes the profile. If it was the default and other profiles remain, the
next-oldest profile is automatically promoted to default.

### `PATCH /business-profile/:id/set-default`
Marks this profile as the default (unsets `isDefault` on all others for the user).

---

## Generation

All routes below require `Authorization: Bearer <accessToken>` and are subject to
AI-specific rate limiting (see `AI_RATE_LIMIT_*` in `.env`).

### `GET /generate/content-types`
Returns the list of supported content type slugs.

**200 Response**
```json
{
  "success": true,
  "message": "Supported content types",
  "data": {
    "contentTypes": ["instagram", "facebook", "linkedin", "twitter", "whatsapp", "..."]
  }
}
```

### `POST /generate`
Generates content for one of the 23 supported content types.

**Body**
```json
{
  "contentType": "instagram",
  "topic": "Diwali sweets sale",
  "goal": "Drive foot traffic",
  "targetAudience": "Families in Hyderabad",
  "tone": "FRIENDLY",
  "length": "medium",
  "language": "English",
  "offer": "20% off this week",
  "keywords": ["diwali", "sweets", "hyderabad"],
  "callToAction": "Visit us this weekend",
  "businessProfileId": null
}
```
`businessProfileId` is optional — if omitted, the user's default business profile
(`isDefault: true`) is used automatically for personalization. `tone` must be one of:
`PROFESSIONAL`, `CASUAL`, `FRIENDLY`, `FORMAL`, `PLAYFUL`, `LUXURY`, `URGENT`,
`EMOTIONAL`. `length` must be `short`, `medium`, or `long`.

**201 Response**
```json
{
  "success": true,
  "message": "Content generated successfully",
  "data": {
    "generation": {
      "id": "...",
      "contentType": "instagram",
      "topic": "Diwali sweets sale",
      "hashtags": ["#DiwaliSweets", "#HyderabadSweets", "..."],
      "aiProvider": "groq",
      "aiModel": "llama-3.3-70b-versatile",
      "generationTimeMs": 1240,
      "createdAt": "..."
    },
    "output": {
      "caption": "This Diwali, treat your family...",
      "hashtags": "#DiwaliSweets #HyderabadSweets ...",
      "shortVersion": "Diwali sweets are here! 20% off...",
      "raw": "CAPTION:\n...(full untouched AI response, always present as a fallback)"
    }
  }
}
```
The `output` object's keys vary by content type — they match the `LABEL:` sections
defined in that content type's prompt file (see `server/prompts/`). `output.raw`
is always present with the complete, unparsed response.

Every successful generation is persisted to the `Generation` table and automatically
logged to `History` — no separate "save" call is needed.

### `POST /generate/:id/regenerate`
Re-runs a previous generation using its original saved input. No body required.
Response shape is identical to `POST /generate`.

---

## History

All routes require `Authorization: Bearer <accessToken>`. History entries are
created automatically by the generation flow — there is no manual "create" endpoint.

### `GET /history`
Query params (all optional): `search`, `contentType`, `page` (default 1), `limit`
(default 20).

**200 Response**
```json
{
  "success": true,
  "message": "History fetched",
  "data": {
    "items": [
      {
        "historyId": "...",
        "createdAt": "...",
        "isFavorited": false,
        "id": "...",
        "contentType": "instagram",
        "topic": "Diwali sweets sale",
        "outputContent": "CAPTION:\n...",
        "hashtags": ["#DiwaliSweets", "..."],
        "inputPayload": { "topic": "...", "tone": "FRIENDLY", "...": "..." }
      }
    ]
  },
  "meta": { "page": 1, "limit": 20, "total": 5, "totalPages": 1 }
}
```
`historyId` identifies the History row (use this for delete); `id` is the underlying
Generation's id (use this for favoriting/reusing). `inputPayload` is the original
saved input, used by the reuse endpoint below.

### `DELETE /history/:id`
Soft-deletes a history entry (`:id` is the `historyId`, not the generation id). The
underlying Generation record is untouched.

### `GET /history/reuse/:generationId`
Returns `{ contentType, inputPayload }` for a past generation, so a client can
navigate to `/dashboard/generate/:contentType` and prefill the form.

---

## Favorites

All routes require `Authorization: Bearer <accessToken>`.

### `GET /favorites`
Returns starred generations, shaped like `GET /history` items but with `favoriteId`
instead of `historyId`.

### `POST /favorites/:generationId`
Stars a generation. Idempotent — favoriting an already-favorited generation returns
the existing favorite rather than erroring.

### `DELETE /favorites/:generationId`
Unstars a generation. `404` if it wasn't favorited.

---

## Templates

All routes require `Authorization: Bearer <accessToken>`. Read-only for regular
users; template CRUD is admin-only (see Admin section below).

### `GET /templates`
Query params (optional): `category` (category slug), `businessType`.

**200 Response**
```json
{
  "success": true,
  "message": "Templates fetched",
  "data": {
    "templates": [
      {
        "id": "...",
        "name": "Restaurant Starter Pack",
        "slug": "restaurant",
        "businessType": "Restaurant",
        "description": "Prebuilt prompt defaults tuned for restaurant businesses.",
        "promptHints": { "tone": "PROFESSIONAL", "suggestedAudience": "..." },
        "category": { "id": "...", "name": "Social Media", "slug": "social-media" }
      }
    ]
  }
}
```

### `GET /templates/categories`
Returns all template categories (Social Media, SEO, Content Writing, Email & SMS,
Video & Audio, Branding).

---

## Admin

All routes require `Authorization: Bearer <accessToken>` **and** the caller's
`role` must be `ADMIN` (enforced by `restrictTo('ADMIN')` — regular users get a
`403`). Recall that the very first user ever registered on the platform is
automatically made an admin.

### `GET /admin/dashboard`
**200 Response**
```json
{
  "success": true,
  "data": {
    "totalUsers": 42,
    "totalGenerations": 318,
    "generationsToday": 12,
    "activeUsers": 40,
    "failedGenerations": 3,
    "topContentTypes": [{ "contentType": "instagram", "count": 88 }],
    "recentActivity": [
      { "id": "...", "action": "LOGIN", "description": "User logged in",
        "user": { "name": "...", "email": "..." }, "createdAt": "..." }
    ]
  }
}
```

### `GET /admin/users`
Query params: `search`, `role` (`USER`/`ADMIN`), `page`, `limit`. Each user includes
`_count.generations`.

### `PATCH /admin/users/:id/status`
**Body:** `{ "isActive": false }`. An admin cannot deactivate their own account
this way (prevents accidental lockout) — that specific safeguard is enforced
server-side regardless of what the client sends.

### `PATCH /admin/users/:id/role`
**Body:** `{ "role": "ADMIN" }` or `{ "role": "USER" }`. Same self-protection
applies — an admin cannot demote themselves via this endpoint if it would leave
the platform with zero admins.

### `GET /admin/logs`
Query params: `action` (e.g. `LOGIN`, `REGISTER`, `LOGOUT`), `page`, `limit`.
Returns the `ActivityLog` audit trail, most recent first.

### `POST /admin/templates`, `PUT /admin/templates/:id`, `DELETE /admin/templates/:id`
Full CRUD for business templates. Delete is a soft-delete (`isActive: false`) so
existing `Generation` rows that reference a template via `templateId` are never
orphaned.

---

## Health

### `GET /health`
No auth required. Used for uptime checks / Render health checks.
