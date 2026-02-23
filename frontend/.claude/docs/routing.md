# Routing & Auth Middleware (`src/routes/`)

All route constants live in `src/routes/routes.ts` as `ROUTES`.

The router uses React Router v7's middleware API:

- **`handleAuthRouting`**: Runs on every route. Calls `/auth/reissue` once per session (cached in module scope) to determine auth status (`authenticated` | `signup_required` | `unauthenticated`). Redirects to `/signin` if unauthenticated.
- **`HandleMobileRouting`**: Detects mobile user agents and redirects to `/mobile`.

Auth session state is tracked in `src/routes/middleware/auth-session.ts` as a module-level variable.
