# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains all application code.
- `src/pages/` holds route-level screens (`login.tsx`, `dashboard.tsx`, `UserDashboard.tsx`).
- `src/components/` contains reusable UI and feature components (dialogs, rows, 3D model).
- `src/components/ui/` contains shared primitive UI wrappers.
- `src/services/` includes integrations (`firebase.ts`, `mailer.ts`).
- `src/server.js` is the local mailer API server (Resend + Express).
- `public/` and `src/assets/` store static assets.
- Build output is generated in `dist/`.

## Build, Test, and Development Commands
- `npm.cmd install` installs dependencies.
- `npm.cmd run dev` starts the Vite frontend dev server.
- `npm.cmd run mailer` starts the local mailer backend on `MAILER_PORT` (default `3001`).
- `npm.cmd run build` creates a production build in `dist/`.
- `npm.cmd run preview` serves the built app locally.
- `npm.cmd run lint` runs ESLint across frontend and mailer server code.

Example local workflow (2 terminals):
1. `npm.cmd run mailer`
2. `npm.cmd run dev`

## Coding Style & Naming Conventions
- Language: TypeScript for frontend (`.ts`, `.tsx`), ESM JavaScript for `src/server.js`.
- Use 2-space indentation and semicolons, matching existing files.
- Components: `PascalCase` file names (e.g., `ComplaintDetail.tsx`).
- Utilities/services: `camelCase` exports and descriptive names.
- Keep form validation and side effects explicit; avoid hidden mutation.
- Run `npm.cmd run lint` before committing.

## Testing Guidelines
- No formal test framework is configured yet.
- Minimum validation required for each change:
  - `npm.cmd run lint`
  - `npm.cmd run build`
- If you add tests, place them near feature code or under `src/__tests__/` and use `*.test.ts(x)` naming.

## Commit & Pull Request Guidelines
- Current history uses short messages (e.g., `fixed bugs`). Prefer clearer imperative commits:
  - `fix: validate complaint description word limit`
  - `feat: send user confirmation email on complaint create`
- PRs should include:
  - What changed and why
  - Any env/config updates (`.env`, Firebase, Resend)
  - Screenshots for UI changes
  - Manual verification steps and command output (`lint`, `build`)

## Security & Configuration Tips
- Never commit real secrets. Keep `RESEND_API_KEY` and mail settings in `.env`.
- Use a verified Resend sender domain for production (`MAIL_FROM`), not test-only sender addresses.
