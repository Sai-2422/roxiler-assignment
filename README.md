# Store Ratings Platform

A complete, Docker-first implementation of the **Store Ratings** challenge.

## Quick start

```bash
docker compose up -d --build
```

* API: http://localhost:4000/health → returns `{ ok: true }`
* Web: http://localhost:5173

**Seeded admin:** `admin@demo.com / Admin@123!`

## Mapping to requirements

* Single login + roles (ADMIN, USER, OWNER) + normal-user signup → backend `routes/auth.ts`, frontend login/signup pages.
* Admin: metrics, users list (filters/sorting), user detail (owner average), store list with overall rating, create store → `routes/admin.ts` + `/pages/admin/*`.
* User: store list with overall rating and my rating, submit/modify rating (1–5) → `routes/stores.ts` + `/pages/Stores.tsx`.
* Owner: dashboard (raters list + average) → `routes/owner.ts` + `/pages/owner/Dashboard.tsx`.
* Validations (Name 20–60, Address ≤ 400, Password 8–16 with 1 uppercase + 1 special, Email) → shared Zod schemas on both sides.
* Security: HTTP-only JWT cookies, bcrypt, helmet, CORS, simple rate limiting.
* Prisma schema + seed → `backend/prisma/*` and `backend/src/seed.ts`.
